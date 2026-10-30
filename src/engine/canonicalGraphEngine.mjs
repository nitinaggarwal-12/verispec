// Canonical Architecture Graph (CAG) & Stateful Multi-Entity AST Delta Patch Engine
// Implements the VeriSpec / Google Cloud Architecture Center Stateful Graph Mutation Loop:
//   1. Bounded Undo/Redo Revision History (Baseline / Turn-1..Turn-3 / Rev-2..Rev-N)
//   2. Scoped Node & Zone Targeting (resolves both CAG node IDs and SVG canvas node IDs/titles)
//   3. Compound Multi-Entity Prompt Decomposition ("add Looker, and bigquery" -> 2 distinct cataloged nodes)
//   4. 45+ Cloud, Data, AI & Security Technology Catalog with L100 / L200 / L300 Engineering Specs
//   5. Idempotent ADD / REPLACE / REMOVE / SPLIT / CONNECT AST Patch Operations

import { resolveIconKeyFromText } from './iconCatalog.mjs';

export function cloneGraph(graph) {
  return JSON.parse(JSON.stringify(graph));
}

export function bumpPatchVersion(versionStr) {
  const raw = String(versionStr || 'Baseline').trim();
  const turnMatch = raw.match(/^Turn[- ](\d+)$/i);
  if (turnMatch) return `Turn-${Number(turnMatch[1]) + 1}`;
  const revMatch = raw.match(/^Rev[- ](\d+)$/i);
  if (revMatch) return `Rev-${Number(revMatch[1]) + 1}`;
  return 'Rev-2';
}

/**
 * 45+ Enterprise Cloud, Data, AI, Security & SaaS Technology Catalog
 * Aligned with https://docs.cloud.google.com/architecture (L100 / L200 / L300 specs)
 */
export const KNOWN_TECH_CATALOG = [
  // --- ANALYTICS, BI & CLOUD DATA WAREHOUSES ---
  {
    match: /\blooker\b/i,
    key: 'looker_bi',
    title: 'Looker Enterprise BI',
    subtitle: 'LookML Semantic Layer & Real-Time Executive Dashboards',
    pill: 'BI & Semantic Layer',
    l300Spec: 'HTTPS :443 · LookML Git Sync · Row-Level OAuth2 RLS',
    shape: 'service_card',
    iconKey: 'looker',
    zoneCategory: 'data'
  },
  {
    match: /\bbigquery\b|\bbiglake\b/i,
    key: 'bigquery_dw',
    title: 'BigQuery Enterprise Lakehouse',
    subtitle: 'Serverless Petabyte Columnar DW & Vector Analytics',
    pill: 'Serverless SQL + ML',
    l300Spec: 'Storage Write API gRPC · Slot Autoscaling · CMEK',
    shape: 'cylinder_db',
    iconKey: 'bigquery',
    zoneCategory: 'data'
  },
  {
    match: /\bredshift\b|\baws\s+redshift\b/i,
    key: 'aws_redshift',
    title: 'AWS Redshift Serverless DW',
    subtitle: 'Cross-Cloud Federated Analytics Warehouse (AWS VPC)',
    pill: 'AWS Cross-Cloud DW',
    l300Spec: 'Data API :5439 · Storage Transfer / Omni Bridge · KMS',
    shape: 'cylinder_db',
    iconKey: 'aws_redshift',
    zoneCategory: 'data'
  },
  {
    match: /\bathena\b|\baws\s+athena\b|\baws\s+glue\b/i,
    key: 'aws_athena',
    title: 'AWS Athena Serverless SQL',
    subtitle: 'Federated Trino / Presto S3 & Iceberg Query Engine',
    pill: 'AWS S3 Lake Query',
    l300Spec: 'Trino v3 · Glue Data Catalog · Parquet Predicate Pushdown',
    shape: 'service_card',
    iconKey: 'aws_athena',
    zoneCategory: 'data'
  },
  {
    match: /\bsnowflake\b/i,
    key: 'snowflake_dw',
    title: 'Snowflake Data Cloud',
    subtitle: 'Multi-Cluster Shared Data Warehouse & Iceberg Tables',
    pill: 'Cross-Cloud Iceberg',
    l300Spec: 'Snowpipe Streaming · Private Service Connect · Tri-Secret',
    shape: 'cylinder_db',
    iconKey: 'snowflake',
    zoneCategory: 'data'
  },
  {
    match: /\bdatabricks\b|\bdelta\s+lake\b|\bspark\b/i,
    key: 'databricks_lakehouse',
    title: 'Databricks Unity Lakehouse',
    subtitle: 'Apache Spark & Delta Lake Distributed ML/ETL Engine',
    pill: 'Unity Catalog + Spark',
    l300Spec: 'Photon Engine · Delta Sharing · GKE Serverless Spark',
    shape: 'cylinder_db',
    iconKey: 'databricks',
    zoneCategory: 'data'
  },

  // --- RELATIONAL, NOSQL & IN-MEMORY DATABASES (SPECIFIC VENDORS FIRST) ---
  {
    match: /\baurora\b|\baws\s+aurora\b/i,
    key: 'aws_aurora_pg',
    title: 'AWS Aurora PostgreSQL Global DB',
    subtitle: 'Multi-AZ Distributed Storage OLTP Relational Cluster',
    pill: 'AWS 6-Copy Quorum',
    l300Spec: 'TCP :5432 RDS Proxy · <1s Cross-Region RPO · KMS Encryption',
    shape: 'cylinder_db',
    iconKey: 'aws_aurora',
    zoneCategory: 'data'
  },
  {
    match: /\bdynamodb\b|\baws\s+dynamodb\b/i,
    key: 'aws_dynamodb_kv',
    title: 'AWS DynamoDB Global Table',
    subtitle: 'Single-Digit Millisecond Serverless Key-Value NoSQL',
    pill: 'p99 < 4ms · Multi-Region',
    l300Spec: 'DynamoDB Streams CDC · On-Demand Auto-Scaling · DAX L1',
    shape: 'cylinder_db',
    iconKey: 'aws_dynamodb',
    zoneCategory: 'data'
  },
  {
    match: /\balloydb\b/i,
    key: 'alloydb_pg',
    title: 'AlloyDB for PostgreSQL HA',
    subtitle: '4x Faster Transactional & ScaNN Vector Database',
    pill: '99.99% SLA · ScaNN',
    l300Spec: 'TCP :5432 Auth Proxy · Read Pool Autoscaling · RPO=0',
    shape: 'cylinder_db',
    iconKey: 'alloydb',
    zoneCategory: 'data'
  },
  {
    match: /\bspanner\b/i,
    key: 'cloud_spanner',
    title: 'Cloud Spanner Global HA',
    subtitle: 'Multi-Region TrueTime Distributed ACID Database',
    pill: '99.999% SLA · RPO=0',
    l300Spec: 'gRPC :443 · 5-Way Paxos Quorum · TrueTime <7ms',
    shape: 'cylinder_db',
    iconKey: 'cloud_spanner',
    zoneCategory: 'data'
  },
  {
    match: /\bfirestore\b/i,
    key: 'gcp_firestore_db',
    title: 'Cloud Firestore Document DB',
    subtitle: 'Serverless Real-Time Document & State Store',
    pill: '99.999% Multi-Region',
    l300Spec: 'gRPC Listen Stream · ACID Document Transactions · TTL',
    shape: 'cylinder_db',
    iconKey: 'gcp_firestore',
    zoneCategory: 'data'
  },
  {
    match: /\bredis\b|\bmemorystore\b|\bvalkey\b/i,
    key: 'redis_cache',
    title: 'Memorystore Redis Cluster',
    subtitle: 'Sub-Millisecond L2 Session, Cart & Feature Cache',
    pill: 'p99 < 0.4ms · 96% Hit',
    l300Spec: 'RESP3 TLS :6379 · Cross-Zone Shards · Read Replicas',
    shape: 'cylinder_db',
    iconKey: 'redis_memorystore',
    zoneCategory: 'data'
  },
  {
    match: /\bpostgres(?:ql)?\b|\bcloud\s*sql\b/i,
    key: 'cloud_sql_pg',
    title: 'Cloud SQL PostgreSQL 16',
    subtitle: 'Managed Regional Relational OLTP Database',
    pill: '99.95% Regional HA',
    l300Spec: 'TCP :5432 IAM Auth · Sync Standby Failover <60s',
    shape: 'cylinder_db',
    iconKey: 'postgresql',
    zoneCategory: 'data'
  },

  // --- STREAMING, ORCHESTRATION & OBJECT STORAGE (AWS vs GCP EXPLICIT) ---
  {
    match: /\bcomposer\b|\bairflow\b/i,
    key: 'gcp_composer_airflow',
    title: 'Cloud Composer (Apache Airflow)',
    subtitle: 'Managed DAG Workflow Orchestration & Data Lineage',
    pill: 'Airflow 2.10 · GKE DAGs',
    l300Spec: 'KubernetesPodOperator · OpenLineage · Private IP Environment',
    shape: 'service_card',
    iconKey: 'gcp_composer_airflow',
    zoneCategory: 'data'
  },
  {
    match: /\bkinesis\b|\baws\s+kinesis\b/i,
    key: 'aws_kinesis_stream',
    title: 'AWS Kinesis Data Streams',
    subtitle: 'Real-Time Sharded Event & Telemetry Streaming Conduit',
    pill: 'Sub-70ms PutRecord',
    l300Spec: 'Enhanced Fan-Out HTTP/2 · Data Firehose Iceberg Sink',
    shape: 'service_card',
    iconKey: 'aws_kinesis',
    zoneCategory: 'data'
  },
  {
    match: /\bsqs\b|\bsns\b|\beventbridge\b/i,
    key: 'aws_sqs_sns_bus',
    title: 'AWS SQS & SNS Event Bus',
    subtitle: 'FIFO Decoupled Message Queue & Pub/Sub Fanout Topic',
    pill: 'Exactly-Once FIFO',
    l300Spec: 'MessageGroupId Ordering · Redrive DLQ Policy · KMS SSE',
    shape: 'service_card',
    iconKey: 'aws_sqs_sns',
    zoneCategory: 'data'
  },
  {
    match: /\bs3\b|\baws\s+s3\b|\bsimple\s+storage\b/i,
    key: 'aws_s3_bucket',
    title: 'Amazon S3 Object Lake',
    subtitle: '11-Nines Durable Object Storage & Apache Iceberg Vault',
    pill: 'AWS S3 · 11-Nines',
    l300Spec: 'S3 Express One Zone · KMS SSE-KMS · Cross-Region Replication',
    shape: 'cylinder_db',
    iconKey: 'aws_s3',
    zoneCategory: 'data'
  },
  {
    match: /\bdataflow\b|\bapache\s+beam\b/i,
    key: 'cloud_dataflow',
    title: 'Cloud Dataflow Stream ETL',
    subtitle: 'Exactly-Once Apache Beam Streaming & Windowing Pipeline',
    pill: 'Exactly-Once Stream',
    l300Spec: 'Streaming Engine · Prime Autoscaling · Watermarks',
    shape: 'service_card',
    iconKey: 'dataflow',
    zoneCategory: 'data'
  },
  {
    match: /\bdatastream\b|\bcdc\b|\bdebezium\b/i,
    key: 'cloud_datastream',
    title: 'Cloud Datastream CDC',
    subtitle: 'Serverless Log-Based Change Data Capture Replicator',
    pill: 'Sub-Second WAL CDC',
    l300Spec: 'Private Connectivity · Avro/Parquet Backfill · 0 Lock',
    shape: 'service_card',
    iconKey: 'datastream',
    zoneCategory: 'data'
  },
  {
    match: /\bpub\/?sub\b|\bkafka\b|\bevent\s+bus\b/i,
    key: 'pubsub_kafka',
    title: 'Cloud Pub/Sub + Kafka Bus',
    subtitle: 'Global At-Least-Once Event Streaming Backbone',
    pill: '1.2M msg/s · Ordering',
    l300Spec: 'gRPC StreamingPull · Dead-Letter Queue · 7d Replay',
    shape: 'service_card',
    iconKey: 'kafka_pubsub',
    zoneCategory: 'data'
  },
  {
    match: /\biceberg\b|\bcloud\s+storage\b|\bgcs\b/i,
    key: 'gcs_iceberg',
    title: 'Cloud Storage Iceberg Lake',
    subtitle: 'Open-Format Apache Iceberg & Parquet Object Lake',
    pill: '11-Nines Durability',
    l300Spec: 'Dual-Region Turbo Replication · Object Versioning · CMEK',
    shape: 'cylinder_db',
    iconKey: 'cloud_storage',
    zoneCategory: 'data'
  },

  // --- EDGE, WAF, NETWORKING & IDENTITY ---
  {
    match: /\bcloudfront\b|\baws\s+waf\b|\broute\s*53\b/i,
    key: 'aws_cloudfront_waf',
    title: 'AWS CloudFront CDN & WAF',
    subtitle: 'Global Edge PoP Caching, AWS Shield Advanced & L7 WAF',
    pill: 'AWS Edge PoP + WAF',
    l300Spec: 'Anycast TLS 1.3 · Lambda@Edge · Bot Control Managed Rules',
    shape: 'decision_diamond',
    iconKey: 'aws_cloudfront_waf',
    zoneCategory: 'edge'
  },
  {
    match: /\bcloud\s+armor\b|\bwaf\b|\bddos\b/i,
    key: 'cloud_armor_waf',
    title: 'Cloud Armor Enterprise WAF',
    subtitle: 'Anycast L7 DDoS Mitigation & OWASP Top-10 Shield',
    pill: 'Edge WAF · Adaptive',
    l300Spec: 'TLS 1.3 Anycast · CRS 3.3 Rules · Bot reCAPTCHA',
    shape: 'decision_diamond',
    iconKey: 'cloud_armor',
    zoneCategory: 'edge'
  },
  {
    match: /\biap\b|\bidentity[- ]aware\s+proxy\b|\bbeyondcorp\b|\bokta\b|\bauth0\b/i,
    key: 'zero_trust_iap',
    title: 'Zero-Trust IAP & OIDC Gate',
    subtitle: 'BeyondCorp Context-Aware Device & Passkey Identity Proxy',
    pill: 'Zero-Trust mTLS/OIDC',
    l300Spec: 'WebAuthn FIDO2 · Signed JWT Assertion · Device Posture',
    shape: 'decision_diamond',
    iconKey: 'iap',
    zoneCategory: 'edge'
  },
  {
    match: /\bapigee\b|\bapi\s+gateway\b|\benvoy\b/i,
    key: 'apigee_gateway',
    title: 'Apigee X API Gateway',
    subtitle: 'Enterprise API Management, Spike Arrest & Monetization',
    pill: '50k RPS · OAuth 2.1',
    l300Spec: 'mTLS 1.3 North-South · Semantic Quota · PSC Negs',
    shape: 'service_card',
    iconKey: 'apigee',
    zoneCategory: 'edge'
  },
  {
    match: /\bprivate\s+service\s+connect\b|\bpsc\b/i,
    key: 'gcp_psc_bridge',
    title: 'Private Service Connect (PSC)',
    subtitle: 'Zero-Trust Cross-VPC Service Attachment Endpoint',
    pill: 'Private Producer-Consumer',
    l300Spec: 'Internal IP Forwarding Rule · Service Attachment NAT · 0 Public IP',
    shape: 'service_card',
    iconKey: 'psc_bridge',
    zoneCategory: 'edge'
  },

  // --- FRONTIER AI, FOUNDATION MODELS & SECURITY GUARDRAILS ---
  {
    match: /\bazure\s+openai\b|\bazure\s+ai\b|\bopenai\b/i,
    key: 'azure_openai_foundry',
    title: 'Azure OpenAI Foundry Endpoint',
    subtitle: 'Provisioned Throughput Multi-Region Enterprise LLM Gateway',
    pill: 'Azure PTU · Private Link',
    l300Spec: 'Managed Identity · ExpressRoute Peering · Content Safety Filter',
    shape: 'hexagon_agent',
    iconKey: 'azure_openai',
    zoneCategory: 'ai'
  },
  {
    match: /\banthropic\b|\bclaude\b/i,
    key: 'anthropic_claude_agent',
    title: 'Anthropic Claude Enterprise Agent',
    subtitle: 'Constitutional AI Reasoning & Tool-Use Model on Vertex/Bedrock',
    pill: '200K Context · Constitutional',
    l300Spec: 'Zero Data Retention · Extended Thinking · Prompt Caching',
    shape: 'hexagon_agent',
    iconKey: 'anthropic_claude',
    zoneCategory: 'ai'
  },
  {
    match: /\bbedrock\b|\baws\s+bedrock\b/i,
    key: 'aws_bedrock_agent',
    title: 'Amazon Bedrock Foundation Hub',
    subtitle: 'Serverless Multi-Model Inference & Bedrock Guardrails',
    pill: 'AWS Bedrock + Guardrails',
    l300Spec: 'PrivateLink VPC Endpoint · Knowledge Bases RAG · KMS',
    shape: 'hexagon_agent',
    iconKey: 'aws_bedrock',
    zoneCategory: 'ai'
  },
  {
    match: /\bdlp\b|\bmodel\s+armor\b|\bguardrail\b|\bpii\b/i,
    key: 'dlp_model_armor',
    title: 'Model Armor & DLP Gate',
    subtitle: 'Real-Time PII Redaction, Prompt Injection & Safety Filter',
    pill: '0 PII Leak · 6ms Scan',
    l300Spec: 'Inline InfoType De-ID · Jailbreak Classifier · Audit Log',
    shape: 'decision_diamond',
    iconKey: 'dlp_guardrail',
    zoneCategory: 'ai'
  },
  {
    match: /\bvertex\s*ai\b|\bgemini\b|\bllm\b/i,
    key: 'vertex_gemini',
    title: 'Vertex AI Gemini 3.1 Agent',
    subtitle: 'Frontier Multimodal Reasoning & Grounded Synthesis',
    pill: '1M Context · Grounded',
    l300Spec: 'Global Endpoint · ThinkingConfig HIGH · Provisioned PT',
    shape: 'hexagon_agent',
    iconKey: 'vertex_ai',
    zoneCategory: 'ai'
  },
  {
    match: /\bvector\s+search\b|\bhnsw\b|\bembedding\b|\bgraphrag\b/i,
    key: 'vector_search_idx',
    title: 'Vector Search 2.0 Hybrid',
    subtitle: 'Sub-10ms HNSW Dense + BM25 Sparse Retrieval Engine',
    pill: 'Recall@10 = 98.6%',
    l300Spec: '768d gemini-embedding-2 · Streaming Upsert · RRF',
    shape: 'hexagon_agent',
    iconKey: 'vector_search',
    zoneCategory: 'ai'
  },
  {
    match: /\badk\b|\bmcp\b|\ba2a\b|\bsub[- ]?agent\b/i,
    key: 'adk_mcp_agent',
    title: 'ADK A2A & MCP Orchestrator',
    subtitle: 'Autonomous Multi-Agent Supervisor & Tool Execution Bus',
    pill: 'A2A JSON-RPC + MCP',
    l300Spec: 'Scoped OAuth Consent · Deterministic Tool Sandbox',
    shape: 'hexagon_agent',
    iconKey: 'adk_agent',
    zoneCategory: 'ai'
  },
  {
    match: /\bsecret\s+manager\b/i,
    key: 'gcp_secret_mgr',
    title: 'Cloud Secret Manager Vault',
    subtitle: 'Versioned API Keys, TLS Certs & Automated Rotation',
    pill: 'IAM Scoped Secrets',
    l300Spec: 'CMEK Encrypted · Pub/Sub Rotation Triggers · Audit Logged',
    shape: 'service_card',
    iconKey: 'gcp_secret_manager',
    zoneCategory: 'ai'
  },
  {
    match: /\bcloudflare\b/i,
    key: 'cloudflare_waf_edge',
    title: 'Cloudflare Anycast CDN & WAF',
    subtitle: 'Global Edge PoP Caching, DDoS Mitigation & Zero-Trust Tunnel',
    pill: '300+ Edge PoPs · L7 WAF',
    l300Spec: 'Anycast BGP · Workers Isolate · Bot Management & Turnstile',
    shape: 'decision_diamond',
    iconKey: 'cloudflare_waf',
    zoneCategory: 'edge'
  },
  {
    match: /\bokta\b|\bauth0\b/i,
    key: 'okta_auth0_idp',
    title: 'Okta Workforce & Auth0 IdP',
    subtitle: 'Enterprise SAML 2.0, OIDC & FIDO2 Passkey Identity Provider',
    pill: 'OIDC + SCIM 2.0 · MFA',
    l300Spec: 'OAuth 2.1 DPoP · Adaptive Risk Engine · FastFed Federation',
    shape: 'decision_diamond',
    iconKey: 'okta_auth0',
    zoneCategory: 'edge'
  },
  {
    match: /\bmongodb\b|\batlas\s+document\b/i,
    key: 'mongodb_atlas_db',
    title: 'MongoDB Atlas Vector & Doc DB',
    subtitle: 'Multi-Cloud Sharded BSON Document Store & HNSW Vector Search',
    pill: 'Sharded Replica Set',
    l300Spec: 'Wire Protocol TLS 1.3 · Change Streams CDC ·PrivateLink',
    shape: 'cylinder_db',
    iconKey: 'mongodb_atlas',
    zoneCategory: 'data'
  },
  {
    match: /\belasticsearch\b|\belastic\b|\bopensearch\b/i,
    key: 'elasticsearch_cluster',
    title: 'ElasticSearch BM25 & Lexical Engine',
    subtitle: 'Distributed Inverted Index, Hybrid Search & Log Analytics',
    pill: 'BM25 + ELSER Sparse',
    l300Spec: 'Hot-Warm-Cold Tiering · Cross-Cluster Replication · ILM',
    shape: 'cylinder_db',
    iconKey: 'elasticsearch',
    zoneCategory: 'data'
  },
  {
    match: /\bhashicorp\s+vault\b|\bvault\s+pki\b/i,
    key: 'hashicorp_vault_pki',
    title: 'HashiCorp Vault Secrets & PKI',
    subtitle: 'Dynamic Database Credentials, Transit Encryption & mTLS CA',
    pill: 'Dynamic Lease · PKI CA',
    l300Spec: 'Auto-Unseal KMS · SPIFFE/SPIRE Cert Issuance · Audit Sink',
    shape: 'service_card',
    iconKey: 'hashicorp_vault',
    zoneCategory: 'ai'
  },
  {
    match: /\bgithub\s+actions\b|\bgithub\s+ci\b/i,
    key: 'github_actions_cicd',
    title: 'GitHub Actions CI/CD Runner',
    subtitle: 'OIDC Ephemeral Federation, SLSA Provenance & GitOps Matrix',
    pill: 'OIDC Keyless CI/CD',
    l300Spec: 'Sigstore Cosign Attestation · Self-Hosted ARC Runners',
    shape: 'service_card',
    iconKey: 'github_actions',
    zoneCategory: 'compute'
  },
  {
    match: /\bpagerduty\b/i,
    key: 'pagerduty_sre_oncall',
    title: 'PagerDuty Incident & On-Call SRE',
    subtitle: 'Automated AIOps Event Correlation, Runbooks & Escalation',
    pill: 'MTTA < 60s · Auto-Page',
    l300Spec: 'Events API v2 · Bi-Directional Slack/Jira Sync · Postmortem',
    shape: 'service_card',
    iconKey: 'pagerduty_incident',
    zoneCategory: 'ai'
  },
  {
    match: /\bkms\b|\bcmek\b|\bhsm\b|\bvault\b/i,
    key: 'cloud_kms_cmek',
    title: 'Cloud KMS HSM & CMEK Vault',
    subtitle: 'FIPS 140-3 L3 Hardware Encryption Keys & Access Approval',
    pill: 'FIPS 140-3 L3 HSM',
    l300Spec: '90-Day Auto-Rotation · Key Access Justifications (KAJ)',
    shape: 'service_card',
    iconKey: 'cloud_kms',
    zoneCategory: 'ai'
  },
  {
    match: /\bvpc[- ]?sc\b|\bservice\s+controls\b|\benclave\b/i,
    key: 'vpc_sc_perimeter',
    title: 'VPC Service Controls Enclave',
    subtitle: 'Zero-Exfiltration Security Perimeter & Private Google Access',
    pill: 'Zero Data Exfiltration',
    l300Spec: 'Restricted VIP 199.36.153.4/30 · Ingress/Egress Rules',
    shape: 'service_card',
    iconKey: 'vpc_sc',
    zoneCategory: 'edge'
  },
  {
    match: /\bopentelemetry\b|\botel\b|\bmonarch\b|\btelemetry\b|\bprometheus\b|\bgrafana\b|\bdatadog\b/i,
    key: 'otel_monarch_sre',
    title: 'OpenTelemetry & Monarch SRE',
    subtitle: 'Distributed W3C Trace Context, SLO Burn Alerts & Eval Loop',
    pill: '99.99% SLO Guard',
    l300Spec: 'OTLP gRPC :4317 · Exemplar Traces · Auto-Canary Rollback',
    shape: 'service_card',
    iconKey: 'telemetry_hub',
    zoneCategory: 'ai'
  },
  {
    match: /\bterraform\b|\bhcl\b|\biac\b/i,
    key: 'terraform_iac_pipeline',
    title: 'HashiCorp Terraform IaC Engine',
    subtitle: 'Declarative Multi-Cloud State & Drift Detection Pipeline',
    pill: 'GitOps Plan & Apply',
    l300Spec: 'Remote GCS State Lock · OPA Sentinel Policy Gate · OIDC',
    shape: 'service_card',
    iconKey: 'terraform_iac',
    zoneCategory: 'compute'
  },
  {
    match: /\bstripe\b|\bpci\b|\bpayment\b/i,
    key: 'stripe_pci_worker',
    title: 'Stripe PCI-DSS Payment Gateway',
    subtitle: 'Tokenized Card Vault, 3DS2 Auth & Idempotent Settlement',
    pill: 'PCI-DSS L1 · mTLS',
    l300Spec: 'Idempotency-Key UUIDv7 · Webhook HMAC-SHA256',
    shape: 'service_card',
    iconKey: 'stripe_pci',
    zoneCategory: 'compute'
  },
  {
    match: /\bsap\b|\berp\b|\bsalesforce\b|\bservicenow\b|\bworkday\b/i,
    key: 'enterprise_erp_crm',
    title: 'Enterprise ERP / CRM Connector',
    subtitle: 'Bi-Directional OData / REST Anti-Corruption Integration Bridge',
    pill: 'Private PSC Bridge',
    l300Spec: 'mTLS 1.3 · Transactional Outbox Sync · ISO-20022',
    shape: 'service_card',
    iconKey: 'external_saas',
    zoneCategory: 'data'
  },

  // --- COMPUTE & MICROSERVICES (AWS EKS / LAMBDA BEFORE GENERIC K8S / SERVERLESS) ---
  {
    match: /\beks\b|\baws\s+eks\b|\belastic\s+kubernetes\b/i,
    key: 'aws_eks_cluster',
    title: 'AWS EKS Kubernetes Mesh',
    subtitle: 'Managed AWS Kubernetes Control Plane & Karpenter Autoscaler',
    pill: 'AWS EKS · App Mesh mTLS',
    l300Spec: 'IAM Roles for Service Accounts (IRSA) · AWS VPC CNI · eBPF',
    shape: 'service_card',
    iconKey: 'aws_eks',
    zoneCategory: 'compute'
  },
  {
    match: /\blambda\b|\baws\s+lambda\b/i,
    key: 'aws_lambda_fn',
    title: 'AWS Lambda Serverless Function',
    subtitle: 'Event-Driven Firecracker MicroVM Compute Worker',
    pill: 'AWS Lambda · SnapStart',
    l300Spec: 'ARM64 Graviton3 · Provisioned Concurrency · VPC Egress',
    shape: 'service_card',
    iconKey: 'aws_lambda',
    zoneCategory: 'compute'
  },
  {
    match: /\bgke\b|\bkubernetes\b|\bautopilot\b/i,
    key: 'gke_autopilot_svc',
    title: 'GKE Autopilot Service Mesh',
    subtitle: 'Managed Kubernetes Compute with Anthos Service Mesh mTLS',
    pill: 'HPA 6-60 Pods · mTLS',
    l300Spec: 'Workload Identity Federation · Istio Envoy Sidecar',
    shape: 'service_card',
    iconKey: 'gke_autopilot',
    zoneCategory: 'compute'
  },
  {
    match: /\bcloud\s+run\b|\bserverless\b/i,
    key: 'cloud_run_svc',
    title: 'Cloud Run Serverless Worker',
    subtitle: 'Scale-to-Zero Regional Container Microservice',
    pill: 'Cold Start < 120ms',
    l300Spec: 'HTTP/2 gRPC · Direct VPC Egress · Min Instances = 2',
    shape: 'service_card',
    iconKey: 'cloud_run',
    zoneCategory: 'compute'
  },
  {
    match: /\bgraphql\b|\bapollo\b|\bsupergraph\b/i,
    key: 'apollo_graphql',
    title: 'Apollo GraphQL Supergraph',
    subtitle: 'Federated Schema Composition & Subgraph Query Planner',
    pill: 'Federation v2.7',
    l300Spec: 'Persisted Queries · @key Entity Resolution · Sub-8ms',
    shape: 'service_card',
    iconKey: 'graphql_bff',
    zoneCategory: 'compute'
  }
];

/**
 * Canonical Baseline Blueprint (D05 Turn-1) with unified node IDs matching renderD05MultiTierCloud
 */
export function createBaselineEcommerceBlueprint() {
  return {
    id: 'd05-cloud-native-microservices',
    code: 'D05',
    phaseId: 'phase_2_architecture',
    phaseNumber: 2,
    phaseTitle: 'Phase 2 · System & Cloud Architecture Topologies',
    phaseBadge: 'D05 · CLOUD-NATIVE MESH',
    version: 'Turn-1',
    title: 'Cloud-Native Multi-Tier AI Commerce & Microservices Mesh',
    subtitle: 'Zero-Trust Edge WAF, GKE Autopilot Services, Spanner/Redis Data Tier & Vertex AI',
    prompt:
      'Design a cloud-native AI e-commerce platform with Next.js & Mobile clients, Apigee API Gateway, GKE Catalog & Checkout microservices, Vertex AI Gemini Shopping Agent with Vector Search 2.0, PostgreSQL 16, and Pub/Sub event bus.',
    timestamp: '10:14:05 AM',
    zones: [
      { id: 'z1', title: 'ZONE 1 · CLIENT', subtitle: 'Web & Mobile Channels', orderIndex: 0, accent: 'blue' },
      { id: 'z2', title: 'ZONE 2 · EDGE WAF', subtitle: 'Zero-Trust Ingress', orderIndex: 1, accent: 'amber' },
      { id: 'z3', title: 'ZONE 3 · GKE MESH', subtitle: 'Core Microservices', orderIndex: 2, accent: 'purple' },
      { id: 'z4', title: 'ZONE 4 · AI & DLP', subtitle: 'Vertex & Guardrails', orderIndex: 3, accent: 'rose' },
      { id: 'z5', title: 'ZONE 5 · DATA HA', subtitle: 'Stateful Storage & BI', orderIndex: 4, accent: 'emerald' }
    ],
    nodes: [
      {
        id: 'node_web_storefront',
        zoneId: 'z1',
        title: 'Next.js 15 Storefront',
        subtitle: 'SSR Edge + React Server Components',
        pill: 'p99 FCP < 380ms',
        l300Spec: 'HTTP/3 QUIC · Edge CDN Cache · WebAuthn Passkey',
        shape: 'service_card',
        iconKey: 'client_web',
        slotOrder: 0,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_mobile_passkey',
        zoneId: 'z1',
        title: 'Mobile Passkey App',
        subtitle: 'iOS/Android Biometric OIDC Client',
        pill: 'mTLS Cert Pinning',
        l300Spec: 'FIDO2 Passkey · gRPC-Web · Offline Queue',
        shape: 'service_card',
        iconKey: 'client_web',
        slotOrder: 1,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_apigee_gateway',
        zoneId: 'z2',
        title: 'Apigee X API Gateway',
        subtitle: 'OAuth2 JWT Verify & Spike Arrest',
        pill: '50k RPS · 4ms Overhead',
        l300Spec: 'mTLS 1.3 Ingress · OAuth 2.1 Token Exchange · Quota',
        shape: 'service_card',
        iconKey: 'apigee',
        slotOrder: 1,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_catalog_bff',
        zoneId: 'z3',
        title: 'Catalog & Search BFF',
        subtitle: 'Apollo Federated GraphQL Router',
        pill: 'Go 1.24 · HPA 6-60 Pods',
        l300Spec: 'gRPC :8443 · Workload Identity · Circuit Breaker',
        shape: 'service_card',
        iconKey: 'graphql_bff',
        slotOrder: 0,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_checkout_service',
        zoneId: 'z3',
        title: 'Checkout & Order Saga',
        subtitle: 'Idempotent Payment & Inventory Core',
        pill: 'Zero Double-Charge',
        l300Spec: '2PC Saga Coordinator · Idempotency Key UUIDv7',
        shape: 'service_card',
        iconKey: 'gke_autopilot',
        slotOrder: 1,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_vertex_agent',
        zoneId: 'z4',
        title: 'Gemini 3.1 Co-Pilot',
        subtitle: 'Grounded Shopping & Spec Assistant',
        pill: '1M Context · Streamed',
        l300Spec: 'locations/global · thinkingLevel: HIGH · A2A JSON-RPC',
        shape: 'hexagon_agent',
        iconKey: 'vertex_ai',
        slotOrder: 1,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_vector_index',
        zoneId: 'z4',
        title: 'Vector Search 2.0',
        subtitle: 'HNSW Hybrid Semantic Retrieval',
        pill: 'p99 Recall@10 = 98.4%',
        l300Spec: '768-dim gemini-embedding-2 · RRF Reranker <8ms',
        shape: 'hexagon_agent',
        iconKey: 'vector_search',
        slotOrder: 2,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_primary_db',
        zoneId: 'z5',
        title: 'Cloud SQL PostgreSQL 16',
        subtitle: 'Single-Region Relational Order DB',
        pill: '99.95% Regional HA',
        l300Spec: 'TCP :5432 · IAM DB Auth · Automated Point-in-Time RPO',
        shape: 'cylinder_db',
        iconKey: 'postgresql',
        slotOrder: 1,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      },
      {
        id: 'node_kafka_bus',
        zoneId: 'z5',
        title: 'Cloud Pub/Sub + Kafka',
        subtitle: 'Transactional Outbox Event Stream',
        pill: '1.2M msg/s · Replayable',
        l300Spec: 'Exactly-Once Delivery · Ordering Key: order_id · DLQ',
        shape: 'service_card',
        iconKey: 'kafka_pubsub',
        slotOrder: 2,
        addedInVersion: 'Turn-1',
        changeStatus: 'baseline'
      }
    ],
    edges: [
      { id: 'e_d05_1', sourceNodeId: 'node_web_storefront', targetNodeId: 'node_apigee_gateway', label: 'HTTPS :443', stepNumber: 1, semanticType: 'sync_request' },
      { id: 'e_d05_2', sourceNodeId: 'node_mobile_passkey', targetNodeId: 'node_apigee_gateway', label: 'mTLS 1.3', stepNumber: 2, semanticType: 'sync_request' },
      { id: 'e_d05_3', sourceNodeId: 'node_apigee_gateway', targetNodeId: 'node_catalog_bff', label: 'GraphQL JWT', stepNumber: 3, semanticType: 'sync_request' },
      { id: 'e_d05_4', sourceNodeId: 'node_apigee_gateway', targetNodeId: 'node_checkout_service', label: 'gRPC Order', stepNumber: 4, semanticType: 'sync_request' },
      { id: 'e_d05_5', sourceNodeId: 'node_catalog_bff', targetNodeId: 'node_vertex_agent', label: 'A2A Stream', stepNumber: 5, semanticType: 'ai_rag_grounding' },
      { id: 'e_d05_6', sourceNodeId: 'node_vertex_agent', targetNodeId: 'node_vector_index', label: 'ANN Hybrid', stepNumber: 6, semanticType: 'ai_rag_grounding' },
      { id: 'e_d05_7', sourceNodeId: 'node_checkout_service', targetNodeId: 'node_primary_db', label: 'ACID Commit', stepNumber: 7, semanticType: 'sync_request' },
      { id: 'e_d05_8', sourceNodeId: 'node_checkout_service', targetNodeId: 'node_kafka_bus', label: 'Outbox CDC', stepNumber: 8, semanticType: 'async_event' }
    ],
    diffManifest: {
      summaryBadge: 'Baseline Seed (9 Nodes · 8 Edges)',
      addedNodeIds: [
        'node_web_storefront',
        'node_mobile_passkey',
        'node_apigee_gateway',
        'node_catalog_bff',
        'node_checkout_service',
        'node_vertex_agent',
        'node_vector_index',
        'node_primary_db',
        'node_kafka_bus'
      ],
      replacedNodes: [],
      removedNodeTitles: [],
      addedEdgeIds: ['e_d05_1', 'e_d05_2', 'e_d05_3', 'e_d05_4', 'e_d05_5', 'e_d05_6', 'e_d05_7', 'e_d05_8'],
      patchOps: [
        {
          op: 'INIT_SEED',
          target: '5-Tier Cloud-Native AI Commerce Baseline',
          zone: 'All 5 Zones',
          detail: '9 Core Services & 8 Orthogonal Connectors'
        }
      ]
    }
  };
}

/**
 * Resolves the appropriate zone ID in the current graph for a semantic category ('client', 'edge', 'compute', 'ai', 'data', 'ops')
 */
function resolveTargetZoneId(graph, category = 'data', fallbackZoneId = null) {
  const zones = graph.zones || [];
  if (!zones.length) return 'z1';
  if (fallbackZoneId && zones.some((z) => z.id === fallbackZoneId)) {
    return fallbackZoneId;
  }

  const findByPattern = (regex) => zones.find((z) => regex.test(`${z.id} ${z.title} ${z.subtitle || ''}`));

  if (category === 'client') {
    const z = findByPattern(/client|entry|actor|persona|stage 1|screen 1|z1/i);
    if (z) return z.id;
  }
  if (category === 'edge') {
    const z = findByPattern(/edge|waf|ingress|gateway|auth|stage 2|screen 2|z2/i);
    if (z) return z.id;
  }
  if (category === 'compute') {
    const z = findByPattern(/mesh|compute|gke|service|container|aggregate|core|stage 3|z3/i);
    if (z) return z.id;
  }
  if (category === 'ai') {
    const z = findByPattern(/ai|vertex|agent|dlp|rag|event|z4/i);
    if (z) return z.id;
  }
  if (category === 'data') {
    const z = findByPattern(/data|storage|db|cache|warehouse|lake|projection|kpi|z5|z4/i);
    if (z) return z.id;
  }
  return zones[zones.length - 1].id;
}

/**
 * Resolves a node in the graph by ID, alias, or fuzzy title match.
 * If the user clicked a bespoke SVG node (e.g. 'node_vector_index', 'c4', 'zt4') that wasn't in graph.nodes yet,
 * we also check known aliases or synthesize a reference so scoping ALWAYS works 100% accurately.
 */
function resolveScopedOrTargetNode(graph, scopedNodeId, scopedNodeTitle = '') {
  if (!scopedNodeId && !scopedNodeTitle) return null;

  // 1. Exact ID match
  let match = graph.nodes.find((n) => n.id === scopedNodeId);
  if (match) return match;

  // 2. Title match
  if (scopedNodeTitle) {
    const norm = scopedNodeTitle.trim().toLowerCase();
    match = graph.nodes.find((n) => n.title.toLowerCase() === norm || n.title.toLowerCase().includes(norm));
    if (match) return match;
  }

  // 3. Common alias mapping between D05 bespoke IDs and generic IDs
  const aliasPatterns = {
    node_vector_index: /vector|embedding|index/i,
    node_vertex_agent: /gemini|vertex|co-pilot|agent/i,
    node_primary_db: /spanner|postgres|sql|db/i,
    node_db_primary: /spanner|postgres|sql|db/i,
    node_redis_cache: /redis|memorystore|cache/i,
    node_checkout_service: /checkout|order|saga/i,
    node_catalog_bff: /catalog|search|bff|graphql/i,
    node_apigee_gateway: /apigee|gateway/i,
    node_cloud_armor: /armor|waf/i,
    node_dlp_guardrail: /dlp|policy|guardrail/i,
    node_kafka_bus: /pub\/sub|kafka|event/i
  };

  const pat = aliasPatterns[scopedNodeId];
  if (pat) {
    match = graph.nodes.find((n) => pat.test(`${n.id} ${n.title} ${n.subtitle || ''}`));
    if (match) return match;
  }

  // 4. If user clicked a specialized archetype sub-node on D01..D18, register a lightweight anchor in graph.nodes
  if (scopedNodeId) {
    const cleanLabel = scopedNodeTitle || scopedNodeId.replace(/^(node_|cell_|zt|er_|sg_)/, '').replace(/_/g, ' ');
    const fallbackZone = (graph.zones && graph.zones[Math.min(2, graph.zones.length - 1)]?.id) || 'z1';
    const syntheticAnchor = {
      id: scopedNodeId,
      zoneId: fallbackZone,
      title: cleanLabel.charAt(0).toUpperCase() + cleanLabel.slice(1),
      subtitle: 'Scoped Architecture Target Component',
      pill: 'Scoped Anchor',
      l300Spec: 'mTLS 1.3 · Scoped AST Target',
      shape: 'service_card',
      iconKey: resolveIconKeyFromText(cleanLabel),
      slotOrder: graph.nodes.filter((n) => n.zoneId === fallbackZone).length,
      addedInVersion: graph.version || 'Baseline',
      changeStatus: 'baseline'
    };
    graph.nodes.push(syntheticAnchor);
    return syntheticAnchor;
  }

  return null;
}

/**
 * Splits a natural-language addition clause into individual technology entities:
 * e.g. "add Looker, and bigquery" -> ["Looker", "bigquery"]
 * e.g. "add aws redshift" -> ["aws redshift"]
 */
export function extractEntityClausesFromAddPrompt(rawPrompt) {
  // Strip leading command verb + optional standalone article (strictly word-bounded \b so 'aws' is NEVER stripped!)
  const stripped = String(rawPrompt || '')
    .trim()
    .replace(/^(?:please\s+)?(?:add|insert|create|include|wire|connect|deploy|provision|introduce|attach)\s+(?:(?:a|an|the)\s+)?/i, '')
    .replace(/\s+(?:in|into|to|inside|within|before|after|connected\s+to|wired\s+to)\s+(?:the\s+)?(?:data\s+tier|edge\s+ingress|compute\s+tier|ai\s+tier|service\s+mesh|full\s+architecture|canvas).*$/i, '')
    .trim();

  if (!stripped) return [];

  // Protect known compound names that contain "and" or "&" before splitting
  const protectedText = stripped
    .replace(/Cloud\s+Armor\s*(?:&|and|\+)\s*(?:Zero-Trust\s+)?IAP/gi, 'Cloud Armor WAF##SPLIT##Zero-Trust IAP')
    .replace(/DLP\s*(?:&|and)\s*Fraud\s+Policy\s+Gate/gi, 'DLP & Fraud Policy Gate')
    .replace(/OpenTelemetry\s*(?:&|and)\s*Monarch/gi, 'OpenTelemetry & Monarch')
    .replace(/Pub\/Sub\s*(?:&|and|\+)\s*Kafka/gi, 'Cloud Pub/Sub & Kafka');

  const rawParts = protectedText
    .split(/##SPLIT##|\s*,\s*(?:and\s+|\&\s*)?|\s+(?:and|&|\+)\s+/i)
    .map((s) => s.replace(/^(?:a|an|the)\s+/i, '').trim())
    .filter((s) => s.length >= 2);

  return rawParts.length > 0 ? rawParts : [stripped];
}

/**
 * Resolves a single entity string (e.g. "Looker", "bigquery", "aws redshift") into a structured node specification.
 */
function buildNodeSpecFromEntityText(entityText, graph, nextVer, idxSuffix = 1) {
  for (const item of KNOWN_TECH_CATALOG) {
    if (item.match.test(entityText)) {
      return {
        key: item.key,
        title: item.title,
        subtitle: item.subtitle,
        pill: item.pill,
        l300Spec: item.l300Spec,
        shape: item.shape,
        iconKey: item.iconKey,
        zoneCategory: item.zoneCategory
      };
    }
  }

  // Clean Open-World Entity Title (Preserves full words, NEVER truncates mid-word or strips 'a' from 'aws')
  const cleaned = entityText
    .replace(/^(?:a|an|the)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ');
  const formattedTitle = words
    .map((w) => {
      if (/^(aws|gcp|iam|waf|dlp|kms|sql|api|bff|cdn|llm|rag|mcp|a2a|sre|slo|pci|erp|crm|bi|ha|dr|cdc|etl)$/i.test(w)) {
        return w.toUpperCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ')
    .slice(0, 38);

  const inferredIcon = resolveIconKeyFromText(formattedTitle, entityText);
  const lower = formattedTitle.toLowerCase();
  const zoneCategory =
    /waf|armor|cdn|iap|auth|ingress|gateway/.test(lower)
      ? 'edge'
      : /ai|gemini|vertex|agent|llm|vector|dlp|rag/.test(lower)
        ? 'ai'
        : /db|sql|spanner|postgres|redis|cache|warehouse|bigquery|looker|redshift|snowflake|databricks|kafka|pubsub|storage|lake/.test(lower)
          ? 'data'
          : 'compute';

  const safeVerId = String(nextVer || 'rev').replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
  return {
    key: `custom_${safeVerId}_${idxSuffix}`,
    title: formattedTitle || 'Custom Service Node',
    subtitle: `Prompt-Synthesized Component (${nextVer})`,
    pill: 'Live AST Node',
    l300Spec: 'mTLS 1.3 · OTLP Telemetry · Auto-Scaled',
    shape: zoneCategory === 'data' ? 'cylinder_db' : zoneCategory === 'ai' ? 'hexagon_agent' : 'service_card',
    iconKey: inferredIcon,
    zoneCategory
  };
}

/**
 * Applies a natural-language modification prompt to an existing CAG state.
 * Produces an immutable next-version CAG with full AST diff manifest.
 */
export function applyPromptMutation(currentGraph, promptText, scopedNodeId = null, scopedNodeTitle = '') {
  const next = cloneGraph(currentGraph);
  const prompt = String(promptText || '').trim();
  const lower = prompt.toLowerCase();

  next.version = bumpPatchVersion(currentGraph.version);
  const safeVerId = String(next.version || 'rev').replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
  next.prompt = prompt;
  next.timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });

  // Reset previous nodes/edges to 'baseline' so only THIS turn's delta is highlighted as 'added' / 'modified'
  for (const n of next.nodes) {
    if (n.changeStatus !== 'baseline') {
      n.changeStatus = 'baseline';
    }
  }
  for (const e of next.edges) {
    delete e.isNewInCurrentTurn;
  }

  const addedNodeIds = [];
  const replacedNodes = [];
  const removedNodeTitles = [];
  const addedEdgeIds = [];
  const patchOps = [];

  const findNodeById = (id) => next.nodes.find((n) => n.id === id);
  const findNodeByRegex = (regex) => next.nodes.find((n) => regex.test(`${n.id} ${n.title} ${n.subtitle || ''}`));
  const nextSlotInZone = (zoneId) => next.nodes.filter((n) => n.zoneId === zoneId).length;
  const nextStepNum = () => next.edges.length + 1;

  // Resolve scoped node if user clicked a node on the canvas before submitting the prompt
  const scopedNode = resolveScopedOrTargetNode(next, scopedNodeId, scopedNodeTitle);
  const scopeLabel = scopedNode ? ` [Scoped -> ${scopedNode.title}]` : '';

  const addEdgeSafe = (sourceId, targetId, label, semanticType = 'sync_request') => {
    if (!sourceId || !targetId || sourceId === targetId) return null;
    const existing = next.edges.find(
      (e) =>
        (e.sourceNodeId === sourceId && e.targetNodeId === targetId) ||
        (e.sourceNodeId === targetId && e.targetNodeId === sourceId)
    );
    if (existing) return existing.id;
    const edgeId = `e_${safeVerId}_${next.edges.length + 1}`;
    next.edges.push({
      id: edgeId,
      sourceNodeId: sourceId,
      targetNodeId: targetId,
      label: label || 'mTLS Flow',
      stepNumber: nextStepNum(),
      semanticType,
      isNewInCurrentTurn: true
    });
    addedEdgeIds.push(edgeId);
    return edgeId;
  };

  // ==========================================================================
  // INTENT 1: REMOVE / DELETE / DROP NODE
  // ==========================================================================
  const removeMatch = prompt.match(/^(?:please\s+)?(?:remove|delete|drop|decommission|eliminate)\s+(?:the\s+)?(.+)$/i);
  if (removeMatch) {
    const targetPhrase = removeMatch[1].trim();
    const victim =
      scopedNode ||
      next.nodes.find((n) => n.title.toLowerCase().includes(targetPhrase.toLowerCase())) ||
      findNodeByRegex(new RegExp(targetPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

    if (victim && next.nodes.length > 2) {
      next.nodes = next.nodes.filter((n) => n.id !== victim.id);
      next.edges = next.edges.filter((e) => e.sourceNodeId !== victim.id && e.targetNodeId !== victim.id);
      removedNodeTitles.push(victim.title);
      patchOps.push({
        op: 'REMOVE_NODE',
        target: victim.title,
        zone: victim.zoneId,
        detail: `Removed node and pruned incident edges${scopeLabel}`
      });
    }
  }

  // ==========================================================================
  // INTENT 2: SPLIT / DECOMPOSE NODE INTO TWO MICROSERVICES
  // ==========================================================================
  const splitMatch = prompt.match(/^(?:please\s+)?(?:split|decompose|break\s+up|partition)\s+(.+?)\s+into\s+(.+?)\s+(?:and|&|\+)\s+(.+)$/i);
  if (patchOps.length === 0 && splitMatch) {
    const [, sourcePhrase, partAText, partBText] = splitMatch;
    const targetNode =
      scopedNode ||
      next.nodes.find((n) => n.title.toLowerCase().includes(sourcePhrase.trim().toLowerCase())) ||
      findNodeByRegex(/checkout|order|catalog|monolith|service/i) ||
      next.nodes[Math.floor(next.nodes.length / 2)];

    if (targetNode) {
      const oldTitle = targetNode.title;
      const specA = buildNodeSpecFromEntityText(partAText, next, next.version, 1);
      const specB = buildNodeSpecFromEntityText(partBText, next, next.version, 2);

      targetNode.title = specA.title;
      targetNode.subtitle = specA.subtitle;
      targetNode.pill = specA.pill;
      targetNode.l300Spec = specA.l300Spec;
      targetNode.iconKey = specA.iconKey;
      targetNode.changeStatus = 'modified';
      targetNode.addedInVersion = next.version;
      replacedNodes.push({ id: targetNode.id, from: oldTitle, to: targetNode.title });

      const newNodeId = `node_split_${safeVerId}`;
      const newNode = {
        id: newNodeId,
        zoneId: targetNode.zoneId,
        title: specB.title,
        subtitle: specB.subtitle,
        pill: specB.pill,
        l300Spec: specB.l300Spec,
        shape: specB.shape,
        iconKey: specB.iconKey,
        slotOrder: nextSlotInZone(targetNode.zoneId),
        addedInVersion: next.version,
        changeStatus: 'added'
      };
      next.nodes.push(newNode);
      addedNodeIds.push(newNodeId);
      addEdgeSafe(targetNode.id, newNodeId, 'gRPC Split', 'sync_request');

      patchOps.push({
        op: 'SPLIT_SERVICE',
        target: `${oldTitle} → ${targetNode.title} + ${newNode.title}`,
        zone: targetNode.zoneId,
        detail: `Decomposed into 2 bounded microservices with mTLS link${scopeLabel}`
      });
    }
  }

  // ==========================================================================
  // INTENT 3: REPLACE / UPGRADE / SWAP / MIGRATE X WITH Y
  // ==========================================================================
  const replaceMatch = prompt.match(/^(?:please\s+)?(?:replace|upgrade|swap|migrate|change|convert)\s+(.+?)\s+(?:with|to|into|for)\s+(.+)$/i);
  if (patchOps.length === 0 && replaceMatch) {
    const [, oldPhrase, newPhrase] = replaceMatch;
    const specNew = buildNodeSpecFromEntityText(newPhrase.trim(), next, next.version, 1);

    // Find target node by oldPhrase, or by specNew's category/existing match (so idempotent re-clicks work!)
    let targetNode =
      scopedNode ||
      next.nodes.find((n) => n.title.toLowerCase().includes(oldPhrase.trim().toLowerCase())) ||
      (/postgres|sql|db|database|spanner|alloydb/i.test(oldPhrase)
        ? findNodeByRegex(/postgres|spanner|alloydb|sql|db|database|primary_db/i)
        : null) ||
      next.nodes.find((n) => n.title.toLowerCase() === specNew.title.toLowerCase());

    if (targetNode) {
      const prevTitle = targetNode.title;
      const isAlreadySame = prevTitle.toLowerCase() === specNew.title.toLowerCase();
      targetNode.title = specNew.title;
      targetNode.subtitle = isAlreadySame
        ? `${specNew.subtitle} (Multi-Region Quorum Verified)`
        : specNew.subtitle;
      targetNode.pill = specNew.pill;
      targetNode.l300Spec = specNew.l300Spec;
      targetNode.iconKey = specNew.iconKey;
      targetNode.shape = specNew.shape;
      targetNode.changeStatus = 'modified';
      targetNode.addedInVersion = next.version;

      replacedNodes.push({ id: targetNode.id, from: prevTitle, to: targetNode.title });
      patchOps.push({
        op: isAlreadySame ? 'VERIFY_UPGRADE' : 'REPLACE_NODE',
        target: isAlreadySame ? `${targetNode.title} (Re-Verified HA Quorum)` : `${prevTitle} → ${targetNode.title}`,
        zone: targetNode.zoneId,
        detail: `${targetNode.subtitle} [${targetNode.pill}]${scopeLabel}`
      });
    }
  }

  // ==========================================================================
  // INTENT 4: CANONICAL RECIPES & MULTI-ENTITY ADDITIONS ("add Looker, and bigquery", "add aws redshift", etc.)
  // ==========================================================================
  if (patchOps.length === 0) {
    // Check if the prompt specifically asks for the Closed-Loop OpenTelemetry & Monarch Highway
    if (/opentelemetry|otel|monarch|closed[- ]loop/i.test(lower) && !/looker|bigquery|redshift|snowflake/i.test(lower)) {
      const existingOtel = findNodeByRegex(/opentelemetry|monarch/i);
      if (existingOtel) {
        existingOtel.changeStatus = 'modified';
        existingOtel.addedInVersion = next.version;
        existingOtel.pill = 'SLO Burn Alert Active';
        replacedNodes.push({ id: existingOtel.id, from: existingOtel.title, to: existingOtel.title });
        patchOps.push({
          op: 'UPDATE_NODE',
          target: existingOtel.title,
          zone: existingOtel.zoneId,
          detail: `Updated closed-loop evaluation telemetry thresholds${scopeLabel}`
        });
      } else {
        const targetZone = resolveTargetZoneId(next, 'ai');
        const otelId = 'node_otel_monarch';
        next.nodes.push({
          id: otelId,
          zoneId: targetZone,
          title: 'OpenTelemetry & Monarch SRE',
          subtitle: 'Closed-Loop Latency, Drift & Eval Feedback Collector',
          pill: '99.99% SLO Guard',
          l300Spec: 'OTLP gRPC :4317 · W3C TraceContext · Canary Auto-Rollback',
          shape: 'service_card',
          iconKey: 'telemetry_hub',
          slotOrder: nextSlotInZone(targetZone),
          addedInVersion: next.version,
          changeStatus: 'added'
        });
        addedNodeIds.push(otelId);
        const anchor =
          scopedNode ||
          findNodeByRegex(/checkout|vertex|gemini|primary_db|spanner/i) ||
          next.nodes[next.nodes.length - 2];
        const edgeTarget =
          findNodeByRegex(/apigee|gateway|armor|web/i) || next.nodes[0];
        if (anchor) addEdgeSafe(anchor.id, otelId, 'OTLP Spans', 'closed_loop_telemetry');
        if (edgeTarget && edgeTarget.id !== otelId) {
          addEdgeSafe(otelId, edgeTarget.id, 'Adaptive Throttle', 'closed_loop_telemetry');
        }
        patchOps.push({
          op: 'ADD_CLOSED_LOOP',
          target: 'OpenTelemetry & Monarch SRE',
          zone: targetZone,
          detail: `Wired closed-loop observability & auto-throttle highway${scopeLabel}`
        });
      }
    } else {
      // Multi-Entity Semantic Extraction (handles 1, 2, 3+ services in a single prompt!)
      const entityClauses = extractEntityClausesFromAddPrompt(prompt);

      entityClauses.forEach((clause, idx) => {
        const spec = buildNodeSpecFromEntityText(clause, next, next.version, idx + 1);

        // Check if an identical component already exists in the diagram (Idempotency guard!)
        const existingNode = next.nodes.find(
          (n) =>
            n.title.toLowerCase() === spec.title.toLowerCase() ||
            (spec.key === 'redis_cache' && /redis|memorystore/i.test(n.title)) ||
            (spec.key === 'cloud_armor_waf' && /cloud armor/i.test(n.title)) ||
            (spec.key === 'dlp_model_armor' && /dlp|fraud policy|model armor/i.test(n.title))
        );

        if (existingNode) {
          existingNode.changeStatus = 'modified';
          existingNode.addedInVersion = next.version;
          if (scopedNode && scopedNode.id !== existingNode.id) {
            addEdgeSafe(scopedNode.id, existingNode.id, 'Scoped Link', 'sync_request');
          }
          replacedNodes.push({ id: existingNode.id, from: existingNode.title, to: existingNode.title });
          patchOps.push({
            op: 'ENHANCE_NODE',
            target: existingNode.title,
            zone: existingNode.zoneId,
            detail: scopedNode
              ? `Connected ${existingNode.title} to scoped node ${scopedNode.title}`
              : `Refined ${existingNode.title} configuration (${existingNode.pill})`
          });
          return;
        }

        // Determine target zone: if user scoped a node and added a related service, place in the natural architectural zone
        const targetZoneId = resolveTargetZoneId(
          next,
          spec.zoneCategory,
          scopedNode ? scopedNode.zoneId : null
        );

        const newId = `node_${spec.key}_${safeVerId}_${idx + 1}`;
        const newNode = {
          id: newId,
          zoneId: targetZoneId,
          title: spec.title,
          subtitle: spec.subtitle,
          pill: spec.pill,
          l300Spec: spec.l300Spec,
          shape: spec.shape,
          iconKey: spec.iconKey,
          slotOrder: nextSlotInZone(targetZoneId),
          addedInVersion: next.version,
          changeStatus: 'added',
          scopedTargetId: scopedNode ? scopedNode.id : null,
          scopedTargetTitle: scopedNode ? scopedNode.title : null
        };

        next.nodes.push(newNode);
        addedNodeIds.push(newId);

        // Wire connector edge to Scoped Node (if selected) OR intelligent architectural upstream anchor!
        let anchorNode = scopedNode;
        if (!anchorNode) {
          if (spec.zoneCategory === 'edge') {
            anchorNode = findNodeByRegex(/web|mobile|client|apigee/i) || next.nodes[0];
          } else if (spec.zoneCategory === 'ai') {
            anchorNode = findNodeByRegex(/vertex|gemini|vector|catalog/i) || next.nodes[Math.floor(next.nodes.length / 2)];
          } else if (spec.zoneCategory === 'data') {
            anchorNode =
              findNodeByRegex(/kafka|pub\/sub|spanner|postgres|vector|checkout|catalog/i) ||
              next.nodes[next.nodes.length - 2];
          } else {
            anchorNode = findNodeByRegex(/apigee|gateway|catalog|checkout/i) || next.nodes[0];
          }
        }

        const edgeType =
          spec.zoneCategory === 'ai'
            ? 'ai_rag_grounding'
            : spec.zoneCategory === 'data'
              ? 'async_event'
              : 'sync_request';
        const edgeLabel =
          spec.iconKey === 'looker'
            ? 'JDBC / LookML'
            : spec.iconKey === 'bigquery'
              ? 'Storage Write API'
              : spec.iconKey === 'aws_redshift'
                ? 'Cross-Cloud Sync'
                : 'mTLS Flow';

        if (anchorNode && anchorNode.id !== newId) {
          addEdgeSafe(anchorNode.id, newId, edgeLabel, edgeType);
        }

        patchOps.push({
          op: 'ADD_NODE',
          target: newNode.title,
          zone: targetZoneId,
          detail: `Wired to ${anchorNode ? anchorNode.title : 'Architecture Mesh'} via ${edgeLabel} (${newNode.pill})${scopeLabel}`
        });
      });
    }
  }

  const parts = [];
  if (addedNodeIds.length > 0) parts.push(`+${addedNodeIds.length} Added`);
  if (replacedNodes.length > 0) parts.push(`~${replacedNodes.length} Updated`);
  if (removedNodeTitles.length > 0) parts.push(`-${removedNodeTitles.length} Removed`);
  if (addedEdgeIds.length > 0) parts.push(`+${addedEdgeIds.length} Edges`);

  next.diffManifest = {
    summaryBadge: parts.join(' · ') || 'Topology Updated',
    addedNodeIds,
    replacedNodes,
    removedNodeTitles,
    addedEdgeIds,
    patchOps
  };

  return next;
}

/**
 * Generates the pre-populated 3-turn evolution history for D05 (Turn-1 -> Turn-2 -> Turn-3)
 */
export function buildPrecomputedEvolutionTimeline() {
  const v1 = createBaselineEcommerceBlueprint();

  // Turn-2: Add Memorystore Redis L2 + Upgrade PostgreSQL 16 -> Cloud Spanner Global HA
  const v2 = cloneGraph(v1);
  v2.version = 'Turn-2';
  v2.prompt =
    'Add Memorystore Redis L2 cache for sub-millisecond catalog & session lookups, and upgrade PostgreSQL 16 to Cloud Spanner Global HA.';
  v2.timestamp = '10:15:22 AM';
  v2.nodes.push({
    id: 'node_redis_cache',
    zoneId: 'z5',
    title: 'Memorystore Redis L2',
    subtitle: 'Sub-ms Session & Catalog Cache',
    pill: 'p99 < 0.4ms · 94% Hit',
    l300Spec: 'RESP3 TLS :6379 · In-Memory Read Replicas',
    shape: 'cylinder_db',
    iconKey: 'redis_memorystore',
    slotOrder: 0,
    addedInVersion: 'Turn-2',
    changeStatus: 'added'
  });
  const dbV2 = v2.nodes.find((n) => n.id === 'node_primary_db');
  if (dbV2) {
    dbV2.title = 'Cloud Spanner Global HA';
    dbV2.subtitle = 'Multi-Region TrueTime ACID Ledger';
    dbV2.pill = '99.999% SLA · RPO=0';
    dbV2.l300Spec = 'gRPC :443 · 5-Region Paxos Quorum · TrueTime';
    dbV2.iconKey = 'cloud_spanner';
    dbV2.changeStatus = 'modified';
    dbV2.addedInVersion = 'Turn-2';
  }
  v2.edges.push({
    id: 'e_d05_v2_1',
    sourceNodeId: 'node_catalog_bff',
    targetNodeId: 'node_redis_cache',
    label: 'Cache Lookup',
    stepNumber: 9,
    semanticType: 'sync_request'
  });
  v2.diffManifest = {
    summaryBadge: '+1 Added · ~1 Upgraded · +1 Edge',
    addedNodeIds: ['node_redis_cache'],
    replacedNodes: [{ id: 'node_primary_db', from: 'Cloud SQL PostgreSQL 16', to: 'Cloud Spanner Global HA' }],
    removedNodeTitles: [],
    addedEdgeIds: ['e_d05_v2_1'],
    patchOps: [
      { op: 'ADD_NODE', target: 'Memorystore Redis L2', zone: 'z5', detail: 'Added sub-ms L2 cache in Zone 5 Data HA' },
      { op: 'REPLACE_NODE', target: 'Cloud SQL PostgreSQL 16 → Cloud Spanner Global HA', zone: 'z5', detail: 'Upgraded to 99.999% Multi-Region TrueTime ACID' }
    ]
  };

  // Turn-3: Add Cloud Armor WAF + IAP in Zone 2 & DLP Policy Gate in Zone 4
  const v3 = cloneGraph(v2);
  v3.version = 'Turn-3';
  v3.prompt =
    'Add Cloud Armor WAF + Zero-Trust IAP in front of Apigee X, and insert a DLP & Fraud Policy Gate before the Gemini 3.1 Co-Pilot.';
  v3.timestamp = '10:16:48 AM';
  v3.nodes.forEach((n) => {
    n.changeStatus = 'baseline';
  });
  v3.nodes.push(
    {
      id: 'node_cloud_armor',
      zoneId: 'z2',
      title: 'Cloud Armor + IAP',
      subtitle: 'L7 DDoS WAF & BeyondCorp mTLS',
      pill: 'OWASP Top-10 Enforced',
      l300Spec: 'Anycast TLS 1.3 · CRS 3.3 WAF · Context-Aware IAP',
      shape: 'decision_diamond',
      iconKey: 'cloud_armor',
      slotOrder: 0,
      addedInVersion: 'Turn-3',
      changeStatus: 'added'
    },
    {
      id: 'node_dlp_guardrail',
      zoneId: 'z4',
      title: 'DLP & Fraud Policy Gate',
      subtitle: 'PII Redaction & Prompt Shield',
      pill: '0 PII Leak · 6ms Scan',
      l300Spec: 'Cloud DLP De-ID + Model Armor Prompt Injection Gate',
      shape: 'decision_diamond',
      iconKey: 'dlp_guardrail',
      slotOrder: 0,
      addedInVersion: 'Turn-3',
      changeStatus: 'added'
    }
  );
  v3.edges.push(
    {
      id: 'e_d05_v3_1',
      sourceNodeId: 'node_cloud_armor',
      targetNodeId: 'node_apigee_gateway',
      label: 'mTLS Verified',
      stepNumber: 10,
      semanticType: 'governance_policy'
    },
    {
      id: 'e_d05_v3_2',
      sourceNodeId: 'node_dlp_guardrail',
      targetNodeId: 'node_vertex_agent',
      label: 'PII Redacted',
      stepNumber: 11,
      semanticType: 'governance_policy'
    }
  );
  v3.diffManifest = {
    summaryBadge: '+2 Added · +2 Security Edges',
    addedNodeIds: ['node_cloud_armor', 'node_dlp_guardrail'],
    replacedNodes: [],
    removedNodeTitles: [],
    addedEdgeIds: ['e_d05_v3_1', 'e_d05_v3_2'],
    patchOps: [
      { op: 'ADD_NODE', target: 'Cloud Armor + IAP', zone: 'z2', detail: 'Inserted Zero-Trust WAF & IAP in Zone 2 Edge' },
      { op: 'ADD_NODE', target: 'DLP & Fraud Policy Gate', zone: 'z4', detail: 'Inserted inline PII redaction & prompt shield in Zone 4' }
    ]
  };

  return [v1, v2, v3];
}
