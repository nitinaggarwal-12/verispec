// Complete 18-Diagram Product & Project Lifecycle Atlas (D01 - D18)
// Organized across 6 End-to-End Lifecycle Phases (3 Canonical Diagrams per Phase = 18 Total)

function buildBlueprint({ id, code, phaseId, phaseNumber, phaseTitle, phaseBadge, title, subtitle, prompt, zones, nodes, edges }) {
  const formattedZones = zones.map((z, idx) => ({
    id: z.id,
    title: z.title,
    subtitle: z.subtitle,
    orderIndex: idx,
    accent: z.accent
  }));

  const zoneRowTracker = {};
  const formattedNodes = nodes.map((n) => {
    const slot = zoneRowTracker[n.zoneId] || 0;
    zoneRowTracker[n.zoneId] = slot + 1;
    return {
      id: n.id,
      zoneId: n.zoneId,
      title: n.title,
      subtitle: n.subtitle,
      pill: n.pill,
      shape: n.shape || 'service_card',
      iconKey: n.iconKey || 'cloud_run',
      slotOrder: slot,
      addedInVersion: n.addedInVersion || 'v1.0.1',
      changeStatus: n.changeStatus || 'baseline'
    };
  });

  const formattedEdges = edges.map((e, idx) => ({
    id: `e_${code.toLowerCase()}_${idx + 1}`,
    sourceNodeId: e.from,
    targetNodeId: e.to,
    label: e.label,
    stepNumber: idx + 1,
    semanticType: e.type || 'sync_request'
  }));

  return {
    id,
    code,
    phaseId,
    phaseNumber,
    phaseTitle,
    phaseBadge,
    version: 'v1.0.1',
    title,
    subtitle,
    prompt,
    timestamp: '10:20:00 AM',
    zones: formattedZones,
    nodes: formattedNodes,
    edges: formattedEdges,
    diffManifest: {
      summaryBadge: `${code} Baseline (${formattedNodes.length} Nodes · ${formattedEdges.length} Edges)`,
      addedNodeIds: formattedNodes.map((n) => n.id),
      replacedNodes: [],
      removedNodeTitles: [],
      addedEdgeIds: formattedEdges.map((e) => e.id),
      patchOps: [
        { op: 'INIT_BLUEPRINT', target: `${code}: ${title}`, zone: phaseTitle, detail: subtitle }
      ]
    }
  };
}

export const LIFECYCLE_PHASES = [
  {
    id: 'phase_1_discovery',
    number: 1,
    title: 'Phase 1 · Product Discovery, Strategy & UX Flows',
    shortTitle: '1. Product & UX',
    color: '#2563EB',
    bg: '#EFF6FF',
    role: 'Product Managers, UX Designers & Domain Architects',
    codes: ['D01', 'D02', 'D03']
  },
  {
    id: 'phase_2_architecture',
    number: 2,
    title: 'Phase 2 · System & Cloud Architecture Topologies',
    shortTitle: '2. System & Cloud',
    color: '#4F46E5',
    bg: '#EEF2FF',
    role: 'Principal Architects & Cloud Infrastructure Engineers',
    codes: ['D04', 'D05', 'D06']
  },
  {
    id: 'phase_3_runtime',
    number: 3,
    title: 'Phase 3 · Runtime Behavior, APIs & State Transitions',
    shortTitle: '3. APIs & Runtime',
    color: '#0284C7',
    bg: '#F0F9FF',
    role: 'Staff Backend Engineers & API Platform Leads',
    codes: ['D07', 'D08', 'D09']
  },
  {
    id: 'phase_4_data',
    number: 4,
    title: 'Phase 4 · Data Engineering, Storage & Event Streaming',
    shortTitle: '4. Data & Streaming',
    color: '#059669',
    bg: '#ECFDF5',
    role: 'Data Architects, DBAs & Streaming Engineers',
    codes: ['D10', 'D11', 'D12']
  },
  {
    id: 'phase_5_ai',
    number: 5,
    title: 'Phase 5 · AI, Agentic Orchestration & ML Pipelines',
    shortTitle: '5. AI & Agentic',
    color: '#7C3AED',
    bg: '#F5F3FF',
    role: 'AI Engineers, ML Scientists & Agentic Platform Teams',
    codes: ['D13', 'D14', 'D15']
  },
  {
    id: 'phase_6_ops',
    number: 6,
    title: 'Phase 6 · Security, CI/CD Delivery & SRE Operations',
    shortTitle: '6. DevSecOps & SRE',
    color: '#0D9488',
    bg: '#F0FDFA',
    role: 'CISOs, Security Engineers, DevOps & SRE Teams',
    codes: ['D16', 'D17', 'D18']
  }
];

export const LIFECYCLE_BLUEPRINTS_18 = [
  // ============================================================================
  // PHASE 1: PRODUCT DISCOVERY, STRATEGY & UX FLOWS (D01 - D03)
  // ============================================================================
  buildBlueprint({
    id: 'd01-product-value-stream',
    code: 'D01',
    phaseId: 'phase_1_discovery',
    phaseNumber: 1,
    phaseTitle: 'Phase 1 · Product Discovery, Strategy & UX Flows',
    phaseBadge: 'D01 · PRODUCT STRATEGY',
    title: 'Product Journey & North-Star Value Stream Map',
    subtitle: 'End-to-End Funnel from User Acquisition to Activation, Habit Loop & NRR Expansion',
    prompt: 'Generate a 4-stage Product Value Stream & North-Star Metric funnel showing Acquisition channels, Frictionless Onboarding, Core AI Value Loop, and Retention/Expansion telemetry.',
    zones: [
      { id: 'z1', title: 'STAGE 1 · ACQUISITION', subtitle: 'Organic, PLG & Enterprise Entry', accent: 'blue' },
      { id: 'z2', title: 'STAGE 2 · ACTIVATION', subtitle: 'Zero-Friction First Value (<60s)', accent: 'indigo' },
      { id: 'z3', title: 'STAGE 3 · CORE HABIT LOOP', subtitle: 'Daily Collaborative Workflows', accent: 'purple' },
      { id: 'z4', title: 'STAGE 4 · NORTH-STAR KPI', subtitle: 'Retention, Viral Loop & NRR', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Interactive Template SEO', subtitle: 'Public Gallery & Shareable Links', pill: 'CTR: 8.4%', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: 'PLG Workspace Invite', subtitle: '1-Click Team Co-Editing Link', pill: 'K-Factor: 1.35', iconKey: 'iap' },
      { id: 'n3', zoneId: 'z2', title: 'Prompt-to-Diagram Wizard', subtitle: 'Instant v1.0.1 Synthesis in 4s', pill: 'TTFV: 18 sec', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n4', zoneId: 'z2', title: 'Activation Quality Gate', subtitle: 'First Export or 2nd Prompt Turn', pill: 'Conv: 64.2%', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n5', zoneId: 'z3', title: 'Multi-Turn Prompt Co-Pilot', subtitle: 'Iterative v1.0.x AST Refinements', pill: '6.4 Turns/Session', iconKey: 'adk_agent', shape: 'hexagon_agent' },
      { id: 'n6', zoneId: 'z3', title: 'PR & RFC Architecture Sync', subtitle: 'GitHub & Google Slides Export', pill: 'WAU/MAU: 58%', iconKey: 'graphql_bff' },
      { id: 'n7', zoneId: 'z4', title: 'North-Star: Verified Specs', subtitle: 'Weekly Active Collaborating Teams', pill: 'NSM: +14.2% MoM', iconKey: 'telemetry_hub' },
      { id: 'n8', zoneId: 'z4', title: 'Enterprise Seat Expansion', subtitle: 'SSO/SAML & Governance Upgrade', pill: 'NRR: 132%', iconKey: 'cloud_spanner', shape: 'cylinder_db' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'Try Prompt', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'SSO Join', type: 'sync_request' },
      { from: 'n3', to: 'n4', label: 'v1.0.1 Ready', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Iterate Prompt', type: 'ai_rag_grounding' },
      { from: 'n4', to: 'n6', label: 'Activated', type: 'partner_protocol' },
      { from: 'n5', to: 'n7', label: 'Spec Certified', type: 'sync_request' },
      { from: 'n6', to: 'n8', label: 'Team Viral', type: 'async_event' },
      { from: 'n8', to: 'n2', label: 'Org Invite Loop', type: 'closed_loop_telemetry' }
    ]
  }),

  buildBlueprint({
    id: 'd02-user-flow-state-machine',
    code: 'D02',
    phaseId: 'phase_1_discovery',
    phaseNumber: 1,
    phaseTitle: 'Phase 1 · Product Discovery, Strategy & UX Flows',
    phaseBadge: 'D02 · UX INTERACTION FLOW',
    title: 'Multi-Actor User Flow & Conditional UX State Machine',
    subtitle: 'Screen-to-Screen Navigation, Auth Branching, Canvas Scoping & Export Completion',
    prompt: 'Create a 4-tier User Flow & UX State Machine diagram covering Entry & Passkey Auth, Studio Canvas Initialization, Scoped Node Co-Pilot Editing, and Multi-Format Export.',
    zones: [
      { id: 'z1', title: 'SCREEN 1 · ENTRY & AUTH', subtitle: 'Session & Identity Resolution', accent: 'blue' },
      { id: 'z2', title: 'SCREEN 2 · STUDIO INIT', subtitle: 'Blank vs. Blueprint Selection', accent: 'indigo' },
      { id: 'z3', title: 'SCREEN 3 · CANVAS LOOP', subtitle: 'Click-to-Scope & Delta Prompts', accent: 'purple' },
      { id: 'z4', title: 'SCREEN 4 · SHARE & EXPORT', subtitle: 'Deliverable Publishing Flow', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Landing & Prompt Input', subtitle: 'Pre-Auth Natural Language Box', pill: 'Route: /studio', iconKey: 'client_web', shape: 'state_capsule' },
      { id: 'n2', zoneId: 'z1', title: 'Passkey / OAuth 2.1 Gate', subtitle: 'Workspace Session Binding', pill: 'WebAuthn + JWT', iconKey: 'iap', shape: 'decision_diamond' },
      { id: 'n3', zoneId: 'z2', title: 'Starter Blueprint Picker', subtitle: '18 Lifecycle Archetype Cards', pill: 'Modal / Drawer', iconKey: 'apigee' },
      { id: 'n4', zoneId: 'z2', title: 'Initial CAG Synthesis', subtitle: 'Generates v1.0.1 Vector Graph', pill: 'State: READY', iconKey: 'vertex_ai', shape: 'state_capsule' },
      { id: 'n5', zoneId: 'z3', title: 'Click Node to Scope Target', subtitle: 'Pins Target Pill in Prompt Bar', pill: 'Scoped Edit', iconKey: 'gke_autopilot' },
      { id: 'n6', zoneId: 'z3', title: 'Visual Diff Inspection', subtitle: 'Highlights +Added & ~Replaced', pill: 'Diff Overlay ON', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n7', zoneId: 'z4', title: 'Draw.io & SVG Vector Export', subtitle: '1-Click Standards Bundle', pill: '.drawio / .svg', iconKey: 'cloud_run' },
      { id: 'n8', zoneId: 'z4', title: 'Google Slides Deck Sync', subtitle: 'Editable Presentation Bridge', pill: '16:9 Native Deck', iconKey: 'telemetry_hub', shape: 'state_capsule' }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Submit Prompt', type: 'sync_request' },
      { from: 'n1', to: 'n3', label: 'Browse Atlas', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'Auth Verified', type: 'partner_protocol' },
      { from: 'n3', to: 'n4', label: 'Load Seed', type: 'sync_request' },
      { from: 'n4', to: 'n5', label: 'Select Node', type: 'sync_request' },
      { from: 'n5', to: 'n6', label: 'Apply Delta', type: 'ai_rag_grounding' },
      { from: 'n5', to: 'n7', label: 'Export XML', type: 'sync_request' },
      { from: 'n6', to: 'n8', label: 'Publish Deck', type: 'partner_protocol' }
    ]
  }),

  buildBlueprint({
    id: 'd03-ddd-event-storming',
    code: 'D03',
    phaseId: 'phase_1_discovery',
    phaseNumber: 1,
    phaseTitle: 'Phase 1 · Product Discovery, Strategy & UX Flows',
    phaseBadge: 'D03 · DOMAIN-DRIVEN DESIGN',
    title: 'Domain Event Storming & Bounded Context Map (DDD)',
    subtitle: 'User Commands, Domain Aggregates, Immutable Domain Events & Read-Model Projections',
    prompt: 'Build a Domain-Driven Design (DDD) Event Storming & Bounded Context diagram with User Commands, Core Domain Aggregates, Domain Events, and Read Model Projections.',
    zones: [
      { id: 'z1', title: 'COMMANDS & ACTORS', subtitle: 'Intent Triggers & API Commands', accent: 'blue' },
      { id: 'z2', title: 'DOMAIN AGGREGATES', subtitle: 'Transactional Consistency Roots', accent: 'amber' },
      { id: 'z3', title: 'DOMAIN EVENTS (PAST)', subtitle: 'Immutable Fact Stream', accent: 'rose' },
      { id: 'z4', title: 'READ PROJECTIONS & POLICIES', subtitle: 'CQRS Views & Reactive Handlers', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Cmd: SubmitPromptMutation', subtitle: 'Actor: System Architect', pill: 'Command Payload', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: 'Cmd: CertifyBlueprintRelease', subtitle: 'Actor: Principal Reviewer', pill: 'Governance Cmd', iconKey: 'iap' },
      { id: 'n3', zoneId: 'z2', title: 'Agg: ArchitectureGraphRoot', subtitle: 'Enforces Acyclic & Zone Invariants', pill: 'Aggregate Root', iconKey: 'gke_autopilot', shape: 'hexagon_agent' },
      { id: 'n4', zoneId: 'z2', title: 'Agg: VersionLineageLedger', subtitle: 'Manages v1.0.x Snapshot Tree', pill: 'Immutable DAG', iconKey: 'cloud_spanner', shape: 'cylinder_db' },
      { id: 'n5', zoneId: 'z3', title: 'Evt: GraphPatchApplied', subtitle: 'Emitted on AST Delta Commit', pill: 'Domain Event', iconKey: 'kafka_pubsub' },
      { id: 'n6', zoneId: 'z3', title: 'Evt: GeometryGateCertified', subtitle: 'Emitted when 0 AABB Collisions', pill: 'Verified Event', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n7', zoneId: 'z4', title: 'View: InteractiveSvgCanvas', subtitle: 'Real-Time CQRS Vector Projection', pill: 'Sub-15ms View', iconKey: 'cloud_run' },
      { id: 'n8', zoneId: 'z4', title: 'Policy: AutoDraftSnapshotSync', subtitle: 'Persists to Local & Cloud Store', pill: 'Reactive Policy', iconKey: 'telemetry_hub' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'Invoke Mutate', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'Tag Release', type: 'governance_policy' },
      { from: 'n3', to: 'n5', label: 'Emit PatchEvt', type: 'async_event' },
      { from: 'n4', to: 'n6', label: 'Emit GatePass', type: 'async_event' },
      { from: 'n5', to: 'n7', label: 'Project SVG', type: 'sync_request' },
      { from: 'n6', to: 'n8', label: 'Trigger Sync', type: 'partner_protocol' }
    ]
  }),

  // ============================================================================
  // PHASE 2: SYSTEM & CLOUD ARCHITECTURE TOPOLOGIES (D04 - D06)
  // ============================================================================
  buildBlueprint({
    id: 'd04-c4-system-container',
    code: 'D04',
    phaseId: 'phase_2_architecture',
    phaseNumber: 2,
    phaseTitle: 'Phase 2 · System & Cloud Architecture Topologies',
    phaseBadge: 'D04 · C4 CONTAINER TOPOLOGY',
    title: 'C4 System Context & Container Architecture (Level 1 & 2)',
    subtitle: 'Personas, Web/Mobile Containers, Core Compiler Services & External Cloud Integrations',
    prompt: 'Create a C4 Level 2 Container Architecture diagram showing Personas, Web Application & BFF Containers, Core Graph & Layout Microservices, and Cloud Persistence/LLM Systems.',
    zones: [
      { id: 'z1', title: 'PERSONAS & CLIENTS', subtitle: 'External Actors & Entry Channels', accent: 'blue' },
      { id: 'z2', title: 'FRONTEND & BFF TIER', subtitle: 'SPA Studio & Edge API Router', accent: 'indigo' },
      { id: 'z3', title: 'CORE COMPILER CONTAINERS', subtitle: 'Stateful AST & Geometry Engines', accent: 'sky' },
      { id: 'z4', title: 'EXTERNAL CLOUD & AI SYSTEMS', subtitle: 'Managed LLM, Storage & Workspace', accent: 'purple' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Cloud Architect & PM', subtitle: 'Designs & Iterates System Specs', pill: '[Person]', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: 'CI/CD GitOps Bot', subtitle: 'Automated PR Diagram Verifier', pill: '[External Actor]', iconKey: 'iap' },
      { id: 'n3', zoneId: 'z2', title: 'VeriSpec Web Studio SPA', subtitle: 'React 19 + Interactive SVG Viewport', pill: '[Container: TS]', iconKey: 'cloud_run' },
      { id: 'n4', zoneId: 'z2', title: 'API Gateway & Session BFF', subtitle: 'Rate Limiting, Auth & Stream Multiplex', pill: '[Container: Node]', iconKey: 'apigee' },
      { id: 'n5', zoneId: 'z3', title: 'AST Delta Patch Engine', subtitle: 'Compiles Prompts to GraphPatchOp[]', pill: '[Service: Engine]', iconKey: 'adk_agent', shape: 'hexagon_agent' },
      { id: 'n6', zoneId: 'z3', title: '2D AABB Layout & XML Compiler', subtitle: 'Orthogonal Routing & Collision Solver', pill: '[Service: Layout]', iconKey: 'gke_autopilot' },
      { id: 'n7', zoneId: 'z4', title: 'Gemini 3.8 Flash & Pro API', subtitle: 'Structured JSON Schema Synthesis', pill: '[External AI]', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n8', zoneId: 'z4', title: 'Cloud Spanner Blueprint Store', subtitle: 'Versioned CAG & XML Repository', pill: '[Container: DB]', iconKey: 'cloud_spanner', shape: 'cylinder_db' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'HTTPS :443', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'REST Webhook', type: 'governance_policy' },
      { from: 'n3', to: 'n4', label: 'JSON / SSE', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Delta Prompt', type: 'sync_request' },
      { from: 'n4', to: 'n6', label: 'Compile XML', type: 'sync_request' },
      { from: 'n5', to: 'n7', label: 'Schema Prompt', type: 'ai_rag_grounding' },
      { from: 'n6', to: 'n8', label: 'Save v1.0.x', type: 'sync_request' }
    ]
  }),

  buildBlueprint({
    id: 'd05-cloud-native-microservices',
    code: 'D05',
    phaseId: 'phase_2_architecture',
    phaseNumber: 2,
    phaseTitle: 'Phase 2 · System & Cloud Architecture Topologies',
    phaseBadge: 'D05 · CLOUD-NATIVE MESH',
    title: 'Cloud-Native Multi-Tier AI Commerce & Microservices Mesh',
    subtitle: 'Zero-Trust Edge WAF, GKE Autopilot Services, Spanner/Redis Data Tier & Vertex AI',
    prompt: 'Synthesize a 4-tier Cloud-Native Microservices architecture with Cloud Armor WAF, Apigee X, GKE Autopilot services, Memorystore Redis, Cloud Spanner, and Vertex AI.',
    zones: [
      { id: 'z1', title: 'TIER 1 · EDGE & WAF', subtitle: 'Anycast CDN, WAF & API Gateway', accent: 'blue' },
      { id: 'z2', title: 'TIER 2 · SERVICE MESH', subtitle: 'GKE Autopilot & Cloud Run', accent: 'indigo' },
      { id: 'z3', title: 'TIER 3 · DATA & CACHE', subtitle: 'Redis Cluster & Global Spanner', accent: 'sky' },
      { id: 'z4', title: 'TIER 4 · AI & GUARDRAILS', subtitle: 'DLP Gate & Gemini 3.8 RAG', accent: 'purple' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Cloud Armor + Zero-Trust IAP', subtitle: 'OWASP WAF & Identity Proxy', pill: 'TLS 1.3 · mTLS', iconKey: 'cloud_armor' },
      { id: 'n2', zoneId: 'z1', title: 'Apigee X API Gateway', subtitle: 'Traffic Shaping & OAuth 2.1', pill: '50k RPS Edge', iconKey: 'apigee' },
      { id: 'n3', zoneId: 'z2', title: 'Catalog & Search Service', subtitle: 'Real-Time Inventory & Pricing', pill: 'Cloud Run Gen2', iconKey: 'cloud_run' },
      { id: 'n4', zoneId: 'z2', title: 'Checkout & Order Orchestrator', subtitle: 'Distributed Cart & Payment Saga', pill: 'GKE Autopilot', iconKey: 'gke_autopilot' },
      { id: 'n5', zoneId: 'z3', title: 'Memorystore Redis Cluster', subtitle: 'Sub-ms Session & Cart Cache', pill: 'RESP3 :6379', iconKey: 'redis_memorystore', changeStatus: 'added', addedInVersion: 'v1.0.2' },
      { id: 'n6', zoneId: 'z3', title: 'Cloud Spanner Global HA', subtitle: 'Multi-Region TrueTime Ledger', pill: '99.999% SLA', iconKey: 'cloud_spanner', shape: 'cylinder_db', changeStatus: 'replaced' },
      { id: 'n7', zoneId: 'z4', title: 'Gemini 3.8 Commerce Agent', subtitle: 'Personalized Ranking & Bundling', pill: 'Vertex AI Global', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n8', zoneId: 'z4', title: 'DLP & Fraud Policy Gate', subtitle: 'PII Filter & Risk Decision Gate', pill: '[GO] / [BLOCK]', iconKey: 'dlp_guardrail', shape: 'decision_diamond', changeStatus: 'added', addedInVersion: 'v1.0.3' }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'mTLS Pass', type: 'governance_policy' },
      { from: 'n1', to: 'n3', label: 'CDN Route', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'gRPC /order', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Cache Hit', type: 'sync_request' },
      { from: 'n4', to: 'n6', label: 'TrueTime TX', type: 'sync_request' },
      { from: 'n5', to: 'n7', label: 'Context Vec', type: 'ai_rag_grounding' },
      { from: 'n6', to: 'n8', label: 'Audit Stream', type: 'governance_policy' },
      { from: 'n8', to: 'n7', label: 'PII-Clean', type: 'ai_rag_grounding' }
    ]
  }),

  buildBlueprint({
    id: 'd06-hub-and-spoke-network',
    code: 'D06',
    phaseId: 'phase_2_architecture',
    phaseNumber: 2,
    phaseTitle: 'Phase 2 · System & Cloud Architecture Topologies',
    phaseBadge: 'D06 · HUB-AND-SPOKE #78',
    title: 'Enterprise Hub-and-Spoke Multi-VPC Network (#78 Archetype)',
    subtitle: 'Hybrid Interconnect, Central Network Routing Hub, Security Hub & Workload Spokes',
    prompt: 'Create an Official Architecture Center #78 Hub-and-Spoke Multi-VPC topology with Hybrid Partner Ingress, Central Routing Hub, Central Governance Hub, and Isolated Workload Spokes.',
    zones: [
      { id: 'z1', title: 'HYBRID & EDGE INGRESS', subtitle: 'Cloud Interconnect & Global ALB', accent: 'blue' },
      { id: 'z2', title: 'CENTRAL ROUTING HUB VPC', subtitle: 'NCC, Cloud Router & NAT Transit', accent: 'indigo' },
      { id: 'z3', title: 'WORKLOAD SPOKE ENCLAVES', subtitle: 'Prod GKE & Data Isolation Spokes', accent: 'amber' },
      { id: 'z4', title: 'GOVERNANCE & PSC HUB', subtitle: 'VPC-SC, KMS & Private Service Connect', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Dedicated Interconnect', subtitle: '100Gbps MACsec On-Prem Link', pill: 'BGP ASN 64512', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: 'Global Cloud Load Balancer', subtitle: 'Anycast VIP & Cloud Armor Edge', pill: 'TLS 1.3 Ingress', iconKey: 'cloud_armor' },
      { id: 'n3', zoneId: 'z2', title: 'Network Connectivity Center', subtitle: 'Central Hub-and-Spoke Transit Router', pill: 'NCC Star Mesh', iconKey: 'apigee' },
      { id: 'n4', zoneId: 'z2', title: 'Next-Gen Firewall & Cloud NAT', subtitle: 'Deep Packet Inspection & Egress', pill: 'L7 IPS Enclave', iconKey: 'iap' },
      { id: 'n5', zoneId: 'z3', title: 'Spoke A: Prod Compute VPC', subtitle: 'Private GKE Autopilot Clusters', pill: '10.10.0.0/16', iconKey: 'gke_autopilot' },
      { id: 'n6', zoneId: 'z3', title: 'Spoke B: Data & Analytics VPC', subtitle: 'Spanner, BigQuery & Vertex Enclave', pill: '10.20.0.0/16', iconKey: 'cloud_spanner', shape: 'cylinder_db' },
      { id: 'n7', zoneId: 'z4', title: 'Private Service Connect (PSC)', subtitle: 'Zero-Public-IP Managed Endpoints', pill: 'PSC Producer', iconKey: 'graphql_bff' },
      { id: 'n8', zoneId: 'z4', title: 'VPC Service Controls Perimeter', subtitle: 'Anti-Exfiltration Security Bridge', pill: 'VPC-SC Locked', iconKey: 'dlp_guardrail', shape: 'decision_diamond' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'VLAN Attach', type: 'partner_protocol' },
      { from: 'n2', to: 'n4', label: 'Inspect VIP', type: 'sync_request' },
      { from: 'n3', to: 'n4', label: 'Route Table', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Spoke A Peer', type: 'sync_request' },
      { from: 'n4', to: 'n6', label: 'Spoke B Peer', type: 'sync_request' },
      { from: 'n5', to: 'n7', label: 'PSC Endpoint', type: 'partner_protocol' },
      { from: 'n6', to: 'n8', label: 'VPC-SC Check', type: 'governance_policy' }
    ]
  }),

  // ============================================================================
  // PHASE 3: RUNTIME BEHAVIOR, APIS & STATE TRANSITIONS (D07 - D09)
  // ============================================================================
  buildBlueprint({
    id: 'd07-api-sequence-enclaves',
    code: 'D07',
    phaseId: 'phase_3_runtime',
    phaseNumber: 3,
    phaseTitle: 'Phase 3 · Runtime Behavior, APIs & State Transitions',
    phaseBadge: 'D07 · SEQUENCE & ENCLAVES',
    title: 'Synchronous & Async API Sequence Flow (ALT / OPT / LOOP)',
    subtitle: 'Time-Ordered Lifeline Interactions, JWT Validation, Payment Lock & Async Fulfillment',
    prompt: 'Generate a 4-lifeline API Sequence & Interaction Enclave diagram showing Client Request, Gateway JWT Validation, Order Saga Orchestration, and Async Payment/Fulfillment.',
    zones: [
      { id: 'z1', title: 'LIFELINE 1 · CLIENT APP', subtitle: 'Initiator & Idempotency Key', accent: 'blue' },
      { id: 'z2', title: 'LIFELINE 2 · EDGE GATEWAY', subtitle: 'OPT: Token Cache & Rate Gate', accent: 'indigo' },
      { id: 'z3', title: 'LIFELINE 3 · ORDER SAGA', subtitle: 'ALT: Inventory Lock vs. Backorder', accent: 'sky' },
      { id: 'z4', title: 'LIFELINE 4 · PAYMENT & LEDGER', subtitle: 'LOOP: Retry & Settlement Commit', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: '1. POST /v2/orders/checkout', subtitle: 'Sends Idempotency-Key + Cart JWT', pill: 't = 0ms', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: '6. Render 201 OrderConfirmed', subtitle: 'Receives Signed Receipt & ETA', pill: 't = 84ms', iconKey: 'telemetry_hub', shape: 'state_capsule' },
      { id: 'n3', zoneId: 'z2', title: '2. [OPT] Verify JWT & Quota', subtitle: 'Redis JWK Lookup + Sliding Window', pill: 't = 6ms', iconKey: 'iap', shape: 'decision_diamond' },
      { id: 'n4', zoneId: 'z2', title: '5. Emit Response + TraceHeader', subtitle: 'Injects W3C traceparent ID', pill: 't = 78ms', iconKey: 'apigee' },
      { id: 'n5', zoneId: 'z3', title: '3. [ALT] Reserve SKU Inventory', subtitle: 'Optimistic Row Lock on Warehouse', pill: 't = 22ms', iconKey: 'gke_autopilot' },
      { id: 'n6', zoneId: 'z3', title: '4b. Publish OrderCreated Event', subtitle: 'Outbox Pattern CDC Dispatch', pill: 't = 65ms', iconKey: 'kafka_pubsub' },
      { id: 'n7', zoneId: 'z4', title: '4a. [LOOP] Authorize Payment', subtitle: 'PCI Token Charge with Backoff', pill: 't = 48ms', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n8', zoneId: 'z4', title: 'Append Immutable Ledger Row', subtitle: 'Cloud Spanner TrueTime Commit', pill: 't = 61ms', iconKey: 'cloud_spanner', shape: 'cylinder_db' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: '1. HTTPS POST', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: '2. gRPC Call', type: 'sync_request' },
      { from: 'n5', to: 'n7', label: '3. Auth Card', type: 'sync_request' },
      { from: 'n7', to: 'n8', label: '4. Write TX', type: 'sync_request' },
      { from: 'n5', to: 'n6', label: 'Outbox CDC', type: 'async_event' },
      { from: 'n6', to: 'n8', label: 'Ledger Sync', type: 'async_event' },
      { from: 'n4', to: 'n2', label: '6. 201 JSON', type: 'partner_protocol' }
    ]
  }),

  buildBlueprint({
    id: 'd08-distributed-saga-fsm',
    code: 'D08',
    phaseId: 'phase_3_runtime',
    phaseNumber: 3,
    phaseTitle: 'Phase 3 · Runtime Behavior, APIs & State Transitions',
    phaseBadge: 'D08 · DISTRIBUTED SAGA FSM',
    title: 'Distributed Saga & Finite State Machine Lifecycle (FSM)',
    subtitle: 'Deterministic Forward State Transitions, Timeout Guards & Compensating Rollbacks',
    prompt: 'Create a Distributed Saga & Finite State Machine (FSM) diagram showing Order Creation, Inventory/Payment Reservation, Settlement Commit, and Compensating Rollback states.',
    zones: [
      { id: 'z1', title: 'INGRESS STATES', subtitle: 'Draft & Idempotent Validation', accent: 'blue' },
      { id: 'z2', title: 'RESERVATION STATES', subtitle: '2-Phase Lock & Risk Verification', accent: 'indigo' },
      { id: 'z3', title: 'COMPENSATION & ROLLBACK', subtitle: 'Failure Recovery & Refund Sagas', accent: 'rose' },
      { id: 'z4', title: 'TERMINAL SETTLED STATES', subtitle: 'Committed & Fulfilled Finality', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'State: Cart Locked', subtitle: 'Idempotency Key Claimed (TTL 15m)', pill: 'CART_LOCKED', iconKey: 'redis_memorystore', shape: 'state_capsule' },
      { id: 'n2', zoneId: 'z1', title: 'State: Order Pending', subtitle: 'Schema & Fraud Pre-Check Passed', pill: 'ORDER_PENDING', iconKey: 'apigee', shape: 'state_capsule' },
      { id: 'n3', zoneId: 'z2', title: 'State: Stock Reserved', subtitle: 'Inventory Decremented in Spanner', pill: 'STOCK_RESERVED', iconKey: 'cloud_spanner', shape: 'state_capsule' },
      { id: 'n4', zoneId: 'z2', title: 'Gate: Payment Auth Check', subtitle: '3DS2 & Acquirer Capture Decision', pill: '[CAPTURED]/[FAIL]', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n5', zoneId: 'z3', title: 'State: Compensating Void', subtitle: 'Releases Reserved Inventory Hold', pill: 'COMPENSATE_VOID', iconKey: 'kafka_pubsub', shape: 'state_capsule' },
      { id: 'n6', zoneId: 'z3', title: 'State: Order Aborted', subtitle: 'Customer Notified + Retry Token', pill: 'ORDER_ABORTED', iconKey: 'cloud_armor', shape: 'state_capsule' },
      { id: 'n7', zoneId: 'z4', title: 'State: Payment Settled', subtitle: 'Immutable Double-Entry Recorded', pill: 'PAYMENT_SETTLED', iconKey: 'postgresql', shape: 'state_capsule' },
      { id: 'n8', zoneId: 'z4', title: 'State: Dispatch Fulfilled', subtitle: 'Warehouse Manifest & Tracking Live', pill: 'FULFILLED', iconKey: 'telemetry_hub', shape: 'state_capsule' }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Validate()', type: 'sync_request' },
      { from: 'n1', to: 'n3', label: 'LockStock()', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'ChargeCard()', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Timeout / 402', type: 'async_event' },
      { from: 'n4', to: 'n6', label: '[NO-GO] Abort', type: 'governance_policy' },
      { from: 'n5', to: 'n6', label: 'Stock Freed', type: 'async_event' },
      { from: 'n5', to: 'n7', label: 'Retry Pass', type: 'partner_protocol' },
      { from: 'n6', to: 'n8', label: 'Audit Closed', type: 'governance_policy' },
      { from: 'n7', to: 'n8', label: 'ShipOrder()', type: 'partner_protocol' }
    ]
  }),

  buildBlueprint({
    id: 'd09-graphql-federation-bff',
    code: 'D09',
    phaseId: 'phase_3_runtime',
    phaseNumber: 3,
    phaseTitle: 'Phase 3 · Runtime Behavior, APIs & State Transitions',
    phaseBadge: 'D09 · API FEDERATION & BFF',
    title: 'API Gateway, Apollo GraphQL Federation & gRPC Contract Map',
    subtitle: 'Multi-Client Experience BFFs, Supergraph Query Planner & Domain Subgraphs',
    prompt: 'Build an API Gateway & GraphQL Federation BFF topology connecting Web/Mobile/Partner clients through Edge Rate Limiting to a Federated Supergraph Router and gRPC Subgraphs.',
    zones: [
      { id: 'z1', title: 'CONSUMER CHANNELS', subtitle: 'Web, iOS/Android & B2B Partner API', accent: 'blue' },
      { id: 'z2', title: 'EDGE GATEWAY & BFF', subtitle: 'OAuth 2.1, Persisted Queries & Cache', accent: 'indigo' },
      { id: 'z3', title: 'SUPERGRAPH ROUTER', subtitle: 'Query Plan AST & Subgraph Join', accent: 'purple' },
      { id: 'z4', title: 'DOMAIN gRPC SUBGRAPHS', subtitle: 'Protobuf Contracts & Data Loaders', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Web & Mobile Apps', subtitle: 'Persisted GraphQL Operations', pill: 'HTTP/3 QUIC', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: 'External B2B Partner SDK', subtitle: 'Signed Webhook & REST Clients', pill: 'mTLS + API Key', iconKey: 'iap' },
      { id: 'n3', zoneId: 'z2', title: 'Apigee Edge Gateway', subtitle: 'Token Exchange & Spike Arrest', pill: '100k RPS Quota', iconKey: 'apigee' },
      { id: 'n4', zoneId: 'z2', title: 'Edge Response Cache', subtitle: 'Entity-Level TTL & Invalidation', pill: 'Hit Ratio: 91%', iconKey: 'redis_memorystore' },
      { id: 'n5', zoneId: 'z3', title: 'Apollo Federation Router', subtitle: 'Compiles Query Plan DAG in Rust', pill: 'Supergraph v2', iconKey: 'graphql_bff' },
      { id: 'n6', zoneId: 'z3', title: 'Schema Registry & Contract Gate', subtitle: 'Blocks Breaking Field Removals', pill: 'CI Check PASS', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n7', zoneId: 'z4', title: 'Users & Identity Subgraph', subtitle: 'Resolves @key(fields: "userId")', pill: 'gRPC :50051', iconKey: 'gke_autopilot' },
      { id: 'n8', zoneId: 'z4', title: 'Orders & Catalog Subgraph', subtitle: 'Batched DataLoader N+1 Eliminator', pill: 'gRPC :50052', iconKey: 'cloud_run' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'GraphQL POST', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'REST /v2', type: 'partner_protocol' },
      { from: 'n3', to: 'n4', label: 'Cache Lookup', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Validated Op', type: 'sync_request' },
      { from: 'n4', to: 'n6', label: 'Schema Hash', type: 'governance_policy' },
      { from: 'n5', to: 'n7', label: 'Subgraph #1', type: 'sync_request' },
      { from: 'n6', to: 'n8', label: 'Subgraph #2', type: 'sync_request' }
    ]
  }),

  // ============================================================================
  // PHASE 4: DATA ENGINEERING, STORAGE & EVENT STREAMING (D10 - D12)
  // ============================================================================
  buildBlueprint({
    id: 'd10-erd-polyglot-schema',
    code: 'D10',
    phaseId: 'phase_4_data',
    phaseNumber: 4,
    phaseTitle: 'Phase 4 · Data Engineering, Storage & Event Streaming',
    phaseBadge: 'D10 · POLYGLOT ERD SCHEMA',
    title: 'Entity-Relationship (ERD) & Polyglot Persistence Schema Map',
    subtitle: 'Primary/Foreign Key Lineage Across Identity, Transactional Ledger, Catalog & Vector Tables',
    prompt: 'Create an Entity-Relationship (ERD) & Polyglot Schema diagram showing Identity & Tenant tables, Interleaved Order/LineItem tables, Product Inventory, and Vector Embedding schemas.',
    zones: [
      { id: 'z1', title: 'IDENTITY & TENANT SCHEMA', subtitle: 'IAM & Multi-Tenant Root Keys', accent: 'blue' },
      { id: 'z2', title: 'TRANSACTIONAL LEDGER', subtitle: 'Spanner Interleaved Parent-Child', accent: 'indigo' },
      { id: 'z3', title: 'CATALOG & INVENTORY', subtitle: 'Document & High-Speed SKU State', accent: 'emerald' },
      { id: 'z4', title: 'ANALYTICAL & VECTOR STORE', subtitle: 'Embeddings & Star-Schema Facts', accent: 'purple' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'tbl_organizations (PK: org_id)', subtitle: 'tenant_tier, kms_key_arn, region', pill: 'PK: UUIDv7', iconKey: 'iap', shape: 'er_table' },
      { id: 'n2', zoneId: 'z1', title: 'tbl_users (PK: user_id)', subtitle: 'FK: org_id, email_hash, role_mask', pill: 'Idx: org_email', iconKey: 'client_web', shape: 'er_table' },
      { id: 'n3', zoneId: 'z2', title: 'tbl_orders (PK: order_id)', subtitle: 'FK: user_id, status_enum, total_cents', pill: 'Interleaved Root', iconKey: 'cloud_spanner', shape: 'er_table' },
      { id: 'n4', zoneId: 'z2', title: 'tbl_order_items (PK: order_id, item_id)', subtitle: 'FK: sku_id, qty, unit_price_cents', pill: 'Co-Located Child', iconKey: 'postgresql', shape: 'er_table' },
      { id: 'n5', zoneId: 'z3', title: 'tbl_products (PK: sku_id)', subtitle: 'title, category_path, attributes_jsonb', pill: 'GIN JSONB Idx', iconKey: 'cloud_run', shape: 'er_table' },
      { id: 'n6', zoneId: 'z3', title: 'kv_inventory_locks (Key: sku_id)', subtitle: 'available_qty, reserved_holds_map', pill: 'Redis Hash TTL', iconKey: 'redis_memorystore', shape: 'er_table' },
      { id: 'n7', zoneId: 'z4', title: 'vec_product_embeddings (768d)', subtitle: 'FK: sku_id, embedding_hnsw, model_ver', pill: 'ScaNN Cosine', iconKey: 'vector_search', shape: 'er_table' },
      { id: 'n8', zoneId: 'z4', title: 'fact_revenue_daily (Partition: dt)', subtitle: 'org_id, gmv_usd, net_margin_bps', pill: 'BigQuery Columnar', iconKey: 'telemetry_hub', shape: 'er_table' }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: '1 : N HasUsers', type: 'sync_request' },
      { from: 'n1', to: 'n3', label: '1 : N TenantOrders', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: '1 : N Places', type: 'sync_request' },
      { from: 'n3', to: 'n4', label: 'INTERLEAVE IN', type: 'partner_protocol' },
      { from: 'n3', to: 'n5', label: 'N : 1 Refs SKU', type: 'sync_request' },
      { from: 'n4', to: 'n6', label: '1 : 1 LockHold', type: 'async_event' },
      { from: 'n5', to: 'n7', label: '1 : 1 VecSync', type: 'ai_rag_grounding' },
      { from: 'n6', to: 'n8', label: 'CDC Rollup', type: 'async_event' }
    ]
  }),

  buildBlueprint({
    id: 'd11-cdc-medallion-lakehouse',
    code: 'D11',
    phaseId: 'phase_4_data',
    phaseNumber: 4,
    phaseTitle: 'Phase 4 · Data Engineering, Storage & Event Streaming',
    phaseBadge: 'D11 · MEDALLION LAKEHOUSE',
    title: 'Real-Time CDC Event Streaming & Medallion Lakehouse',
    subtitle: 'Sub-Second Change Data Capture into Bronze Raw, Silver Cleaned Iceberg & Gold BigQuery',
    prompt: 'Synthesize a Real-Time CDC & Medallion Data Lakehouse pipeline from OLTP Databases through Datastream/PubSub into Bronze Raw, Silver Apache Iceberg, and Gold BigQuery serving.',
    zones: [
      { id: 'z1', title: 'OLTP & CDC INGESTION', subtitle: 'Log-Based Change Data Capture', accent: 'blue' },
      { id: 'z2', title: 'BRONZE · STREAM & RAW', subtitle: 'Pub/Sub Bus & Immutable Landing', accent: 'amber' },
      { id: 'z3', title: 'SILVER · CLEANED ICEBERG', subtitle: 'Dataflow Dedup, DLP & Schema Enforce', accent: 'sky' },
      { id: 'z4', title: 'GOLD · SERVING & ML', subtitle: 'BigQuery BI Marts & Feature Store', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Cloud Spanner Change Streams', subtitle: 'Captures Insert/Update/Delete Mods', pill: 'Watermark < 1s', iconKey: 'cloud_spanner', shape: 'cylinder_db' },
      { id: 'n2', zoneId: 'z1', title: 'Datastream CDC Connector', subtitle: 'Zero-Impact WAL Log Reader', pill: 'Exactly-Once', iconKey: 'apigee' },
      { id: 'n3', zoneId: 'z2', title: 'Cloud Pub/Sub Partitioned Bus', subtitle: 'Ordered By Primary Key Hash', pill: '1.2M msg/sec', iconKey: 'kafka_pubsub' },
      { id: 'n4', zoneId: 'z2', title: 'Bronze GCS Raw Parquet Vault', subtitle: 'Append-Only Partitioned Audit Log', pill: 'Retention: 7yr', iconKey: 'postgresql', shape: 'cylinder_db' },
      { id: 'n5', zoneId: 'z3', title: 'Apache Beam / Dataflow Engine', subtitle: 'Windowed Upsert & Late-Arrival Join', pill: 'Autoscale Workers', iconKey: 'gke_autopilot' },
      { id: 'n6', zoneId: 'z3', title: 'Silver BigLake Iceberg Tables', subtitle: 'PII Tokenized & Schema Evolution', pill: 'ACID Snapshots', iconKey: 'dlp_guardrail', shape: 'cylinder_db' },
      { id: 'n7', zoneId: 'z4', title: 'Gold BigQuery Executive Marts', subtitle: 'BI Engine Sub-Second Aggregations', pill: 'Slot Autoscaler', iconKey: 'telemetry_hub', shape: 'cylinder_db' },
      { id: 'n8', zoneId: 'z4', title: 'Vertex AI Online Feature Store', subtitle: 'Low-Latency Real-Time ML Features', pill: 'p99 < 8ms', iconKey: 'vertex_ai', shape: 'hexagon_agent' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'CDC Tokens', type: 'async_event' },
      { from: 'n2', to: 'n4', label: 'Avro Batch', type: 'async_event' },
      { from: 'n3', to: 'n4', label: 'Archive Raw', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Stream Read', type: 'async_event' },
      { from: 'n4', to: 'n6', label: 'Backfill Sync', type: 'sync_request' },
      { from: 'n5', to: 'n6', label: 'Merge Upsert', type: 'partner_protocol' },
      { from: 'n5', to: 'n7', label: 'Gold Rollup', type: 'sync_request' },
      { from: 'n6', to: 'n8', label: 'Feature Sync', type: 'ai_rag_grounding' }
    ]
  }),

  buildBlueprint({
    id: 'd12-caching-sharding-topology',
    code: 'D12',
    phaseId: 'phase_4_data',
    phaseNumber: 4,
    phaseTitle: 'Phase 4 · Data Engineering, Storage & Event Streaming',
    phaseBadge: 'D12 · CACHE & SHARDING',
    title: 'Multi-Tier Caching, Read-Replica & Sharding Topology',
    subtitle: 'L1 Edge CDN, L2 Distributed Redis Cluster, Consistent Hashing & Geo-Partitioned Shards',
    prompt: 'Create a Multi-Tier Caching & Database Sharding architecture with L1 Cloud CDN, L2 Memorystore Redis Cluster, Consistent Hash Proxy, Read Replicas, and Geo-Sharded Write Masters.',
    zones: [
      { id: 'z1', title: 'L1 EDGE & APP CACHE', subtitle: 'Anycast PoP & In-Process Memory', accent: 'blue' },
      { id: 'z2', title: 'L2 DISTRIBUTED REDIS', subtitle: 'Read-Through & Write-Behind Cluster', accent: 'indigo' },
      { id: 'z3', title: 'SHARD ROUTER & REPLICAS', subtitle: 'Consistent Hash Ring & Read Pools', accent: 'sky' },
      { id: 'z4', title: 'GEO-SHARDED WRITE MASTERS', subtitle: 'US, EU & APAC Primary Partitions', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Cloud CDN Anycast Edge', subtitle: 'Caches Static & Signed Public JSON', pill: 'Offload: 78%', iconKey: 'cloud_armor' },
      { id: 'n2', zoneId: 'z1', title: 'GKE L1 Local Caffeine Cache', subtitle: 'Hot Config & Reference Metadata', pill: 'TTL: 5 sec', iconKey: 'gke_autopilot' },
      { id: 'n3', zoneId: 'z2', title: 'Redis Cluster Shard Group', subtitle: '16,384 Hash Slots Across 12 Nodes', pill: 'p99: 0.4ms', iconKey: 'redis_memorystore' },
      { id: 'n4', zoneId: 'z2', title: 'Stampede Singleflight Guard', subtitle: 'Coalesces Concurrent Cache Misses', pill: 'Mutex Lock', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n5', zoneId: 'z3', title: 'PgBouncer & Shard Proxy', subtitle: 'Routes by tenant_id Consistent Hash', pill: 'MurmurHash3', iconKey: 'apigee' },
      { id: 'n6', zoneId: 'z3', title: 'Regional Read-Replica Pool', subtitle: 'Serves 90% of Analytical/List Queries', pill: 'Lag < 12ms', iconKey: 'postgresql', shape: 'cylinder_db' },
      { id: 'n7', zoneId: 'z4', title: 'Shard 01: US-East Write Master', subtitle: 'Handles North America Mutations', pill: 'NVMe RAID10', iconKey: 'cloud_spanner', shape: 'cylinder_db' },
      { id: 'n8', zoneId: 'z4', title: 'Shard 02: EU-West Write Master', subtitle: 'GDPR Sovereign Data Partition', pill: 'Frankfurt Zone', iconKey: 'cloud_spanner', shape: 'cylinder_db' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'L1 Miss', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'Coalesce Key', type: 'sync_request' },
      { from: 'n3', to: 'n4', label: 'Slot Miss', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Write-Through', type: 'sync_request' },
      { from: 'n4', to: 'n6', label: 'Hydrate Read', type: 'partner_protocol' },
      { from: 'n5', to: 'n7', label: 'Hash [0..8k]', type: 'sync_request' },
      { from: 'n6', to: 'n8', label: 'WAL Stream', type: 'async_event' }
    ]
  }),

  // ============================================================================
  // PHASE 5: AI, AGENTIC ORCHESTRATION & ML PIPELINES (D13 - D15)
  // ============================================================================
  buildBlueprint({
    id: 'd13-hybrid-graphrag-pipeline',
    code: 'D13',
    phaseId: 'phase_5_ai',
    phaseNumber: 5,
    phaseTitle: 'Phase 5 · AI, Agentic Orchestration & ML Pipelines',
    phaseBadge: 'D13 · HYBRID GRAPHRAG',
    title: 'Enterprise Hybrid GraphRAG & Vector Grounding Pipeline',
    subtitle: 'Multimodal Parsing, Semantic Chunking, Vector + Spanner Graph Retrieval & Citation Verifier',
    prompt: 'Design an Enterprise Hybrid GraphRAG architecture with Document AI Ingestion, Semantic Chunking & Embeddings, ScaNN Vector + Spanner Property Graph Retrieval, and Grounded Gemini Generation.',
    zones: [
      { id: 'z1', title: 'MULTIMODAL INGESTION', subtitle: 'Docs, Architecture XML & ACL Sync', accent: 'blue' },
      { id: 'z2', title: 'EMBEDDING & GRAPH INDEX', subtitle: 'Gemini Embeddings & Entity Triples', accent: 'indigo' },
      { id: 'z3', title: 'HYBRID RETRIEVAL & RERANK', subtitle: 'Dense ScaNN + BM25 + 2-Hop Graph', accent: 'purple' },
      { id: 'z4', title: 'GROUNDED SYNTHESIS GATE', subtitle: 'Citation Locking & Hallucination Guard', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Document AI Layout Parser', subtitle: 'Extracts Tables, Headings & Diagrams', pill: 'OCR + Hierarchy', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: 'IAM ACL Permission Enricher', subtitle: 'Stamps Document Security Principals', pill: 'Zero-Leak ACL', iconKey: 'iap' },
      { id: 'n3', zoneId: 'z2', title: 'Gemini Embedding-2 Encoder', subtitle: '768-Dim Matryoshka Semantic Vectors', pill: 'Batch & Stream', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n4', zoneId: 'z2', title: 'Spanner Graph + Vector Index', subtitle: 'Stores (Node)-[EDGE]->(Node) + ANN', pill: 'GQL + Cosine', iconKey: 'vector_search', shape: 'cylinder_db' },
      { id: 'n5', zoneId: 'z3', title: 'Reciprocal Rank Fusion (RRF)', subtitle: 'Merges Dense ANN + Sparse + Graph', pill: 'Top-50 Candidates', iconKey: 'graphql_bff' },
      { id: 'n6', zoneId: 'z3', title: 'Cross-Encoder Reranker Model', subtitle: 'Scores Exact Query-Passage Relevance', pill: 'Top-8 Context', iconKey: 'adk_agent', shape: 'hexagon_agent' },
      { id: 'n7', zoneId: 'z4', title: 'Gemini 3.8 Pro Synthesizer', subtitle: 'Generates Answer with Inline [Doc:Line]', pill: 'Temp: 0.1 Grounded', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n8', zoneId: 'z4', title: 'NLI Entailment Citation Gate', subtitle: 'Verifies Every Claim vs. Retrieved Span', pill: '[VERIFIED] Only', iconKey: 'dlp_guardrail', shape: 'decision_diamond' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'Semantic Chunks', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'ACL Metadata', type: 'governance_policy' },
      { from: 'n3', to: 'n4', label: 'Upsert 768d', type: 'ai_rag_grounding' },
      { from: 'n3', to: 'n5', label: 'Query Vector', type: 'ai_rag_grounding' },
      { from: 'n4', to: 'n6', label: '2-Hop Subgraph', type: 'ai_rag_grounding' },
      { from: 'n5', to: 'n6', label: 'Fused Top-50', type: 'sync_request' },
      { from: 'n5', to: 'n7', label: 'Ranked Context', type: 'ai_rag_grounding' },
      { from: 'n6', to: 'n8', label: 'Source Spans', type: 'governance_policy' },
      { from: 'n7', to: 'n8', label: 'Check Claims', type: 'governance_policy' }
    ]
  }),

  buildBlueprint({
    id: 'd14-multi-agent-a2a-mcp',
    code: 'D14',
    phaseId: 'phase_5_ai',
    phaseNumber: 5,
    phaseTitle: 'Phase 5 · AI, Agentic Orchestration & ML Pipelines',
    phaseBadge: 'D14 · MULTI-AGENT A2A & MCP',
    title: 'Multi-Agent A2A / MCP Orchestration & Safety Guardrail Mesh',
    subtitle: 'Supervisor ADK Planner, Specialist A2A Agents, Enterprise MCP Tool Gateway & Policy Gate',
    prompt: 'Create a Multi-Agent A2A & MCP Orchestration architecture featuring an Ingress Policy Filter, Supervisor ADK Agent, Specialist A2A Subagents, Enterprise MCP Tool Gateway, and Safety Commit Gate.',
    zones: [
      { id: 'z1', title: 'INGRESS & INTENT ROUTER', subtitle: 'Prompt Sanitization & Session State', accent: 'blue' },
      { id: 'z2', title: 'SUPERVISOR ADK HARNESS', subtitle: 'Task Decomposition & Memory DAG', accent: 'purple' },
      { id: 'z3', title: 'SPECIALIST A2A SWARM', subtitle: 'Parallel Domain Subagents', accent: 'indigo' },
      { id: 'z4', title: 'MCP GATEWAY & SAFETY GATE', subtitle: 'RBAC Tool Execution & HITL Approval', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Model Armor Prompt Shield', subtitle: 'Blocks Prompt Injection & Jailbreaks', pill: 'Pre-Inference Guard', iconKey: 'cloud_armor' },
      { id: 'n2', zoneId: 'z1', title: 'Episodic & Working Memory', subtitle: 'Session Context & KV Cache Prefix', pill: 'Redis + Spanner', iconKey: 'redis_memorystore', shape: 'cylinder_db' },
      { id: 'n3', zoneId: 'z2', title: 'Supervisor Planner Agent (ADK)', subtitle: 'Decomposes Goal into A2A Sub-Tasks', pill: 'Gemini 3.8 Pro', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n4', zoneId: 'z2', title: 'Bounded Critic & Reflection Loop', subtitle: 'Verifies Subagent Output Completeness', pill: 'Max 2 Retries', iconKey: 'adk_agent', shape: 'hexagon_agent' },
      { id: 'n5', zoneId: 'z3', title: 'Topology Synthesizer Subagent', subtitle: 'Emits Typed GraphPatchOp[] AST', pill: 'A2A JSON-RPC', iconKey: 'adk_agent', shape: 'hexagon_agent' },
      { id: 'n6', zoneId: 'z3', title: 'Security & Compliance Subagent', subtitle: 'Audits IAM, VPC-SC & Encryption', pill: 'A2A JSON-RPC', iconKey: 'iap', shape: 'hexagon_agent' },
      { id: 'n7', zoneId: 'z4', title: 'Enterprise MCP Tool Gateway', subtitle: 'Short-Lived OAuth Scoped Tool Calls', pill: 'MCP v1.1 Server', iconKey: 'apigee' },
      { id: 'n8', zoneId: 'z4', title: 'Deterministic Commit Gate', subtitle: 'Enforces Policy before State Mutation', pill: '[COMMIT] / [ABORT]', iconKey: 'dlp_guardrail', shape: 'decision_diamond' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'Safe Prompt', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'Load Memory', type: 'ai_rag_grounding' },
      { from: 'n3', to: 'n4', label: 'Plan DAG', type: 'ai_rag_grounding' },
      { from: 'n3', to: 'n5', label: 'A2A Delegate', type: 'ai_rag_grounding' },
      { from: 'n4', to: 'n6', label: 'A2A Audit', type: 'governance_policy' },
      { from: 'n5', to: 'n7', label: 'MCP ToolCall', type: 'partner_protocol' },
      { from: 'n6', to: 'n8', label: 'Policy Verdict', type: 'governance_policy' },
      { from: 'n7', to: 'n8', label: 'Verify Scope', type: 'governance_policy' }
    ]
  }),

  buildBlueprint({
    id: 'd15-closed-loop-mlops-eval',
    code: 'D15',
    phaseId: 'phase_5_ai',
    phaseNumber: 5,
    phaseTitle: 'Phase 5 · AI, Agentic Orchestration & ML Pipelines',
    phaseBadge: 'D15 · CLOSED-LOOP MLOPS',
    title: 'Closed-Loop MLOps, 1:3 Counterfactual Simulation & Eval Gate',
    subtitle: 'Golden Eval Benchmark, Parallel Rollout Enclaves, Cross-Model Judge & Telemetry Feedback',
    prompt: 'Build a Closed-Loop MLOps & Evaluation Harness diagram with Golden Benchmark Datasets, 1:3 Parallel Simulation Enclaves, Cross-Model LLM-as-a-Judge Gate, and Production Drift Feedback.',
    zones: [
      { id: 'z1', title: 'GOLDEN DATASET & REGISTRY', subtitle: 'Versioned Prompts, Weights & Rubrics', accent: 'blue' },
      { id: 'z2', title: '1:3 PARALLEL SIMULATION', subtitle: 'Nominal, Stress & Adversarial Enclaves', accent: 'purple' },
      { id: 'z3', title: 'JUDGE & PARETO GATE', subtitle: 'Cross-Model Critic & Regression Lock', accent: 'amber' },
      { id: 'z4', title: 'SERVING & DRIFT FEEDBACK', subtitle: 'Shadow Traffic & Closed-Loop Curation', accent: 'teal' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Golden Evaluation Suite (500+)', subtitle: 'Curated Multi-Turn Edge Cases', pill: 'BigQuery Golden', iconKey: 'cloud_spanner', shape: 'cylinder_db' },
      { id: 'n2', zoneId: 'z1', title: 'Vertex Model & Prompt Registry', subtitle: 'Immutable SHA-256 Artifact Spec', pill: 'v2.4 Candidate', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n3', zoneId: 'z2', title: 'Enclave α & β: Nominal + Stress', subtitle: '10x Load & Complex Multi-Hop Prompts', pill: '1:3 Fork Rollout', iconKey: 'gke_autopilot' },
      { id: 'n4', zoneId: 'z2', title: 'Enclave γ: Red-Team Adversarial', subtitle: 'Injected Boundary & Schema Attacks', pill: 'Zero-Bypass Test', iconKey: 'cloud_armor' },
      { id: 'n5', zoneId: 'z3', title: 'Independent Judge Model', subtitle: 'Distinct Family Rubric Scorer', pill: 'Pairwise Win >62%', iconKey: 'adk_agent', shape: 'hexagon_agent' },
      { id: 'n6', zoneId: 'z3', title: 'Release Promotion Diamond', subtitle: 'Requires 0 Safety/Geometry Regressions', pill: '[PROMOTE] / [HALT]', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n7', zoneId: 'z4', title: 'Canary Production Endpoint', subtitle: 'Serves Live Traffic with Shadow Log', pill: 'p95 < 650ms', iconKey: 'cloud_run' },
      { id: 'n8', zoneId: 'z4', title: 'Continuous Drift & Flywheel Harvester', subtitle: 'Converts Thumbs-Down to Golden Cases', pill: 'Closed-Loop Sync', iconKey: 'telemetry_hub' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'Replay Suite', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'Mount Candidate', type: 'ai_rag_grounding' },
      { from: 'n3', to: 'n5', label: '3:1 Join Traces', type: 'ai_rag_grounding' },
      { from: 'n4', to: 'n6', label: 'RedTeam Score', type: 'governance_policy' },
      { from: 'n5', to: 'n6', label: 'Rubric Pass', type: 'governance_policy' },
      { from: 'n5', to: 'n7', label: 'Promote Weights', type: 'partner_protocol' },
      { from: 'n6', to: 'n8', label: 'Audit Telemetry', type: 'async_event' },
      { from: 'n8', to: 'n2', label: 'Retrain Loop', type: 'closed_loop_telemetry' }
    ]
  }),

  // ============================================================================
  // PHASE 6: SECURITY, CI/CD DELIVERY & SRE OPERATIONS (D16 - D18)
  // ============================================================================
  buildBlueprint({
    id: 'd16-zero-trust-security-dlp',
    code: 'D16',
    phaseId: 'phase_6_ops',
    phaseNumber: 6,
    phaseTitle: 'Phase 6 · Security, CI/CD Delivery & SRE Operations',
    phaseBadge: 'D16 · ZERO-TRUST & DLP',
    title: 'Zero-Trust Security Perimeter, IAM, CMEK & DLP Governance',
    subtitle: 'BeyondCorp Device Trust, Workload Identity Federation, PII De-Identification & HSM KMS',
    prompt: 'Create a Zero-Trust Security & Compliance architecture showing BeyondCorp IAP Device Verification, Workload Identity mTLS, Sensitive Data Protection (DLP) PII Redaction, and HSM CMEK Encryption.',
    zones: [
      { id: 'z1', title: 'PERIMETER & DEVICE TRUST', subtitle: 'Cloud Armor WAF & BeyondCorp IAP', accent: 'blue' },
      { id: 'z2', title: 'IDENTITY & WORKLOAD mTLS', subtitle: 'SPIFFE/SPIRE & Short-Lived JWTs', accent: 'indigo' },
      { id: 'z3', title: 'DLP PII REDACTION & VPC-SC', subtitle: 'Inline Tokenization & Exfil Guard', accent: 'rose' },
      { id: 'z4', title: 'CMEK HSM VAULT & SIEM', subtitle: 'Hardware Keys & Immutable Audit', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Cloud Armor Adaptive Protection', subtitle: 'L7 DDoS Mitigation & Bot Defense', pill: 'Edge WAF Policy', iconKey: 'cloud_armor' },
      { id: 'n2', zoneId: 'z1', title: 'BeyondCorp Zero-Trust IAP', subtitle: 'Device Cert + Context-Aware Access', pill: 'Corp Device Only', iconKey: 'iap', shape: 'decision_diamond' },
      { id: 'n3', zoneId: 'z2', title: 'Workload Identity Federation', subtitle: 'Keyless OIDC Token Exchange (15m TTL)', pill: 'Zero Static Keys', iconKey: 'apigee' },
      { id: 'n4', zoneId: 'z2', title: 'Istio Ambient mTLS Mesh', subtitle: 'Mutual TLS + AuthorizationPolicy', pill: 'SPIFFE Identity', iconKey: 'gke_autopilot' },
      { id: 'n5', zoneId: 'z3', title: 'Sensitive Data Protection (DLP)', subtitle: 'Format-Preserving PII Surrogate Mask', pill: 'SSN / CC Redact', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n6', zoneId: 'z3', title: 'VPC Service Controls Bridge', subtitle: 'Blocks Unauthorized GCS/BQ Copy', pill: 'Perimeter Enforced', iconKey: 'cloud_run' },
      { id: 'n7', zoneId: 'z4', title: 'Cloud HSM & CMEK Key Ring', subtitle: 'FIPS 140-3 Level 3 Customer Keys', pill: '90-Day Auto-Rotate', iconKey: 'cloud_spanner', shape: 'cylinder_db' },
      { id: 'n8', zoneId: 'z4', title: 'Security Command Center & SIEM', subtitle: 'Real-Time Threat & Compliance Ledger', pill: 'SOC2 / ISO27001', iconKey: 'telemetry_hub' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'WAF Cleared', type: 'governance_policy' },
      { from: 'n2', to: 'n4', label: 'Signed JWT', type: 'governance_policy' },
      { from: 'n3', to: 'n4', label: 'Mint SVID', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Inspect Payload', type: 'governance_policy' },
      { from: 'n4', to: 'n6', label: 'mTLS Egress', type: 'sync_request' },
      { from: 'n5', to: 'n7', label: 'Wrap DEK/KEK', type: 'partner_protocol' },
      { from: 'n6', to: 'n8', label: 'VPC-SC Audit', type: 'async_event' }
    ]
  }),

  buildBlueprint({
    id: 'd17-gitops-cicd-canary',
    code: 'D17',
    phaseId: 'phase_6_ops',
    phaseNumber: 6,
    phaseTitle: 'Phase 6 · Security, CI/CD Delivery & SRE Operations',
    phaseBadge: 'D17 · GITOPS & CANARY CI/CD',
    title: 'GitOps CI/CD Release Pipeline & Progressive Canary Delivery',
    subtitle: 'Pre-Merge AST & Visual Gates, SLSA L3 Signed Builds, Staging Soak & Automated Canary Rollout',
    prompt: 'Generate a GitOps CI/CD & Progressive Delivery pipeline from PR Quality Gates through SLSA Level 3 Artifact Build, Staging Soak Verification, and 5%->25%->100% Canary Rollout.',
    zones: [
      { id: 'z1', title: 'PR & FORENSIC QUALITY GATE', subtitle: 'AST, Unit, SAST & Headless Visual Audit', accent: 'blue' },
      { id: 'z2', title: 'SLSA L3 BUILD & ATTEST', subtitle: 'Hermetic Container Build & Cosign', accent: 'indigo' },
      { id: 'z3', title: 'STAGING SOAK & CHAOS GATE', subtitle: 'Synthetic E2E & Binary Authorization', accent: 'amber' },
      { id: 'z4', title: 'PROGRESSIVE CANARY DEPLOY', subtitle: '5% -> 25% -> 100% with Auto-Rollback', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Git Pull Request & AST Linter', subtitle: 'Typecheck, Unit Suite & Secret Scan', pill: '100% Required', iconKey: 'client_web' },
      { id: 'n2', zoneId: 'z1', title: 'Headless Chrome Geometry Gate', subtitle: 'Verifies 0 Overlaps & Visual Parity', pill: 'Rule 57C Gate', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n3', zoneId: 'z2', title: 'Cloud Build Hermetic Runner', subtitle: 'Multi-Stage Distroless Image Compile', pill: 'SLSA Level 3', iconKey: 'cloud_run' },
      { id: 'n4', zoneId: 'z2', title: 'Artifact Registry + Cosign', subtitle: 'Cryptographic Provenance & CVE Scan', pill: '0 Critical CVEs', iconKey: 'iap', shape: 'cylinder_db' },
      { id: 'n5', zoneId: 'z3', title: 'Binary Authorization Policy', subtitle: 'Verifies Kritis Attestation Signature', pill: '[SIGNED] Only', iconKey: 'cloud_armor', shape: 'decision_diamond' },
      { id: 'n6', zoneId: 'z3', title: 'Pre-Prod Synthetic Load Soak', subtitle: '10k RPS Replay & Latency Assertion', pill: 'p99 < 120ms', iconKey: 'gke_autopilot' },
      { id: 'n7', zoneId: 'z4', title: 'Cloud Deploy Canary (5% → 25%)', subtitle: 'Traffic Split with Live SLO Watch', pill: 'Error < 0.05%', iconKey: 'apigee' },
      { id: 'n8', zoneId: 'z4', title: '100% Production Promotion', subtitle: 'Instant Revision Pin or Auto-Rollback', pill: 'Zero Downtime', iconKey: 'telemetry_hub', shape: 'state_capsule' }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Run E2E Gate', type: 'sync_request' },
      { from: 'n1', to: 'n3', label: 'Merge SHA', type: 'sync_request' },
      { from: 'n2', to: 'n4', label: 'Stamp VisualPass', type: 'governance_policy' },
      { from: 'n3', to: 'n4', label: 'Push Digest', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Verify Sig', type: 'governance_policy' },
      { from: 'n4', to: 'n6', label: 'Deploy Stage', type: 'sync_request' },
      { from: 'n5', to: 'n7', label: 'Shift 5% Traffic', type: 'partner_protocol' },
      { from: 'n6', to: 'n8', label: 'Soak Passed', type: 'partner_protocol' },
      { from: 'n7', to: 'n8', label: 'Promote 100%', type: 'partner_protocol' }
    ]
  }),

  buildBlueprint({
    id: 'd18-sre-observability-dr',
    code: 'D18',
    phaseId: 'phase_6_ops',
    phaseNumber: 6,
    phaseTitle: 'Phase 6 · Security, CI/CD Delivery & SRE Operations',
    phaseBadge: 'D18 · SRE & MULTI-REGION DR',
    title: 'SRE Observability, SLO Burn-Rate Alerting & Multi-Region DR',
    subtitle: 'OpenTelemetry Traces/Metrics, Error-Budget Burn Gate, AI RCA Copilot & Active-Active Failover',
    prompt: 'Build an SRE Observability & Multi-Region Disaster Recovery architecture with OpenTelemetry Collectors, Monarch/Prometheus SLO Burn-Rate Alerting, AI Incident Copilot, and Active-Active Regional Failover.',
    zones: [
      { id: 'z1', title: 'MULTI-REGION WORKLOADS', subtitle: 'Active-Active US-West1 & US-East4', accent: 'blue' },
      { id: 'z2', title: 'OTEL & MONARCH TELEMETRY', subtitle: 'Metrics, Logs & Distributed Traces', accent: 'teal' },
      { id: 'z3', title: 'SLO BURN-RATE & AI RCA', subtitle: 'Error Budget Gate & Automated Triage', accent: 'amber' },
      { id: 'z4', title: 'AUTOMATED DR & SELF-HEAL', subtitle: 'Anycast Traffic Drain & Spanner Quorum', accent: 'emerald' }
    ],
    nodes: [
      { id: 'n1', zoneId: 'z1', title: 'Primary Region: us-west1 (GKE)', subtitle: 'Serves 50% Anycast Traffic + OTel SDK', pill: 'SLO Target: 99.99%', iconKey: 'gke_autopilot' },
      { id: 'n2', zoneId: 'z1', title: 'Secondary Region: us-east4 (GKE)', subtitle: 'Hot Active-Active Peer + Auto-Scale', pill: 'RPO: 0s · RTO <3s', iconKey: 'cloud_run' },
      { id: 'n3', zoneId: 'z2', title: 'OpenTelemetry Collector Fleet', subtitle: 'Tail-Based Sampling & Span Enrichment', pill: 'OTLP gRPC :4317', iconKey: 'kafka_pubsub' },
      { id: 'n4', zoneId: 'z2', title: 'Cloud Monitoring & Trace Store', subtitle: 'High-Cardinality Time-Series Engine', pill: '1s Granularity', iconKey: 'telemetry_hub', shape: 'cylinder_db' },
      { id: 'n5', zoneId: 'z3', title: 'Multi-Window SLO Burn Gate', subtitle: 'Fires when 1h Burn Rate > 14.4x Budget', pill: '[BURN > 14.4x]', iconKey: 'dlp_guardrail', shape: 'decision_diamond' },
      { id: 'n6', zoneId: 'z3', title: 'SRE Incident RCA Agent', subtitle: 'Correlates Bad Deploy SHA with Spans', pill: 'Gemini 3.8 SRE', iconKey: 'vertex_ai', shape: 'hexagon_agent' },
      { id: 'n7', zoneId: 'z4', title: 'Global Load Balancer Health Drain', subtitle: 'Evacuates Degraded Region in < 2s', pill: 'Anycast Shift', iconKey: 'apigee' },
      { id: 'n8', zoneId: 'z4', title: 'Spanner Paxos Leader Re-Election', subtitle: 'Moves Read-Write Quorum to Healthy Zone', pill: 'Zero Data Loss', iconKey: 'cloud_spanner', shape: 'cylinder_db' }
    ],
    edges: [
      { from: 'n1', to: 'n3', label: 'OTLP Spans', type: 'async_event' },
      { from: 'n2', to: 'n4', label: 'Prom Metrics', type: 'async_event' },
      { from: 'n3', to: 'n4', label: 'Index Traces', type: 'sync_request' },
      { from: 'n3', to: 'n5', label: 'Eval SLI', type: 'governance_policy' },
      { from: 'n4', to: 'n6', label: 'Anomaly Context', type: 'ai_rag_grounding' },
      { from: 'n5', to: 'n7', label: 'Trigger Drain', type: 'partner_protocol' },
      { from: 'n6', to: 'n8', label: 'Shift Quorum', type: 'partner_protocol' },
      { from: 'n7', to: 'n1', label: 'Health Probe Loop', type: 'closed_loop_telemetry' }
    ]
  })
];

export function getBlueprintByCodeOrId(codeOrId) {
  const key = String(codeOrId || '').toUpperCase();
  return (
    LIFECYCLE_BLUEPRINTS_18.find(
      (b) => b.code.toUpperCase() === key || b.id.toUpperCase() === key
    ) || LIFECYCLE_BLUEPRINTS_18[4] // Default D05 Cloud-Native AI Commerce
  );
}
