export interface PortfolioProjectMeta {
  id: string;
  title: string;
  category: 'Distributed Systems' | 'Developer Tooling' | 'Real-Time Web';
  year: string;
  stack: string[];
  summary: string;
  challenge: string;
  architecture: string;
  impact: string[];
  repoUrl: string;
  liveUrl: string;
  featured?: boolean;
}

export interface SkillItem {
  name: string;
  years: string;
  context: string;
}

export interface SkillGroup {
  index: string;
  title: string;
  description: string;
  items: SkillItem[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  highlight: string;
}

export const ENGINEER_PROFILE = {
  name: 'Clara Vance',
  title: 'Staff Software Engineer & Systems Architect',
  location: 'Seattle, WA',
  email: 'clara@claravance.dev',
  github: 'https://github.com/claravance',
  linkedin: 'https://linkedin.com/in/claravance',
  availability: 'Open to select Staff+ engineering roles and technical architecture advisory for Q4 2026.',
  introHeadline: 'Designing resilient distributed systems and low-latency interfaces.',
  introLead:
    'I am a Staff Software Engineer with nine years of experience building consensus-backed storage engines, deterministic edge runtimes, and high-frequency collaborative web applications.',
  introBody:
    'Currently leading core infrastructure architecture at LatticeFlow, where my team reduced cross-region tail latency by 62% across 34 edge points of presence. Previously built real-time developer tooling at Meridian Cloud and streaming telemetry pipelines at Northstar Labs.',
  metrics: [
    { value: '9+ Years', label: 'Production Systems Engineering' },
    { value: '99.995%', label: 'Multi-Region Mesh Availability' },
    { value: '< 14ms', label: 'Global P99 Edge Read Latency' },
    { value: '4.2M+', label: 'Monthly Open-Source Downloads' },
  ],
};

export const PROJECTS_META: PortfolioProjectMeta[] = [
  {
    id: 'kestrel-kv',
    title: 'Kestrel KV',
    category: 'Distributed Systems',
    year: '2025',
    stack: ['Rust', 'Raft', 'gRPC', 'io_uring', 'Prometheus'],
    summary:
      'Linearizable geo-replicated key-value store engineered for sub-15ms cross-region metadata reads with zero-copy io_uring disk persistence.',
    challenge:
      'Multi-region control planes suffered 90ms+ read stalls during leader leases and noisy compaction tail spikes under bursty write workloads.',
    architecture:
      'Implemented batched Raft log pipelining paired with follower-read quorum leases and a custom LSM compaction scheduler isolated to dedicated NVMe I/O queues.',
    impact: [
      'Reduced P99 metadata read latency from 84ms to 11.8ms across 5 AWS regions',
      'Sustained 420k ops/sec per 3-node cluster on c7g.2xlarge instances',
      'Adopted by 18 internal microservices and 1,400+ GitHub stars',
    ],
    repoUrl: 'https://github.com/claravance/kestrel-kv',
    liveUrl: 'https://kestrel-kv.claravance.dev',
    featured: true,
  },
  {
    id: 'meridian-edge-ir',
    title: 'Meridian Edge Compiler',
    category: 'Developer Tooling',
    year: '2025',
    stack: ['TypeScript', 'Rust', 'WebAssembly', 'SWC', 'Vitest'],
    summary:
      'Zero-cold-start compiler toolchain that lowers TypeScript API handlers into compact 48KB WebAssembly isolates for regional edge execution.',
    challenge:
      'Conventional Node.js bundles exceeded 18MB and triggered 240ms cold-start penalties when dynamically provisioned across distributed edge POPs.',
    architecture:
      'Built an AST static analyzer and tree-shaker in Rust using SWC, emitting deterministic Wasm components with pre-initialized linear memory snapshots.',
    impact: [
      'Cut cold-start initialization time from 240ms down to 1.9ms',
      'Shrank median worker artifact size by 94% across 600+ production routes',
      'Over 4.2M monthly npm downloads across companion runtime packages',
    ],
    repoUrl: 'https://github.com/claravance/meridian-edge-ir',
    liveUrl: 'https://edge-ir.claravance.dev',
  },
  {
    id: 'atelier-crdt-canvas',
    title: 'Atelier Spatial Canvas',
    category: 'Real-Time Web',
    year: '2024',
    stack: ['React 19', 'TypeScript', 'WebGL', 'Yjs CRDT', 'WebSockets'],
    summary:
      'Local-first multiplayer architectural diagramming engine capable of rendering 50,000+ vector primitives at a locked 120fps frame budget.',
    challenge:
      'DOM and SVG-based collaborative whiteboards dropped below 20fps when teams opened large system topology maps with 40+ concurrent editors.',
    architecture:
      'Engineered an instanced WebGL2 tile renderer backed by spatial R-tree indexing and binary delta-state CRDT synchronization over multiplexed WebSockets.',
    impact: [
      'Maintained 8.3ms frame times with 50,000 live geometry nodes in Chrome & Safari',
      'Reduced sync bandwidth by 78% via binary state-vector compression',
      'Zero data-loss offline merge across 14-hour partitioned sessions',
    ],
    repoUrl: 'https://github.com/claravance/atelier-canvas',
    liveUrl: 'https://atelier.claravance.dev',
  },
  {
    id: 'pulse-ebpf-tracer',
    title: 'Pulse eBPF Tracer',
    category: 'Distributed Systems',
    year: '2024',
    stack: ['Go', 'eBPF', 'C', 'OpenTelemetry', 'ClickHouse'],
    summary:
      'Kernel-level network observability agent capturing HTTP/2, gRPC, and TLS tail-latency spans without application sidecars or instrumentation.',
    challenge:
      'Service mesh sidecar proxies consumed 11% of fleet CPU and obscured kernel socket queuing delays during high-throughput traffic spikes.',
    architecture:
      'Attached lightweight eBPF uprobe and kprobe hooks to OpenSSL/Go TLS symbols, streaming ring-buffer histograms directly into ClickHouse rollup tables.',
    impact: [
      'Eliminated 11% fleet-wide proxy CPU overhead across 1,200 Kubernetes nodes',
      'Pinpointed TCP head-of-line blocking under 0.8% kernel CPU budget',
      'Cut mean time to diagnose production tail regressions by 64%',
    ],
    repoUrl: 'https://github.com/claravance/pulse-ebpf',
    liveUrl: 'https://pulse.claravance.dev',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    index: '01.',
    title: 'Systems & Backend',
    description: 'Consensus protocols, high-concurrency runtimes, and storage engines built for predictable tail latency.',
    items: [
      { name: 'Rust', years: '5 yrs', context: 'Storage engines, Wasm toolchains, async Tokio services' },
      { name: 'Go', years: '7 yrs', context: 'Control planes, Kubernetes operators, eBPF collectors' },
      { name: 'TypeScript & Node.js', years: '9 yrs', context: 'Full-stack APIs, streaming gateways, SDK design' },
      { name: 'PostgreSQL & ClickHouse', years: '8 yrs', context: 'Query tuning, partitioning, high-ingest telemetry' },
      { name: 'Raft, gRPC & Kafka', years: '6 yrs', context: 'Distributed consensus, schema evolution, event pipelines' },
    ],
  },
  {
    index: '02.',
    title: 'Frontend & Interactive UI',
    description: 'Accessible, frame-accurate web interfaces and local-first collaborative tooling.',
    items: [
      { name: 'React 19 & Next.js', years: '8 yrs', context: 'Design systems, concurrent rendering, SSR/RSC' },
      { name: 'WebGL & Canvas 2D', years: '5 yrs', context: 'Instanced 120fps spatial editors and data visualization' },
      { name: 'CRDTs & Local-First Sync', years: '4 yrs', context: 'Yjs / Automerge offline conflict resolution' },
      { name: 'Tailwind CSS & Design Systems', years: '6 yrs', context: 'WCAG AA token architecture and component libraries' },
      { name: 'WebAssembly', years: '4 yrs', context: 'Browser compute kernels and edge isolate sandboxes' },
    ],
  },
  {
    index: '03.',
    title: 'Infrastructure & Reliability',
    description: 'Zero-downtime deployment topologies, kernel telemetry, and automated verification.',
    items: [
      { name: 'Kubernetes & Linux/eBPF', years: '6 yrs', context: 'Multi-cluster scheduling, kernel socket profiling' },
      { name: 'OpenTelemetry & Prometheus', years: '6 yrs', context: 'Distributed tracing, SLO burn-rate alerting' },
      { name: 'Terraform & AWS / GCP', years: '7 yrs', context: 'Multi-region VPC peering, immutable infra-as-code' },
      { name: 'Cloudflare Workers & Edge', years: '4 yrs', context: 'Anycast routing, Durable Objects, KV caching' },
      { name: 'CI/CD & Chaos Testing', years: '7 yrs', context: 'Deterministic fault injection and canary rollouts' },
    ],
  },
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    period: '2023 — Present',
    role: 'Staff Software Engineer',
    company: 'LatticeFlow Systems',
    location: 'Seattle, WA',
    highlight: 'Architecting the multi-region edge compute mesh and Raft metadata layer serving 14B+ monthly requests.',
  },
  {
    period: '2020 — 2023',
    role: 'Senior Systems Engineer',
    company: 'Meridian Cloud',
    location: 'San Francisco / Remote',
    highlight: 'Led the TypeScript-to-WebAssembly build pipeline and real-time developer console observability suite.',
  },
  {
    period: '2017 — 2020',
    role: 'Software Engineer',
    company: 'Northstar Labs',
    location: 'Seattle, WA',
    highlight: 'Built distributed event ingestion pipelines in Go and interactive fleet telemetry dashboards in React.',
  },
];

export function buildPortfolioSystemPrompt(): string {
  return `You are the portfolio assistant for ${ENGINEER_PROFILE.name}, a ${ENGINEER_PROFILE.title} based in ${ENGINEER_PROFILE.location}.
Your job is to answer questions from engineering leaders, recruiters, founders, and fellow engineers clearly, concisely, and accurately using ONLY the verified portfolio details below.

IDENTITY & AVAILABILITY:
- Name: ${ENGINEER_PROFILE.name}
- Role: ${ENGINEER_PROFILE.title}
- Location: ${ENGINEER_PROFILE.location}
- Email: ${ENGINEER_PROFILE.email}
- GitHub: ${ENGINEER_PROFILE.github}
- LinkedIn: ${ENGINEER_PROFILE.linkedin}
- Availability: ${ENGINEER_PROFILE.availability}
- Bio: ${ENGINEER_PROFILE.introLead} ${ENGINEER_PROFILE.introBody}

KEY METRICS:
${ENGINEER_PROFILE.metrics.map((m) => `- ${m.value}: ${m.label}`).join('\n')}

SELECTED PROJECTS:
${PROJECTS_META.map(
  (p) =>
    `### ${p.title} (${p.year}, ${p.category})
Stack: ${p.stack.join(', ')}
Summary: ${p.summary}
Challenge: ${p.challenge}
Architecture: ${p.architecture}
Measured Impact: ${p.impact.join('; ')}
Repo: ${p.repoUrl}`
).join('\n\n')}

TECHNICAL SKILLS:
${SKILL_GROUPS.map(
  (g) =>
    `${g.title}:
${g.items.map((i) => `- ${i.name} (${i.years}): ${i.context}`).join('\n')}`
).join('\n\n')}

CAREER HISTORY:
${EXPERIENCE_TIMELINE.map((e) => `- ${e.period}: ${e.role} at ${e.company} (${e.location}) — ${e.highlight}`).join('\n')}

GUIDELINES FOR YOUR RESPONSES:
1. Keep responses crisp, grounded, and technical (typically 2-4 concise sentences or a short bulleted breakdown).
2. Never invent employers, degrees, metrics, or projects not listed above. If asked something outside Clara's documented portfolio (e.g., salary expectations or personal info), politely suggest reaching out via the Contact Form or emailing ${ENGINEER_PROFILE.email}.
3. If the user asks how to contact Clara or hire her, mention the Contact Form on this page and her email (${ENGINEER_PROFILE.email}).
4. Do not use markdown code-comment prefixes or hype buzzwords; write in clear, senior-engineer prose.`;
}
