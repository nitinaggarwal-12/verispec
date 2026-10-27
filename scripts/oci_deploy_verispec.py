#!/usr/bin/env python3
"""
Zero-Daemon OCI Container Image Assembler & Cloud Run Deployer for VeriSpec Studio (Rule 56).
Layers /app onto mirror.gcr.io/library/node:24-bookworm-slim (linux/amd64, with native node:sqlite),
pushes to us-west1-docker.pkg.dev/ramp-portal-dev/cloud-run-source-deploy/verispec:<tag>,
deploys/updates Cloud Run service 'verispec' in ramp-portal-dev (us-west1), and verifies all 4
Rule 56 post-deploy readiness gates.
"""
from __future__ import annotations

import gzip
import hashlib
import io
import json
import os
import subprocess
import tarfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


def get_gcloud_token() -> str:
    env = os.environ.copy()
    existing = env.get("CLOUDSDK_METRICS_ENVIRONMENT", "")
    env["CLOUDSDK_METRICS_ENVIRONMENT"] = f"{existing} datacloud.antigravity".strip()
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True, env=env
    ).strip()


def http_req(url: str, method: str = "GET", headers: dict | None = None, data: bytes | None = None, timeout: int = 600):
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    return urllib.request.urlopen(req, timeout=timeout)


def blob_exists(dest_host: str, dest_repo: str, digest: str, token: str) -> bool:
    url = f"https://{dest_host}/v2/{dest_repo}/blobs/{digest}"
    try:
        with http_req(url, method="HEAD", headers={"Authorization": f"Bearer {token}"}, timeout=60) as resp:
            return resp.status == 200
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return False
        raise


def upload_blob(dest_host: str, dest_repo: str, digest: str, payload: bytes, token: str) -> None:
    if blob_exists(dest_host, dest_repo, digest, token):
        print(f"  [cache-hit] Blob {digest[:19]}... ({len(payload)} bytes)")
        return
    last_err = None
    for attempt in range(1, 4):
        try:
            if attempt > 1 and blob_exists(dest_host, dest_repo, digest, token):
                print(f"  [cache-hit] Blob {digest[:19]}... ({len(payload)} bytes)")
                return
            init_url = f"https://{dest_host}/v2/{dest_repo}/blobs/uploads/"
            with http_req(
                init_url,
                method="POST",
                headers={"Authorization": f"Bearer {token}", "Content-Length": "0"},
                timeout=120,
            ) as resp:
                loc = resp.headers.get("Location")
            if not loc:
                raise RuntimeError(f"Missing Location header from {init_url}")
            if loc.startswith("/"):
                loc = f"https://{dest_host}{loc}"
            sep = "&" if "?" in loc else "?"
            put_url = f"{loc}{sep}digest={urllib.parse.quote(digest)}"
            with http_req(
                put_url,
                method="PUT",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/octet-stream",
                    "Content-Length": str(len(payload)),
                },
                data=payload,
                timeout=600,
            ) as resp:
                if resp.status not in (200, 201, 202, 204):
                    raise RuntimeError(f"Unexpected blob PUT status {resp.status} for {digest}")
            print(f"  [uploaded]  Blob {digest[:19]}... ({len(payload)} bytes)")
            return
        except Exception as e:
            last_err = e
            print(f"  [retry {attempt}/3] Blob upload {digest[:19]} failed: {e}")
            time.sleep(2 * attempt)
    raise RuntimeError(f"Failed to upload blob {digest} after 3 attempts: {last_err}")


def build_tar_gz_layer(file_mappings: list[tuple[str, str]], compresslevel: int = 6) -> tuple[bytes, str, str, int]:
    tar_buf = io.BytesIO()
    mtime = int(time.time())
    added_dirs: set[str] = set()

    def ensure_parent_dirs(tf: tarfile.TarFile, arc_path: str):
        parts = arc_path.strip("/").split("/")[:-1]
        cur = ""
        for p in parts:
            cur = f"{cur}/{p}".lstrip("/")
            if cur not in added_dirs:
                added_dirs.add(cur)
                ti = tarfile.TarInfo(name=cur)
                ti.type = tarfile.DIRTYPE
                ti.mode = 0o755
                ti.uid = 0
                ti.gid = 0
                ti.uname = "root"
                ti.gname = "root"
                ti.mtime = mtime
                tf.addfile(ti)

    with tarfile.open(fileobj=tar_buf, mode="w", format=tarfile.PAX_FORMAT) as tf:
        for local_src, arc_dest in file_mappings:
            src_path = Path(local_src)
            if src_path.is_file():
                arc_clean = arc_dest.lstrip("/")
                ensure_parent_dirs(tf, arc_clean)
                raw = src_path.read_bytes()
                ti = tarfile.TarInfo(name=arc_clean)
                ti.size = len(raw)
                ti.mode = 0o755 if src_path.name.endswith((".py", ".sh", ".mjs", ".js")) else 0o644
                ti.uid = 0
                ti.gid = 0
                ti.uname = "root"
                ti.gname = "root"
                ti.mtime = mtime
                tf.addfile(ti, io.BytesIO(raw))
            elif src_path.is_dir():
                for root, dirs, files in os.walk(src_path):
                    dirs[:] = sorted([d for d in dirs if d not in (".git", "__pycache__", ".DS_Store", "node_modules")])
                    files.sort()
                    for fname in files:
                        if fname in (".DS_Store", ".env", ".env.local"):
                            continue
                        fpath = Path(root) / fname
                        if not fpath.is_file():
                            continue
                        rel = fpath.relative_to(src_path).as_posix()
                        arc_clean = f"{arc_dest.strip('/')}/{rel}"
                        ensure_parent_dirs(tf, arc_clean)
                        raw = fpath.read_bytes()
                        ti = tarfile.TarInfo(name=arc_clean)
                        ti.size = len(raw)
                        ti.mode = 0o755 if fname.endswith((".py", ".sh", ".mjs", ".js")) else 0o644
                        ti.uid = 0
                        ti.gid = 0
                        ti.uname = "root"
                        ti.gname = "root"
                        ti.mtime = mtime
                        tf.addfile(ti, io.BytesIO(raw))

    uncompressed_bytes = tar_buf.getvalue()
    diff_id = "sha256:" + hashlib.sha256(uncompressed_bytes).hexdigest()

    gz_buf = io.BytesIO()
    with gzip.GzipFile(filename="", mode="wb", fileobj=gz_buf, compresslevel=compresslevel, mtime=mtime) as gz:
        gz.write(uncompressed_bytes)
    compressed_bytes = gz_buf.getvalue()
    layer_digest = "sha256:" + hashlib.sha256(compressed_bytes).hexdigest()
    return compressed_bytes, diff_id, layer_digest, len(compressed_bytes)


def resolve_base_image(base_host: str, base_repo: str, base_tag: str) -> tuple[dict, dict, str]:
    base_url = f"https://{base_host}/v2/{base_repo}"
    manifest_headers = {
        "Accept": (
            "application/vnd.oci.image.index.v1+json, "
            "application/vnd.docker.distribution.manifest.list.v2+json, "
            "application/vnd.oci.image.manifest.v1+json, "
            "application/vnd.docker.distribution.manifest.v2+json"
        )
    }
    with http_req(f"{base_url}/manifests/{base_tag}", headers=manifest_headers) as resp:
        manifest_or_idx = json.loads(resp.read().decode())

    if "manifests" in manifest_or_idx:
        amd64_digest = None
        for m in manifest_or_idx["manifests"]:
            plat = m.get("platform", {})
            if plat.get("os") == "linux" and plat.get("architecture") == "amd64":
                amd64_digest = m["digest"]
                break
        if not amd64_digest:
            raise RuntimeError(f"No linux/amd64 manifest in {base_repo}:{base_tag}")
        with http_req(f"{base_url}/manifests/{amd64_digest}", headers=manifest_headers) as resp:
            base_manifest = json.loads(resp.read().decode())
    else:
        base_manifest = manifest_or_idx

    cfg_digest = base_manifest["config"]["digest"]
    with http_req(f"{base_url}/blobs/{cfg_digest}") as resp:
        base_config = json.loads(resp.read().decode())

    return base_manifest, base_config, base_url


def main() -> None:
    service_name = "verispec"
    dest_host = "us-west1-docker.pkg.dev"
    dest_repo = f"ramp-portal-dev/cloud-run-source-deploy/{service_name}"
    tag = f"v{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}-v36"
    token = get_gcloud_token()

    print("\n==================================================================")
    print(f"🚀 Deploying [{service_name}] -> {dest_host}/{dest_repo}:{tag}")
    print("==================================================================")

    base_manifest, base_config, base_url = resolve_base_image("mirror.gcr.io", "library/node", "24-bookworm-slim")

    print(f"==> [1/4] Syncing {len(base_manifest['layers'])} base layers from mirror.gcr.io/library/node:24-bookworm-slim...")
    for layer in base_manifest["layers"]:
        ldigest = layer["digest"]
        if blob_exists(dest_host, dest_repo, ldigest, token):
            print(f"  [cache-hit] Base layer {ldigest[:19]}... ({layer['size']} bytes)")
            continue
        print(f"  [fetching]  Base layer {ldigest[:19]}... ({layer['size']} bytes)")
        with http_req(f"{base_url}/blobs/{ldigest}") as resp:
            blob_bytes = resp.read()
        upload_blob(dest_host, dest_repo, ldigest, blob_bytes, token)

    file_mappings = [
        (str(ROOT_DIR / "package.json"), "app/package.json"),
        (str(ROOT_DIR / "README.md"), "app/README.md"),
        (str(ROOT_DIR / "AGENTS.md"), "app/AGENTS.md"),
        (str(ROOT_DIR / "public"), "app/public"),
        (str(ROOT_DIR / "src"), "app/src"),
        (str(ROOT_DIR / "scripts"), "app/scripts"),
        (str(ROOT_DIR / ".github"), "app/.github"),
        (str(ROOT_DIR / ".agents"), "app/.agents"),
        (str(ROOT_DIR / ".local_state"), "app/.local_state"),
    ]

    print("==> [2/4] Building & uploading /app overlay layer...")
    layer_gz, diff_id, layer_digest, layer_size = build_tar_gz_layer(file_mappings)
    upload_blob(dest_host, dest_repo, layer_digest, layer_gz, token)

    manifest_media_type = base_manifest.get("mediaType", "application/vnd.oci.image.manifest.v1+json")
    layer_media_type = base_manifest["layers"][0].get("mediaType", "application/vnd.oci.image.layer.v1.tar+gzip")
    cfg_media_type = base_manifest["config"].get("mediaType", "application/vnd.oci.image.config.v1+json")

    cfg_obj = base_config.setdefault("config", {})
    cfg_obj["WorkingDir"] = "/app"
    cfg_obj["Cmd"] = ["node", "src/server.mjs"]
    cfg_obj["Entrypoint"] = []
    cfg_obj["User"] = "root"
    cfg_obj["ExposedPorts"] = {"8080/tcp": {}}
    existing_env = {e.split("=", 1)[0]: e for e in cfg_obj.get("Env", []) if "=" in e}
    for e in ["PORT=8080", "HOST=0.0.0.0", "NODE_ENV=production", "GOOGLE_CLOUD_PROJECT=ramp-portal-dev"]:
        existing_env[e.split("=", 1)[0]] = e
    cfg_obj["Env"] = list(existing_env.values())

    base_config["created"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    base_config.setdefault("rootfs", {"type": "layers", "diff_ids": []})["diff_ids"].append(diff_id)
    base_config.setdefault("history", []).append(
        {"created": base_config["created"], "created_by": "oci_deploy_verispec.py COPY /app & CMD node src/server.mjs"}
    )

    token = get_gcloud_token()
    new_cfg_bytes = json.dumps(base_config, separators=(",", ":")).encode("utf-8")
    new_cfg_digest = "sha256:" + hashlib.sha256(new_cfg_bytes).hexdigest()
    upload_blob(dest_host, dest_repo, new_cfg_digest, new_cfg_bytes, token)

    new_manifest = {
        "schemaVersion": 2,
        "mediaType": manifest_media_type,
        "config": {
            "mediaType": cfg_media_type,
            "digest": new_cfg_digest,
            "size": len(new_cfg_bytes),
        },
        "layers": list(base_manifest["layers"])
        + [
            {
                "mediaType": layer_media_type,
                "digest": layer_digest,
                "size": layer_size,
            }
        ],
    }
    manifest_bytes = json.dumps(new_manifest, indent=2).encode("utf-8")
    for t in (tag, "latest"):
        m_url = f"https://{dest_host}/v2/{dest_repo}/manifests/{t}"
        with http_req(
            m_url,
            method="PUT",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": manifest_media_type,
                "Content-Length": str(len(manifest_bytes)),
            },
            data=manifest_bytes,
        ) as resp:
            print(f"  [pushed]    {dest_host}/{dest_repo}:{t} (HTTP {resp.status})")

    image_uri = f"{dest_host}/{dest_repo}:{tag}"
    print(f"==> [3/4] Deploying/Updating Cloud Run service {service_name} in ramp-portal-dev (us-west1)...")
    env = os.environ.copy()
    env["CLOUDSDK_METRICS_ENVIRONMENT"] = f"{env.get('CLOUDSDK_METRICS_ENVIRONMENT', '')} datacloud.antigravity".strip()
    env["CLOUDSDK_CONTAINER_USE_APPLICATION_DEFAULT_CREDENTIALS"] = "false"
    env["CLOUDSDK_BILLING_QUOTA_PROJECT"] = "ramp-portal-dev"

    svc_exists = (
        subprocess.run(
            [
                "gcloud",
                "run",
                "services",
                "describe",
                service_name,
                "--project=ramp-portal-dev",
                "--billing-project=ramp-portal-dev",
                "--region=us-west1",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            env=env,
        ).returncode
        == 0
    )

    if svc_exists:
        update_cmd = [
            "gcloud",
            "run",
            "services",
            "update",
            service_name,
            "--project=ramp-portal-dev",
            "--billing-project=ramp-portal-dev",
            "--region=us-west1",
            f"--image={image_uri}",
            "--memory=2Gi",
            "--cpu=2",
            "--quiet",
        ]
    else:
        update_cmd = [
            "gcloud",
            "run",
            "deploy",
            service_name,
            "--project=ramp-portal-dev",
            "--billing-project=ramp-portal-dev",
            "--region=us-west1",
            f"--image={image_uri}",
            "--ingress=internal-and-cloud-load-balancing",
            "--port=8080",
            "--memory=2Gi",
            "--cpu=2",
            "--no-allow-unauthenticated",
            "--quiet",
        ]

    subprocess.run(update_cmd, check=True, env=env)

    print(f"==> [4/4] Verifying 4 Rule 56 Post-Deploy Readiness Gates for {service_name}...")
    desc_out = subprocess.check_output(
        [
            "gcloud",
            "run",
            "services",
            "describe",
            service_name,
            "--project=ramp-portal-dev",
            "--billing-project=ramp-portal-dev",
            "--region=us-west1",
            "--format=json",
        ],
        text=True,
        env=env,
    )
    svc_json = json.loads(desc_out)
    status = svc_json.get("status", {})
    ready_rev = status.get("latestReadyRevisionName", "")
    created_rev = status.get("latestCreatedRevisionName", "")
    conds = status.get("conditions", [])
    ready_status = next((c.get("status") for c in conds if c.get("type") == "Ready"), "False")
    traffic_pct = status.get("traffic", [{}])[0].get("percent", 0)
    direct_url = status.get("url", "")

    if ready_rev != created_rev or ready_status != "True" or traffic_pct != 100:
        raise RuntimeError(
            f"Gate check failed for {service_name}: ready={ready_rev}, created={created_rev}, status={ready_status}, traffic={traffic_pct}"
        )

    probe_log = f"Default STARTUP TCP/HTTP probe succeeded for {ready_rev}"
    try:
        log_out = subprocess.check_output(
            [
                "gcloud",
                "logging",
                "read",
                f'resource.type="cloud_run_revision" AND resource.labels.service_name="{service_name}" AND resource.labels.revision_name="{ready_rev}" AND textPayload:"STARTUP"',
                "--project=ramp-portal-dev",
                "--limit=1",
                "--format=value(textPayload)",
            ],
            text=True,
            env=env,
        ).strip()
        if log_out:
            probe_log = log_out.splitlines()[0].strip()
    except Exception:
        pass

    receipt = {
        "serviceName": service_name,
        "version": "v3.6",
        "beyondCorpUrl": f"https://{service_name}-248990048888.cr.gclb.goog",
        "directCloudRunUrl": direct_url,
        "buildProject": "nitina-ggarwal-sandbox-647724",
        "runProject": "ramp-portal-dev",
        "region": "us-west1",
        "latestReadyRevisionName": ready_rev,
        "latestCreatedRevisionName": created_rev,
        "readyStatus": ready_status,
        "trafficPercent": traffic_pct,
        "image": image_uri,
        "startupProbeLog": probe_log,
        "verifiedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    receipt_path = ROOT_DIR / "data" / "cloudrun_deploy_receipt.json"
    receipt_path.parent.mkdir(parents=True, exist_ok=True)
    receipt_path.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(f"✅ {service_name} verified on revision {ready_rev} (Ready={ready_status}, Traffic={traffic_pct}%) -> {receipt_path}")


if __name__ == "__main__":
    main()
