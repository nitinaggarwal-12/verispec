// ============================================================================
// Official Multi-Cloud Vendor-Specific & Tool-Specific Vector Icon Registry
// Covers 48+ distinct GCP, AWS, Azure, Kubernetes, HashiCorp & SaaS tools.
// ZERO catch-all icon reuse across distinct products (Invariant 5 enforced).
// ============================================================================

export const ICON_CATALOG = {
  // --------------------------------------------------------------------------
  // CLIENT & ACTORS
  // --------------------------------------------------------------------------
  client_web: {
    vendor: 'CLIENT',
    label: 'Web / Mobile Client App',
    bg: '#EFF6FF',
    border: '#93C5FD',
    accent: '#2563EB',
    svgInner: `
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.8"/>
      <line x1="3" y1="8" x2="21" y2="8" stroke="#2563EB" stroke-width="1.4"/>
      <circle cx="5.5" cy="6" r="0.8" fill="#EA4335"/>
      <circle cx="8" cy="6" r="0.8" fill="#FBBC04"/>
      <circle cx="10.5" cy="6" r="0.8" fill="#34A853"/>
      <path d="M8 20h8M12 16v4" stroke="#1D4ED8" stroke-width="1.8" stroke-linecap="round"/>
    `
  },
  person_actor: {
    vendor: 'ACTOR',
    label: 'User / Persona Actor',
    bg: '#EFF6FF',
    border: '#93C5FD',
    accent: '#1E40AF',
    svgInner: `
      <circle cx="12" cy="8" r="4" fill="#BFDBFE" stroke="#1E40AF" stroke-width="1.8"/>
      <path d="M5 20c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5" fill="#DBEAFE" stroke="#1E40AF" stroke-width="1.8" stroke-linecap="round"/>
    `
  },

  // --------------------------------------------------------------------------
  // OFFICIAL GOOGLE CLOUD PLATFORM (GCP) TOOL-SPECIFIC ICONS
  // Ported from PromptCanvas workstreamTopologyRenderers.ts & GCP Arch Center
  // --------------------------------------------------------------------------
  cloud_armor: {
    vendor: 'GCP',
    label: 'Google Cloud Armor WAF',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <path d="M12 2.5L19.5 5.8v5.5c0 4.9-3.2 8.2-7.5 9.7-4.3-1.5-7.5-4.8-7.5-9.7V5.8L12 2.5z" fill="#4285F4"/>
      <path d="M12 2.5v18.5c4.3-1.5 7.5-4.8 7.5-9.7V5.8L12 2.5z" fill="#1967D2"/>
      <path d="M12 6.2l4.5 2v3.5c0 3.1-2 5.3-4.5 6.4-2.5-1.1-4.5-3.3-4.5-6.4V8.2L12 6.2z" fill="#FFFFFF"/>
      <path d="M12 8.2l2.6 1.2v2.1c0 1.9-1.2 3.2-2.6 3.9-1.4-.7-2.6-2-2.6-3.9V9.4L12 8.2z" fill="#1A73E8"/>
    `
  },
  iap: {
    vendor: 'GCP',
    label: 'Google Cloud Identity-Aware Proxy (IAP)',
    bg: '#E6F4EA',
    border: '#137333',
    accent: '#137333',
    svgInner: `
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" fill="#34A853" stroke="#137333" stroke-width="1.6"/>
      <path d="M8 10.5V7.5a4 4 0 018 0v3" fill="none" stroke="#137333" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="14.8" r="1.6" fill="#FFFFFF"/>
      <line x1="12" y1="16.4" x2="12" y2="18.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
    `
  },
  apigee: {
    vendor: 'GCP',
    label: 'Google Cloud Apigee X API Gateway',
    bg: '#E6F4EA',
    border: '#137333',
    accent: '#137333',
    svgInner: `
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="#137333" stroke-width="2"/>
      <path d="M3 12h3.5M17.5 12H21M12 3v3.5M12 17.5V21" stroke="#1A73E8" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="2.4" fill="#34A853"/>
    `
  },
  gke_autopilot: {
    vendor: 'GCP',
    label: 'Google Kubernetes Engine (GKE)',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <polygon points="12,2.5 20,7.2 20,16.8 12,21.5 4,16.8 4,7.2" fill="#4285F4" stroke="#174EA6" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#FFFFFF" stroke-width="1.7"/>
      <circle cx="12" cy="12" r="1.5" fill="#FFFFFF"/>
      <line x1="12" y1="5.2" x2="12" y2="7.8" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="12" y1="16.2" x2="12" y2="18.8" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="6.2" y1="8.6" x2="8.5" y2="10" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="15.5" y1="14" x2="17.8" y2="15.4" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="17.8" y1="8.6" x2="15.5" y2="10" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="8.5" y1="14" x2="6.2" y2="15.4" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
    `
  },
  cloud_run: {
    vendor: 'GCP',
    label: 'Google Cloud Run Serverless',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <path d="M4.5 7.5l6.5 4.5-6.5 4.5V7.5z" fill="#669DF6" stroke="#1967D2" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M11 5l9 7-9 7V5z" fill="#1A73E8" stroke="#174EA6" stroke-width="1.4" stroke-linejoin="round"/>
    `
  },
  gcp_compute_engine: {
    vendor: 'GCP',
    label: 'Google Compute Engine VM',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.8" fill="#4285F4" stroke="#174EA6" stroke-width="1.5"/>
      <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="0.8" fill="#FFFFFF"/>
      <path d="M9 3.5v3M12 3.5v3M15 3.5v3M9 17.5v3M12 17.5v3M15 17.5v3M3.5 9h3M3.5 12h3M3.5 15h3M17.5 9h3M17.5 12h3M17.5 15h3" stroke="#174EA6" stroke-width="1.6" stroke-linecap="round"/>
    `
  },
  gcp_load_balancing: {
    vendor: 'GCP',
    label: 'Google Cloud Load Balancing & CDN',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <circle cx="12" cy="5.5" r="2.6" fill="#174EA6"/>
      <circle cx="5.5" cy="18" r="2.4" fill="#4285F4"/>
      <circle cx="12" cy="18" r="2.4" fill="#4285F4"/>
      <circle cx="18.5" cy="18" r="2.4" fill="#4285F4"/>
      <path d="M12 8.2V12M5.5 12h13M5.5 12v3.5M12 12v3.5M18.5 12v3.5" fill="none" stroke="#174EA6" stroke-width="1.8" stroke-linecap="round"/>
    `
  },
  kafka_pubsub: {
    vendor: 'GCP',
    label: 'Google Cloud Pub/Sub & Kafka Bus',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1967D2',
    svgInner: `
      <circle cx="12" cy="12" r="3.2" fill="#1A73E8"/>
      <circle cx="5" cy="6.5" r="2.2" fill="#4285F4" stroke="#174EA6" stroke-width="1.3"/>
      <circle cx="19" cy="6.5" r="2.2" fill="#4285F4" stroke="#174EA6" stroke-width="1.3"/>
      <circle cx="5" cy="17.5" r="2.2" fill="#34A853" stroke="#137333" stroke-width="1.3"/>
      <circle cx="19" cy="17.5" r="2.2" fill="#FBBC04" stroke="#EA8600" stroke-width="1.3"/>
      <line x1="6.8" y1="7.8" x2="9.5" y2="10" stroke="#174EA6" stroke-width="1.6"/>
      <line x1="17.2" y1="7.8" x2="14.5" y2="10" stroke="#174EA6" stroke-width="1.6"/>
      <line x1="6.8" y1="16.2" x2="9.5" y2="14" stroke="#174EA6" stroke-width="1.6"/>
      <line x1="17.2" y1="16.2" x2="14.5" y2="14" stroke="#174EA6" stroke-width="1.6"/>
    `
  },
  postgresql: {
    vendor: 'GCP',
    label: 'Google Cloud SQL for PostgreSQL',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1967D2',
    svgInner: `
      <ellipse cx="12" cy="6" rx="7" ry="2.8" fill="#4285F4" stroke="#174EA6" stroke-width="1.6"/>
      <path d="M5 6v12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V6" fill="#E8F0FE" stroke="#174EA6" stroke-width="1.6"/>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" fill="#669DF6" stroke="#174EA6" stroke-width="1.6"/>
      <path d="M5 12c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8" fill="none" stroke="#1967D2" stroke-width="1.6"/>
    `
  },
  alloydb: {
    vendor: 'GCP',
    label: 'Google Cloud AlloyDB for PostgreSQL',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <ellipse cx="12" cy="6.2" rx="6.8" ry="2.6" fill="#4285F4" stroke="#174EA6" stroke-width="1.5"/>
      <path d="M5.2 6.2v5.8c0 1.4 3 2.6 6.8 2.6s6.8-1.2 6.8-2.6V6.2" fill="none" stroke="#174EA6" stroke-width="1.7"/>
      <path d="M5.2 12v5.8c0 1.4 3 2.6 6.8 2.6s6.8-1.2 6.8-2.6V12" fill="none" stroke="#137333" stroke-width="1.7"/>
      <circle cx="12" cy="12" r="2" fill="#34A853"/>
    `
  },
  cloud_spanner: {
    vendor: 'GCP',
    label: 'Google Cloud Spanner Global HA',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <line x1="7" y1="7.5" x2="17" y2="7.5" stroke="#174EA6" stroke-width="1.8"/>
      <line x1="7" y1="7.5" x2="12" y2="17.5" stroke="#174EA6" stroke-width="1.8"/>
      <line x1="17" y1="7.5" x2="12" y2="17.5" stroke="#174EA6" stroke-width="1.8"/>
      <circle cx="7" cy="7.5" r="3" fill="#1A73E8"/>
      <circle cx="17" cy="7.5" r="3" fill="#34A853"/>
      <circle cx="12" cy="17.5" r="3" fill="#FBBC04"/>
    `
  },
  bigquery: {
    vendor: 'GCP',
    label: 'Google Cloud BigQuery Lakehouse',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <circle cx="10.8" cy="10.8" r="6.2" fill="#FFFFFF" stroke="#1A73E8" stroke-width="1.9"/>
      <rect x="7.5" y="10.2" width="1.8" height="3.6" fill="#1A73E8"/>
      <rect x="10" y="7.4" width="1.8" height="6.4" fill="#34A853"/>
      <rect x="12.5" y="8.8" width="1.8" height="5" fill="#FBBC04"/>
      <line x1="15.3" y1="15.3" x2="20.2" y2="20.2" stroke="#174EA6" stroke-width="2.4" stroke-linecap="round"/>
    `
  },
  looker: {
    vendor: 'GCP',
    label: 'Google Cloud Looker Enterprise BI',
    bg: '#F3E8FD',
    border: '#8430CE',
    accent: '#7C3AED',
    svgInner: `
      <circle cx="10" cy="14.2" r="5.2" fill="none" stroke="#7C3AED" stroke-width="2"/>
      <circle cx="15.5" cy="7.5" r="3.2" fill="none" stroke="#1A73E8" stroke-width="1.9"/>
      <circle cx="9.2" cy="6.2" r="2" fill="#34A853"/>
      <circle cx="10" cy="14.2" r="1.9" fill="#EA4335"/>
    `
  },
  redis_memorystore: {
    vendor: 'GCP',
    label: 'Google Cloud Memorystore (Redis / Valkey)',
    bg: '#FEF7E0',
    border: '#EA8600',
    accent: '#EA8600',
    svgInner: `
      <polygon points="13.2,3.5 6.5,13 11.5,13 10.2,20.5 17.5,11 12.5,11" fill="#FBBC04" stroke="#B06000" stroke-width="1.4" stroke-linejoin="round"/>
    `
  },
  gcp_firestore: {
    vendor: 'GCP',
    label: 'Google Cloud Firestore Document DB',
    bg: '#FEF7E0',
    border: '#F29900',
    accent: '#EA8600',
    svgInner: `
      <path d="M12 4L20 8L12 12L4 8Z" fill="#FBBC04" stroke="#EA8600" stroke-width="1.3"/>
      <path d="M4 12.2L12 16.2L20 12.2" fill="none" stroke="#EA8600" stroke-width="2" stroke-linecap="round"/>
      <path d="M4 16.2L12 20.2L20 16.2" fill="none" stroke="#B06000" stroke-width="2" stroke-linecap="round"/>
    `
  },
  vertex_ai: {
    vendor: 'GCP',
    label: 'Google Cloud Vertex AI & Gemini',
    bg: '#F3E8FD',
    border: '#8430CE',
    accent: '#7C3AED',
    svgInner: `
      <path d="M12 2.5C12.8 7.5 16.5 11.2 21.5 12C16.5 12.8 12.8 16.5 12 21.5C11.2 16.5 7.5 12.8 2.5 12C7.5 11.2 11.2 7.5 12 2.5Z" fill="#9334E6" stroke="#6B21A8" stroke-width="1.3"/>
      <circle cx="12" cy="12" r="2.3" fill="#FFFFFF"/>
    `
  },
  vector_search: {
    vendor: 'GCP',
    label: 'Vertex AI Vector Search 2.0',
    bg: '#F3E8FD',
    border: '#8430CE',
    accent: '#6D28D9',
    svgInner: `
      <circle cx="11" cy="11" r="6.2" fill="#F3E8FD" stroke="#6D28D9" stroke-width="1.8"/>
      <line x1="15.5" y1="15.5" x2="20.2" y2="20.2" stroke="#6D28D9" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="9.2" cy="9.8" r="1.4" fill="#1A73E8"/>
      <circle cx="13" cy="9.2" r="1.4" fill="#34A853"/>
      <circle cx="11.2" cy="13.2" r="1.4" fill="#EA4335"/>
      <polygon points="9.2,9.8 13,9.2 11.2,13.2" fill="none" stroke="#6D28D9" stroke-width="1.1"/>
    `
  },
  adk_agent: {
    vendor: 'GCP',
    label: 'Google ADK A2A & MCP Agent',
    bg: '#F3E8FD',
    border: '#9333EA',
    accent: '#7E22CE',
    svgInner: `
      <polygon points="12,2.8 20,7.4 20,16.6 12,21.2 4,16.6 4,7.4" fill="#F3E8FF" stroke="#7E22CE" stroke-width="1.75"/>
      <circle cx="12" cy="9.8" r="2.6" fill="#9333EA"/>
      <path d="M7.8 16.8c0-2.1 1.9-3.6 4.2-3.6s4.2 1.5 4.2 3.6" fill="none" stroke="#1A73E8" stroke-width="1.8" stroke-linecap="round"/>
    `
  },
  dlp_guardrail: {
    vendor: 'GCP',
    label: 'Google Cloud Sensitive Data Protection (DLP)',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#174EA6',
    svgInner: `
      <path d="M12 3L19.5 6v5.5c0 4.6-3 7.8-7.5 9.5-4.5-1.7-7.5-4.9-7.5-9.5V6L12 3z" fill="#E8F0FE" stroke="#174EA6" stroke-width="1.7"/>
      <circle cx="11.4" cy="11.4" r="3.3" fill="none" stroke="#174EA6" stroke-width="1.8"/>
      <circle cx="11.4" cy="11.4" r="1.3" fill="#EA4335"/>
      <line x1="13.8" y1="13.8" x2="17" y2="17" stroke="#174EA6" stroke-width="2" stroke-linecap="round"/>
    `
  },
  cloud_kms: {
    vendor: 'GCP',
    label: 'Google Cloud KMS & Cloud HSM',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#174EA6',
    svgInner: `
      <circle cx="8.8" cy="12" r="4" fill="none" stroke="#174EA6" stroke-width="2"/>
      <circle cx="8.8" cy="12" r="1.4" fill="#174EA6"/>
      <path d="M12.8 12H20.5M17.2 12v3.2M20 12v3.8" stroke="#EA4335" stroke-width="2" stroke-linecap="round"/>
    `
  },
  gcp_secret_manager: {
    vendor: 'GCP',
    label: 'Google Cloud Secret Manager',
    bg: '#FCE8E6',
    border: '#D93025',
    accent: '#C5221F',
    svgInner: `
      <rect x="4.5" y="5" width="15" height="14" rx="2.5" fill="#FCE8E6" stroke="#C5221F" stroke-width="1.7"/>
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#C5221F" stroke-width="1.8"/>
      <path d="M12 7v2M12 15v2M7 12h2M15 12h2" stroke="#EA4335" stroke-width="1.6" stroke-linecap="round"/>
    `
  },
  vpc_sc: {
    vendor: 'GCP',
    label: 'Google Cloud VPC Service Controls',
    bg: '#FCE8E6',
    border: '#D93025',
    accent: '#C5221F',
    svgInner: `
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#FCE8E6" stroke="#D93025" stroke-width="1.7" stroke-dasharray="3 1.5"/>
      <path d="M12 6l5.5 2.4V12c0 3.6-2.4 6-5.5 7.2-3.1-1.2-5.5-3.6-5.5-7.2V8.4L12 6z" fill="#EA4335" fill-opacity="0.2" stroke="#C5221F" stroke-width="1.6"/>
      <rect x="10" y="11" width="4" height="3.6" rx="0.8" fill="#C5221F"/>
    `
  },
  psc_bridge: {
    vendor: 'GCP',
    label: 'Google Cloud Private Service Connect (PSC)',
    bg: '#E6F4EA',
    border: '#137333',
    accent: '#137333',
    svgInner: `
      <circle cx="6.2" cy="12" r="2.8" fill="#1A73E8"/>
      <circle cx="17.8" cy="12" r="2.8" fill="#137333"/>
      <path d="M9.4 12h5.2M12.6 9.5L15.2 12l-2.6 2.5" fill="none" stroke="#137333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  dataflow: {
    vendor: 'GCP',
    label: 'Google Cloud Dataflow (Apache Beam)',
    bg: '#E6F4EA',
    border: '#137333',
    accent: '#137333',
    svgInner: `
      <path d="M4 7h11l3.5 5-3.5 5H4l3.5-5L4 7z" fill="#CEEAD6" stroke="#137333" stroke-width="1.7" stroke-linejoin="round"/>
      <circle cx="11.5" cy="12" r="2.2" fill="#1A73E8"/>
    `
  },
  datastream: {
    vendor: 'GCP',
    label: 'Google Cloud Datastream CDC',
    bg: '#E6F4EA',
    border: '#0D9488',
    accent: '#0D9488',
    svgInner: `
      <path d="M4.5 8h11l-2-2M15.5 8l-2 2" fill="none" stroke="#0D9488" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.5 12h15l-2-2M19.5 12l-2 2" fill="none" stroke="#1A73E8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.5 16h11l-2-2M15.5 16l-2 2" fill="none" stroke="#137333" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  gcp_composer_airflow: {
    vendor: 'GCP',
    label: 'Google Cloud Composer (Apache Airflow)',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#1A73E8',
    svgInner: `
      <path d="M12 12L12 4C15.5 4 17.5 6.5 12 12Z" fill="#EA4335"/>
      <path d="M12 12L20 12C20 15.5 17.5 17.5 12 12Z" fill="#4285F4"/>
      <path d="M12 12L12 20C8.5 20 6.5 17.5 12 12Z" fill="#34A853"/>
      <path d="M12 12L4 12C4 8.5 6.5 6.5 12 12Z" fill="#FBBC04"/>
      <circle cx="12" cy="12" r="2" fill="#174EA6"/>
    `
  },
  cloud_storage: {
    vendor: 'GCP',
    label: 'Google Cloud Storage (GCS) & Iceberg',
    bg: '#E8F0FE',
    border: '#1A73E8',
    accent: '#174EA6',
    svgInner: `
      <polygon points="4.8,7 19.2,7 17.4,19 6.6,19" fill="#4285F4" stroke="#174EA6" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="4" y="5.5" width="16" height="2.6" rx="1" fill="#174EA6"/>
      <line x1="8.5" y1="11.2" x2="15.5" y2="11.2" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="9.2" y1="14.8" x2="14.8" y2="14.8" stroke="#AECBFA" stroke-width="1.8" stroke-linecap="round"/>
    `
  },
  cloud_build: {
    vendor: 'GCP',
    label: 'Google Cloud Build & SLSA L3',
    bg: '#FEF7E0',
    border: '#EA8600',
    accent: '#B06000',
    svgInner: `
      <polygon points="12,3.5 19.5,7.8 12,12 4.5,7.8" fill="#FBBC04" stroke="#B06000" stroke-width="1.3"/>
      <polygon points="4.5,9.2 12,13.5 12,20.5 4.5,16.2" fill="#4285F4"/>
      <polygon points="19.5,9.2 12,13.5 12,20.5 19.5,16.2" fill="#1A73E8"/>
    `
  },
  cloud_interconnect: {
    vendor: 'GCP',
    label: 'Google Cloud Interconnect & NCC',
    bg: '#FCE8E6',
    border: '#D93025',
    accent: '#1A73E8',
    svgInner: `
      <rect x="3.5" y="7.5" width="4.8" height="9" rx="1.2" fill="#1A73E8"/>
      <rect x="15.7" y="7.5" width="4.8" height="9" rx="1.2" fill="#D93025"/>
      <path d="M8.3 10.2h7.4M8.3 13.8h7.4" stroke="#202124" stroke-width="1.8" stroke-linecap="round"/>
      <polygon points="12,7.8 14,10.2 12,12.6" fill="#D93025"/>
      <polygon points="12,11.4 10,13.8 12,16.2" fill="#1A73E8"/>
    `
  },
  telemetry_hub: {
    vendor: 'GCP',
    label: 'Google Cloud Trace, Monitoring & Monarch',
    bg: '#FEF7E0',
    border: '#EA8600',
    accent: '#1A73E8',
    svgInner: `
      <rect x="4" y="6" width="9" height="3" rx="1.5" fill="#1A73E8"/>
      <rect x="7" y="10.5" width="11" height="3" rx="1.5" fill="#F29900"/>
      <rect x="10" y="15" width="10" height="3" rx="1.5" fill="#34A853"/>
    `
  },

  // --------------------------------------------------------------------------
  // OFFICIAL AMAZON WEB SERVICES (AWS) TOOL-SPECIFIC ICONS
  // Each AWS service has its own distinct product icon & AWS category color!
  // --------------------------------------------------------------------------
  aws_redshift: {
    vendor: 'AWS',
    label: 'Amazon Redshift Cloud Data Warehouse',
    bg: '#F3E8FF',
    border: '#8C4FFF',
    accent: '#6B21A8',
    svgInner: `
      <polygon points="12,2.5 19.5,6.5 19.5,17.5 12,21.5 4.5,17.5 4.5,6.5" fill="#EDE9FE" stroke="#8C4FFF" stroke-width="1.8" stroke-linejoin="round"/>
      <line x1="12" y1="2.5" x2="12" y2="21.5" stroke="#6B21A8" stroke-width="1.8"/>
      <polyline points="7,8.5 12,5.8 17,8.5" fill="none" stroke="#8C4FFF" stroke-width="1.6"/>
      <polyline points="7,15.5 12,18.2 17,15.5" fill="none" stroke="#8C4FFF" stroke-width="1.6"/>
    `
  },
  aws_aurora: {
    vendor: 'AWS',
    label: 'Amazon Aurora PostgreSQL / MySQL HA',
    bg: '#EFF6FF',
    border: '#2E73B8',
    accent: '#1D4ED8',
    svgInner: `
      <ellipse cx="10.5" cy="6.2" rx="6" ry="2.4" fill="#DBEAFE" stroke="#2E73B8" stroke-width="1.7"/>
      <path d="M4.5 6.2v11c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4v-11" fill="#EFF6FF" stroke="#2E73B8" stroke-width="1.7"/>
      <path d="M4.5 11.5c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4" fill="none" stroke="#2E73B8" stroke-width="1.5"/>
      <path d="M18 4l1 2.4L21.4 7.4 19 8.4 18 10.8 17 8.4 14.6 7.4 17 6.4z" fill="#ED7100"/>
    `
  },
  aws_s3: {
    vendor: 'AWS',
    label: 'Amazon S3 Object Storage Bucket',
    bg: '#ECFDF5',
    border: '#3F8624',
    accent: '#2E6B19',
    svgInner: `
      <path d="M5.5 8.5h13l-1.5 11H7L5.5 8.5z" fill="#DCFCE7" stroke="#3F8624" stroke-width="1.75" stroke-linejoin="round"/>
      <ellipse cx="12" cy="8.5" rx="6.5" ry="2.2" fill="#BBF7D0" stroke="#3F8624" stroke-width="1.7"/>
      <path d="M5.5 8.5C5.5 4.2 18.5 4.2 18.5 8.5" fill="none" stroke="#2E6B19" stroke-width="1.6"/>
      <circle cx="12" cy="14" r="1.8" fill="#3F8624"/>
    `
  },
  aws_lambda: {
    vendor: 'AWS',
    label: 'AWS Lambda Serverless Compute',
    bg: '#FFF7ED',
    border: '#ED7100',
    accent: '#C2410C',
    svgInner: `
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="#FFEDD5" stroke="#ED7100" stroke-width="1.75"/>
      <path d="M7.5 17.5L11.8 9.2M9.5 6.5h2.2l4.8 11h2.2" fill="none" stroke="#C2410C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  aws_eks: {
    vendor: 'AWS',
    label: 'Amazon Elastic Kubernetes Service (EKS)',
    bg: '#FFF7ED',
    border: '#ED7100',
    accent: '#C2410C',
    svgInner: `
      <polygon points="12,2.5 20,7.2 20,16.8 12,21.5 4,16.8 4,7.2" fill="#FFEDD5" stroke="#ED7100" stroke-width="1.75"/>
      <polygon points="12,6.5 16.8,9.3 16.8,14.7 12,17.5 7.2,14.7 7.2,9.3" fill="none" stroke="#C2410C" stroke-width="1.6"/>
      <circle cx="12" cy="12" r="1.8" fill="#ED7100"/>
    `
  },
  aws_dynamodb: {
    vendor: 'AWS',
    label: 'Amazon DynamoDB Key-Value NoSQL',
    bg: '#EFF6FF',
    border: '#2E73B8',
    accent: '#1D4ED8',
    svgInner: `
      <ellipse cx="10.2" cy="6" rx="5.8" ry="2.3" fill="#DBEAFE" stroke="#2E73B8" stroke-width="1.6"/>
      <path d="M4.4 6v12c0 1.3 2.6 2.3 5.8 2.3s5.8-1 5.8-2.3V6" fill="#EFF6FF" stroke="#2E73B8" stroke-width="1.6"/>
      <polygon points="17.5,6.5 13.5,12.5 16.8,12.5 15.5,18.5 20.5,11.5 17.2,11.5" fill="#ED7100" stroke="#9A3412" stroke-width="0.9" stroke-linejoin="round"/>
    `
  },
  aws_bedrock: {
    vendor: 'AWS',
    label: 'Amazon Bedrock Foundation Models',
    bg: '#ECFDF5',
    border: '#01A88D',
    accent: '#047857',
    svgInner: `
      <rect x="4.5" y="14" width="15" height="4.5" rx="1.2" fill="#A7F3D0" stroke="#047857" stroke-width="1.6"/>
      <rect x="6.5" y="9" width="11" height="4.2" rx="1.2" fill="#6EE7B7" stroke="#047857" stroke-width="1.6"/>
      <path d="M12 3l1.3 2.7L16 7l-2.7 1.3L12 11l-1.3-2.7L8 7l2.7-1.3z" fill="#059669"/>
    `
  },
  aws_kinesis: {
    vendor: 'AWS',
    label: 'Amazon Kinesis Data Streams',
    bg: '#F3E8FF',
    border: '#8C4FFF',
    accent: '#6B21A8',
    svgInner: `
      <path d="M3.5 7.5c4 0 5 3 9 3s5-3 8-3" fill="none" stroke="#8C4FFF" stroke-width="2" stroke-linecap="round"/>
      <path d="M3.5 12c4 0 5 3 9 3s5-3 8-3" fill="none" stroke="#6B21A8" stroke-width="2" stroke-linecap="round"/>
      <path d="M3.5 16.5c4 0 5 3 9 3s5-3 8-3" fill="none" stroke="#9333EA" stroke-width="2" stroke-linecap="round"/>
    `
  },
  aws_sqs_sns: {
    vendor: 'AWS',
    label: 'Amazon SQS & SNS Event Messaging',
    bg: '#FDF2F8',
    border: '#E7157B',
    accent: '#BE185D',
    svgInner: `
      <rect x="3.5" y="6" width="4" height="12" rx="1" fill="#FBCFE8" stroke="#BE185D" stroke-width="1.6"/>
      <rect x="9" y="6" width="4" height="12" rx="1" fill="#F9A8D4" stroke="#BE185D" stroke-width="1.6"/>
      <path d="M14.5 12h6M18 9l3 3-3 3" fill="none" stroke="#BE185D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  aws_cloudfront_waf: {
    vendor: 'AWS',
    label: 'Amazon CloudFront CDN & AWS WAF',
    bg: '#F3E8FF',
    border: '#8C4FFF',
    accent: '#6B21A8',
    svgInner: `
      <circle cx="11" cy="12" r="7" fill="#EDE9FE" stroke="#6B21A8" stroke-width="1.7"/>
      <ellipse cx="11" cy="12" rx="3.2" ry="7" fill="none" stroke="#8C4FFF" stroke-width="1.4"/>
      <line x1="4" y1="12" x2="18" y2="12" stroke="#8C4FFF" stroke-width="1.4"/>
      <path d="M17.5 11l3.5 1.5v2.8c0 2.4-1.5 4-3.5 4.7-2-.7-3.5-2.3-3.5-4.7v-2.8L17.5 11z" fill="#DD344C" stroke="#FFFFFF" stroke-width="1"/>
    `
  },
  aws_athena: {
    vendor: 'AWS',
    label: 'Amazon Athena Serverless Trino SQL',
    bg: '#F3E8FF',
    border: '#8C4FFF',
    accent: '#6B21A8',
    svgInner: `
      <circle cx="10.5" cy="10.5" r="6" fill="#F3E8FF" stroke="#8C4FFF" stroke-width="1.8"/>
      <path d="M8 12.5h5M8 9.5h3.5" stroke="#6B21A8" stroke-width="1.7" stroke-linecap="round"/>
      <line x1="15" y1="15" x2="20" y2="20" stroke="#ED7100" stroke-width="2.4" stroke-linecap="round"/>
    `
  },

  // --------------------------------------------------------------------------
  // AZURE, ANTHROPIC, SNOWFLAKE, DATABRICKS, TERRAFORM, APOLLO & SAAS ICONS
  // --------------------------------------------------------------------------
  azure_openai: {
    vendor: 'AZURE',
    label: 'Azure OpenAI Service & Foundry',
    bg: '#E0F2FE',
    border: '#0284C7',
    accent: '#0078D4',
    svgInner: `
      <polygon points="11,3.5 4.5,18.5 9.2,18.5 13.5,8.5" fill="#0078D4"/>
      <polygon points="12.5,10.5 15.8,18.5 20,18.5 14.5,6.5" fill="#38BDF8"/>
      <circle cx="17.5" cy="6.5" r="2.2" fill="#0284C7"/>
    `
  },
  anthropic_claude: {
    vendor: 'ANTHROPIC',
    label: 'Anthropic Claude Frontier Model',
    bg: '#FEF3C7',
    border: '#D97706',
    accent: '#B45309',
    svgInner: `
      <circle cx="12" cy="12" r="8" fill="#FDE68A" stroke="#B45309" stroke-width="1.7"/>
      <path d="M12 5.5v13M5.5 12h13M7.4 7.4l9.2 9.2M16.6 7.4l-9.2 9.2" stroke="#B45309" stroke-width="1.8" stroke-linecap="round"/>
    `
  },
  terraform_iac: {
    vendor: 'HASHICORP',
    label: 'HashiCorp Terraform IaC',
    bg: '#F3E8FD',
    border: '#7C3AED',
    accent: '#6D28D9',
    svgInner: `
      <polygon points="4.5,4.5 10.5,7.8 10.5,14.4 4.5,11.1" fill="#7C3AED"/>
      <polygon points="11.5,8.4 17.5,11.7 17.5,18.3 11.5,15" fill="#6D28D9"/>
      <polygon points="18.3,8.4 20.8,7 20.8,13.6 18.3,15" fill="#A78BFA"/>
      <polygon points="4.5,12.5 10.5,15.8 10.5,20.8 4.5,17.5" fill="#5B21B6"/>
    `
  },
  graphql_bff: {
    vendor: 'APOLLO',
    label: 'Apollo GraphQL Federation BFF',
    bg: '#FDF2F8',
    border: '#F9A8D4',
    accent: '#DB2777',
    svgInner: `
      <polygon points="12,3.2 19.6,7.6 19.6,16.4 12,20.8 4.4,16.4 4.4,7.6" fill="none" stroke="#DB2777" stroke-width="1.6"/>
      <polygon points="12,3.2 19.6,16.4 4.4,16.4" fill="#FCE7F3" fill-opacity="0.6" stroke="#DB2777" stroke-width="1.4"/>
      <circle cx="12" cy="3.2" r="1.8" fill="#DB2777"/>
      <circle cx="19.6" cy="7.6" r="1.8" fill="#DB2777"/>
      <circle cx="19.6" cy="16.4" r="1.8" fill="#DB2777"/>
      <circle cx="12" cy="20.8" r="1.8" fill="#DB2777"/>
      <circle cx="4.4" cy="16.4" r="1.8" fill="#DB2777"/>
      <circle cx="4.4" cy="7.6" r="1.8" fill="#DB2777"/>
    `
  },
  snowflake: {
    vendor: 'SNOWFLAKE',
    label: 'Snowflake Data Cloud',
    bg: '#F0F9FF',
    border: '#7DD3FC',
    accent: '#0284C7',
    svgInner: `
      <line x1="12" y1="3" x2="12" y2="21" stroke="#0284C7" stroke-width="1.9" stroke-linecap="round"/>
      <line x1="4.2" y1="7.5" x2="19.8" y2="16.5" stroke="#0284C7" stroke-width="1.9" stroke-linecap="round"/>
      <line x1="19.8" y1="7.5" x2="4.2" y2="16.5" stroke="#0284C7" stroke-width="1.9" stroke-linecap="round"/>
      <polygon points="12,8.5 15,10.2 15,13.8 12,15.5 9,13.8 9,10.2" fill="#E0F2FE" stroke="#0369A1" stroke-width="1.5"/>
    `
  },
  databricks: {
    vendor: 'DATABRICKS',
    label: 'Databricks Unity Lakehouse & Spark',
    bg: '#FEF2F2',
    border: '#FCA5A5',
    accent: '#DC2626',
    svgInner: `
      <polygon points="12,3 20,7.5 12,12 4,7.5" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.7" stroke-linejoin="round"/>
      <polyline points="4,12 12,16.5 20,12" fill="none" stroke="#DC2626" stroke-width="1.8" stroke-linejoin="round"/>
      <polyline points="4,16 12,20.5 20,16" fill="none" stroke="#B91C1C" stroke-width="1.8" stroke-linejoin="round"/>
    `
  },
  external_saas: {
    vendor: 'SAAS',
    label: 'External Partner / Enterprise SaaS',
    bg: '#F8FAFC',
    border: '#CBD5E1',
    accent: '#475569',
    svgInner: `
      <circle cx="12" cy="12" r="8" fill="#F1F5F9" stroke="#475569" stroke-width="1.75"/>
      <ellipse cx="12" cy="12" rx="3.8" ry="8" fill="none" stroke="#475569" stroke-width="1.4"/>
      <line x1="4" y1="12" x2="20" y2="12" stroke="#475569" stroke-width="1.4"/>
    `
  },
  cloudflare_waf: {
    vendor: 'CLOUDFLARE',
    label: 'Cloudflare Anycast CDN & Zero-Trust WAF',
    bg: '#FFF7ED',
    border: '#F97316',
    accent: '#EA580C',
    svgInner: `
      <path d="M6.5 16.5h11a3.2 3.2 0 0 0 .4-6.3 4.8 4.8 0 0 0-9.2-1.2A3.6 3.6 0 0 0 6.5 16.5z" fill="#FFEDD5" stroke="#EA580C" stroke-width="1.75" stroke-linejoin="round"/>
      <path d="M13 10.5l-1.5 3h2.4l-1.4 3" fill="none" stroke="#C2410C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  mongodb_atlas: {
    vendor: 'MONGODB',
    label: 'MongoDB Atlas Vector & Document DB',
    bg: '#ECFDF5',
    border: '#10B981',
    accent: '#047857',
    svgInner: `
      <path d="M12 2.8C8.2 7 7.2 11.2 9.5 15.8c1 2 2.1 3 2.5 3.4.4-.4 1.5-1.4 2.5-3.4 2.3-4.6 1.3-8.8-2.5-13z" fill="#A7F3D0" stroke="#047857" stroke-width="1.7" stroke-linejoin="round"/>
      <line x1="12" y1="6" x2="12" y2="21.2" stroke="#065F46" stroke-width="1.6" stroke-linecap="round"/>
    `
  },
  elasticsearch: {
    vendor: 'ELASTIC',
    label: 'ElasticSearch BM25 & Lexical Search Engine',
    bg: '#FEF9C3',
    border: '#EAB308',
    accent: '#0284C7',
    svgInner: `
      <rect x="4.5" y="5" width="13" height="4" rx="2" fill="#FACC15" stroke="#A16207" stroke-width="1.4"/>
      <rect x="6.5" y="10" width="13" height="4" rx="2" fill="#38BDF8" stroke="#0369A1" stroke-width="1.4"/>
      <rect x="4.5" y="15" width="13" height="4" rx="2" fill="#10B981" stroke="#047857" stroke-width="1.4"/>
    `
  },
  hashicorp_vault: {
    vendor: 'HASHICORP',
    label: 'HashiCorp Vault Dynamic Secrets & PKI',
    bg: '#F8FAFC',
    border: '#334155',
    accent: '#0F172A',
    svgInner: `
      <polygon points="12,20.5 3.5,5.5 20.5,5.5" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="12" cy="10.2" r="1.6" fill="#0F172A"/>
      <circle cx="9.5" cy="7.8" r="1.1" fill="#334155"/>
      <circle cx="14.5" cy="7.8" r="1.1" fill="#334155"/>
    `
  },
  github_actions: {
    vendor: 'GITHUB',
    label: 'GitHub Actions CI/CD & OIDC Workflows',
    bg: '#EFF6FF',
    border: '#2563EB',
    accent: '#1D4ED8',
    svgInner: `
      <circle cx="7.5" cy="7.5" r="2.6" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.7"/>
      <circle cx="7.5" cy="16.5" r="2.6" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="1.7"/>
      <circle cx="16.5" cy="12" r="2.6" fill="#93C5FD" stroke="#1D4ED8" stroke-width="1.7"/>
      <path d="M7.5 10.1v3.8M10.1 7.5c2.5 0 3.2 4.5 3.8 4.5" fill="none" stroke="#1D4ED8" stroke-width="1.7"/>
    `
  },
  okta_auth0: {
    vendor: 'OKTA',
    label: 'Okta Workforce & Auth0 SAML/OIDC IdP',
    bg: '#EFF6FF',
    border: '#3B82F6',
    accent: '#1D4ED8',
    svgInner: `
      <circle cx="12" cy="12" r="7.5" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2"/>
      <circle cx="12" cy="12" r="3.4" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="1.7"/>
    `
  },
  stripe_pci: {
    vendor: 'STRIPE',
    label: 'Stripe PCI-DSS L1 Payment Tokenization',
    bg: '#EEF2FF',
    border: '#6366F1',
    accent: '#4F46E5',
    svgInner: `
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" fill="#E0E7FF" stroke="#4F46E5" stroke-width="1.75"/>
      <rect x="3.5" y="9" width="17" height="2.8" fill="#4F46E5"/>
      <rect x="6.5" y="14.2" width="5" height="1.8" rx="0.8" fill="#4338CA"/>
    `
  },
  pagerduty_incident: {
    vendor: 'PAGERDUTY',
    label: 'PagerDuty Incident Response & On-Call SRE',
    bg: '#ECFDF5',
    border: '#10B981',
    accent: '#047857',
    svgInner: `
      <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" fill="#D1FAE5" stroke="#047857" stroke-width="1.75"/>
      <path d="M9 16.5v-9h4.2a2.8 2.8 0 0 1 0 5.6H9" fill="none" stroke="#065F46" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
    `
  }
};

/**
 * Title-First Vendor-Specific & Tool-Specific Icon Resolver (`Rule 53` + `Rule 57B`)
 * Resolves exact product icons from `title` first before inspecting `subtitle` or `badge`,
 * preventing subtitle mentions (like "PostgreSQL" or "VPC-SC") from hijacking primary tool icons!
 */
export function resolveIconKeyFromText(title = '', subtitle = '', badge = '') {
  const t = String(title || '').toLowerCase();
  const full = `${title} ${subtitle} ${badge}`.toLowerCase();

  // 1. Explicit AWS tool-specific resolution on title first
  if (/\bredshift\b/.test(t)) return 'aws_redshift';
  if (/\baurora\b/.test(t)) return 'aws_aurora';
  if (/\bdynamodb\b/.test(t)) return 'aws_dynamodb';
  if (/\bs3\b|\bsimple storage\b/.test(t)) return 'aws_s3';
  if (/\blambda\b/.test(t)) return 'aws_lambda';
  if (/\beks\b|\belastic kubernetes\b/.test(t)) return 'aws_eks';
  if (/\bbedrock\b/.test(t)) return 'aws_bedrock';
  if (/\bkinesis\b/.test(t)) return 'aws_kinesis';
  if (/\bsqs\b|\bsns\b|\beventbridge\b/.test(t)) return 'aws_sqs_sns';
  if (/\bcloudfront\b|\baws waf\b|\broute\s*53\b/.test(t)) return 'aws_cloudfront_waf';
  if (/\bathena\b|\bglue\b/.test(t)) return 'aws_athena';

  // 2. Explicit Azure, Anthropic, Snowflake, Databricks, Terraform, Apollo & Enterprise SaaS resolution on title first
  if (/\bazure\b|\bopenai\b/.test(t)) return 'azure_openai';
  if (/\banthropic\b|\bclaude\b/.test(t)) return 'anthropic_claude';
  if (/\bcloudflare\b/.test(t)) return 'cloudflare_waf';
  if (/\bmongodb\b|\batlas document\b/.test(t)) return 'mongodb_atlas';
  if (/\belasticsearch\b|\belastic\b|\bopensearch\b/.test(t)) return 'elasticsearch';
  if (/\bhashicorp vault\b|\bvault pki\b|\bvault secret/.test(t)) return 'hashicorp_vault';
  if (/\bgithub actions\b|\bgithub ci\b/.test(t)) return 'github_actions';
  if (/\bokta\b|\bauth0\b/.test(t)) return 'okta_auth0';
  if (/\bstripe\b/.test(t)) return 'stripe_pci';
  if (/\bpagerduty\b/.test(t)) return 'pagerduty_incident';
  if (/\bterraform\b|\bhcl\b/.test(t)) return 'terraform_iac';
  if (/\bsnowflake\b/.test(t)) return 'snowflake';
  if (/\bdatabricks\b|\bdelta lake\b|\bspark\b/.test(t)) return 'databricks';
  if (/\bgraphql\b|\bapollo\b|\bsupergraph\b|\bsubgraph\b/.test(t)) return 'graphql_bff';

  // 3. Explicit Google Cloud Platform (GCP) tool-specific resolution on title first
  if (/\blooker\b/.test(t)) return 'looker';
  if (/\bbigquery\b|\bbiglake\b|\bdataform\b/.test(t)) return 'bigquery';
  if (/\balloydb\b/.test(t)) return 'alloydb';
  if (/\bspanner\b|\bpaxos\b|\btruetime\b/.test(t)) return 'cloud_spanner';
  if (/\bfirestore\b/.test(t)) return 'gcp_firestore';
  if (/\bcomposer\b|\bairflow\b/.test(t)) return 'gcp_composer_airflow';
  if (/\bsecret manager\b/.test(t)) return 'gcp_secret_manager';
  if (/\bprivate service connect\b|\bpsc\b/.test(t)) return 'psc_bridge';
  if (/\bcloud armor\b|(\barmor\b|\bwaf\b|\bddos\b)/.test(t) && !/model armor/.test(t)) return 'cloud_armor';
  if (/\bkms\b|\bhsm\b|\bcmek\b|\bcosign\b/.test(t)) return 'cloud_kms';
  if (/\bvpc-sc\b|\bservice controls\b|\bperimeter\b|\benclave\b/.test(t)) return 'vpc_sc';
  if (/\bdlp\b|\bmodel armor\b|\bguardrail\b|\bpii\b|\bsafety\b|\bfraud\b/.test(t)) return 'dlp_guardrail';
  if (/\bvector\b|\bhnsw\b|\bembedding\b|\bbm25\b|\brerank\b|\brrf\b/.test(t)) return 'vector_search';
  if (/\badk\b|\ba2a\b|\bmcp\b|\bsub-agent\b|\bsupervisor\b/.test(t)) return 'adk_agent';
  if (/\bgemini\b|\bvertex\b|\blora\b|\bsft\b|\bllm\b/.test(t)) return 'vertex_ai';
  if (/\bdataflow\b|\bbeam\b/.test(t)) return 'dataflow';
  if (/\bdatastream\b|\bcdc\b|\bdebezium\b/.test(t)) return 'datastream';
  if (/\bpub\/?sub\b|\bkafka\b|\boutbox\b|\bevent\b/.test(t)) return 'kafka_pubsub';
  if (/\biceberg\b|\bcloud storage\b|\bgcs\b|\bparquet\b|\bbronze\b|\bdlq\b/.test(t)) return 'cloud_storage';
  if (/\bredis\b|\bmemorystore\b|\bvalkey\b|\bcache\b/.test(t)) return 'redis_memorystore';
  if (/\bpostgres\b|\bcloud sql\b|\bsql\b/.test(t)) return 'postgresql';
  if (/\biap\b|\bidentity-aware\b|\bbeyondcorp\b|\bpasskey\b|\boidc\b/.test(t)) return 'iap';
  if (/\bapigee\b|\bapi gateway\b|\benvoy\b/.test(t)) return 'apigee';
  if (/\bload balanc|\bgclb\b|\balb\b|\bcdn\b|\banycast\b/.test(t)) return 'gcp_load_balancing';
  if (/\binterconnect\b|\bncc\b|\bpeering\b/.test(t)) return 'cloud_interconnect';
  if (/\bbuild\b|\bslsa\b|\bsbom\b|\bargocd\b|\bgitops\b|\bcanary\b/.test(t)) return 'cloud_build';
  if (/\botel\b|\bopentelemetry\b|\btelemetry\b|\btrace\b|\bslo\b|\bmonarch\b|\bprometheus\b|\bgrafana\b|\bdatadog\b|\bjudge\b/.test(t)) return 'telemetry_hub';
  if (/\bgke\b|\bkubernetes\b|\bautopilot\b|\bpod\b/.test(t)) return 'gke_autopilot';
  if (/\bcompute engine\b|\bgce\b|\bvm\b/.test(t)) return 'gcp_compute_engine';
  if (/\bcloud run\b|\bserverless\b/.test(t)) return 'cloud_run';
  if (/\bbuyer\b|\barchitect\b|\buser\b|\bcustomer\b|\bperson\b/.test(t)) return 'person_actor';
  if (/\bstorefront\b|\bnext\.js\b|\bmobile\b|\bweb\b|\bclient\b/.test(t)) return 'client_web';
  if (/\bsap\b|\bsalesforce\b|\bservicenow\b|\bworkday\b|\bexternal\b|\bpci\b|\berp\b|\bcrm\b/.test(t)) return 'external_saas';

  // 4. Fallback inspection on combined subtitle + badge
  if (/redshift/.test(full)) return 'aws_redshift';
  if (/aurora/.test(full)) return 'aws_aurora';
  if (/dynamodb/.test(full)) return 'aws_dynamodb';
  if (/\bs3\b/.test(full)) return 'aws_s3';
  if (/lambda/.test(full)) return 'aws_lambda';
  if (/bedrock/.test(full)) return 'aws_bedrock';
  if (/kinesis/.test(full)) return 'aws_kinesis';
  if (/athena/.test(full)) return 'aws_athena';
  if (/composer|airflow/.test(full)) return 'gcp_composer_airflow';
  if (/azure|openai/.test(full)) return 'azure_openai';
  if (/anthropic|claude/.test(full)) return 'anthropic_claude';
  if (/bigquery|biglake|star schema|sqlx|warehouse/.test(full)) return 'bigquery';
  if (/spanner|paxos|truetime|read shard|cart_locked|stock_reserved|general_ledger/.test(full)) return 'cloud_spanner';
  if (/postgres|sql/.test(full)) return 'postgresql';
  if (/redis|memorystore|valkey|cache/.test(full)) return 'redis_memorystore';
  if (/iap|oidc|passkey|casbin|opa/.test(full)) return 'iap';
  if (/apigee|gateway/.test(full)) return 'apigee';
  if (/dlp|pii|model armor|guardrail/.test(full)) return 'dlp_guardrail';
  if (/vector|hnsw|embedding|bm25/.test(full)) return 'vector_search';
  if (/gemini|vertex|llm/.test(full)) return 'vertex_ai';
  if (/gke|autopilot|pod|validator/.test(full)) return 'gke_autopilot';
  return 'cloud_run';
}

export function getIconSpec(iconKey) {
  return ICON_CATALOG[iconKey] || ICON_CATALOG.cloud_run;
}

export function getIconDataUri(iconKey) {
  const spec = getIconSpec(iconKey);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">${spec.svgInner.replace(/\s+/g, ' ').trim()}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
