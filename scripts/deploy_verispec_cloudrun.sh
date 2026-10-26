#!/usr/bin/env bash
# Synchronous 2-Project Cloud Run Deployment & 4-Gate Readiness Verifier for VeriSpec Studio (Rule 56)
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> [0/2] Executing VeriSpec Deterministic & Headless Chrome Quality Gate..."
npm run quality-gate

echo "==> [1/2] Building OCI Container Image & Deploying 'verispec' to Cloud Run (ramp-portal-dev / us-west1)..."
python3 scripts/oci_deploy_verispec.py
