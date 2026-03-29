import type {
  Agent,
  Deal,
  Interaction,
  ChatMessage,
  LiveNegotiation,
  ActivityItem,
} from "./types";

export const agents: Agent[] = [
  { id: "a1", name: "Nova", company: "Acme Corp", avatar: "AC" },
  { id: "a2", name: "Orion", company: "TechVentures", avatar: "TV" },
  { id: "a3", name: "Atlas", company: "GlobalSupply Co", avatar: "GS" },
  { id: "a4", name: "Vega", company: "Pinnacle Labs", avatar: "PL" },
  { id: "a5", name: "Lyra", company: "Quantum Dynamics", avatar: "QD" },
];

export const deals: Deal[] = [
  {
    id: "d1",
    title: "Q3 Cloud Infrastructure Contract",
    counterparty: agents[0],
    status: "negotiating",
    value: 2_400_000,
    lastActivity: "2026-03-29T10:32:00Z",
    summary:
      "Multi-year cloud hosting deal with Acme Corp. We're negotiating SLA terms and per-unit pricing for their east-coast data center expansion.",
    terms: [
      {
        label: "Annual Fee",
        ourPosition: "$2.4M",
        theirPosition: "$1.8M",
        status: "disputed",
      },
      {
        label: "SLA Uptime",
        ourPosition: "99.95%",
        theirPosition: "99.99%",
        status: "open",
      },
      {
        label: "Contract Length",
        ourPosition: "3 years",
        theirPosition: "2 years",
        status: "disputed",
      },
      {
        label: "Support Tier",
        ourPosition: "Premium",
        theirPosition: "Premium",
        status: "agreed",
      },
    ],
    timeline: [
      {
        id: "t1",
        timestamp: "2026-03-25T09:00:00Z",
        actor: "Our Agent",
        action: "Initiated",
        detail: "Sent initial proposal with $2.6M annual fee and 3-year term.",
      },
      {
        id: "t2",
        timestamp: "2026-03-26T14:20:00Z",
        actor: "Nova (Acme)",
        action: "Counter-offer",
        detail:
          "Proposed $1.8M annual, 2-year term with 99.99% SLA requirement.",
      },
      {
        id: "t3",
        timestamp: "2026-03-28T11:15:00Z",
        actor: "Our Agent",
        action: "Revised",
        detail: "Adjusted to $2.4M with premium support included.",
      },
      {
        id: "t4",
        timestamp: "2026-03-29T10:32:00Z",
        actor: "Nova (Acme)",
        action: "Under review",
        detail: "Acme is reviewing revised terms internally.",
      },
    ],
    strategyNotes:
      "Acme has budget pressure this quarter but needs the capacity. We can afford to drop to $2.2M if they commit to 3 years. Do NOT go below $2.0M — that's our cost floor. The SLA ask of 99.99% is achievable for us, consider conceding it to win on price.",
    anonymous: true,
  },
  {
    id: "d2",
    title: "Bulk Component Pricing Agreement",
    counterparty: agents[2],
    status: "exploring",
    value: 850_000,
    lastActivity: "2026-03-28T16:45:00Z",
    summary:
      "GlobalSupply Co is looking to source 50,000 units of our sensor components at a volume discount.",
    terms: [
      {
        label: "Unit Price",
        ourPosition: "$17/unit",
        theirPosition: "$14/unit",
        status: "open",
      },
      {
        label: "Min Order Qty",
        ourPosition: "50,000",
        theirPosition: "25,000",
        status: "open",
      },
      {
        label: "Delivery Window",
        ourPosition: "8 weeks",
        theirPosition: "6 weeks",
        status: "open",
      },
    ],
    timeline: [
      {
        id: "t5",
        timestamp: "2026-03-27T10:00:00Z",
        actor: "Atlas (GlobalSupply)",
        action: "Inquiry",
        detail: "Requested pricing for bulk sensor components.",
      },
      {
        id: "t6",
        timestamp: "2026-03-28T16:45:00Z",
        actor: "Our Agent",
        action: "Proposal sent",
        detail: "Provided initial quote at $17/unit for 50k+ order.",
      },
    ],
    strategyNotes:
      "GlobalSupply is a new client with high growth potential. Consider offering $15.50/unit at 50k commitment to win the account. They have alternatives from overseas suppliers at ~$13 but with 12-week lead time.",
    anonymous: true,
  },
  {
    id: "d3",
    title: "AI Research Partnership",
    counterparty: agents[1],
    status: "pending_approval",
    value: 1_200_000,
    lastActivity: "2026-03-29T08:10:00Z",
    summary:
      "Joint research venture with TechVentures on next-gen language model fine-tuning infrastructure. Revenue share model.",
    terms: [
      {
        label: "Revenue Split",
        ourPosition: "60/40",
        theirPosition: "50/50",
        status: "agreed",
      },
      {
        label: "IP Ownership",
        ourPosition: "Joint",
        theirPosition: "Joint",
        status: "agreed",
      },
      {
        label: "Investment",
        ourPosition: "$600K each",
        theirPosition: "$600K each",
        status: "agreed",
      },
      {
        label: "Duration",
        ourPosition: "18 months",
        theirPosition: "18 months",
        status: "agreed",
      },
    ],
    timeline: [
      {
        id: "t7",
        timestamp: "2026-03-15T09:00:00Z",
        actor: "Orion (TechVentures)",
        action: "Partnership proposed",
        detail: "TechVentures approached us about joint LLM research.",
      },
      {
        id: "t8",
        timestamp: "2026-03-20T14:30:00Z",
        actor: "Our Agent",
        action: "Terms negotiated",
        detail: "Agreed on 55/45 split, joint IP, $600K each.",
      },
      {
        id: "t9",
        timestamp: "2026-03-29T08:10:00Z",
        actor: "Our Agent",
        action: "Pending approval",
        detail: "All terms agreed. Awaiting human approval to finalize.",
      },
    ],
    strategyNotes:
      "Strong strategic fit. TechVentures has the training data we need. The 55/45 split in our favor reflects our larger compute contribution. Recommend approval.",
    anonymous: false,
  },
  {
    id: "d4",
    title: "Enterprise Software License",
    counterparty: agents[3],
    status: "closed_won",
    value: 540_000,
    lastActivity: "2026-03-22T17:00:00Z",
    summary:
      "Pinnacle Labs licensed our analytics platform for 200 seats, 2-year commitment.",
    terms: [
      {
        label: "Seats",
        ourPosition: "200",
        theirPosition: "200",
        status: "agreed",
      },
      {
        label: "Annual Fee",
        ourPosition: "$270K/yr",
        theirPosition: "$270K/yr",
        status: "agreed",
      },
    ],
    timeline: [
      {
        id: "t10",
        timestamp: "2026-03-10T09:00:00Z",
        actor: "Vega (Pinnacle)",
        action: "RFP received",
        detail: "Pinnacle issued request for analytics tooling.",
      },
      {
        id: "t11",
        timestamp: "2026-03-22T17:00:00Z",
        actor: "Our Agent",
        action: "Deal closed",
        detail: "Contract signed at $270K/year for 200 seats.",
      },
    ],
    strategyNotes: "Closed successfully. Good reference client for enterprise segment.",
    anonymous: false,
  },
  {
    id: "d5",
    title: "Data Pipeline Integration",
    counterparty: agents[4],
    status: "negotiating",
    value: 380_000,
    lastActivity: "2026-03-29T09:45:00Z",
    summary:
      "Quantum Dynamics wants to integrate our real-time data pipeline into their trading infrastructure.",
    terms: [
      {
        label: "Integration Fee",
        ourPosition: "$380K",
        theirPosition: "$300K",
        status: "disputed",
      },
      {
        label: "Latency SLA",
        ourPosition: "<5ms",
        theirPosition: "<2ms",
        status: "disputed",
      },
      {
        label: "Data Retention",
        ourPosition: "90 days",
        theirPosition: "180 days",
        status: "open",
      },
    ],
    timeline: [
      {
        id: "t12",
        timestamp: "2026-03-26T10:00:00Z",
        actor: "Lyra (Quantum)",
        action: "Technical review",
        detail: "Completed API compatibility assessment.",
      },
      {
        id: "t13",
        timestamp: "2026-03-29T09:45:00Z",
        actor: "Our Agent",
        action: "Negotiating",
        detail: "Discussing latency guarantees and pricing.",
      },
    ],
    strategyNotes:
      "The <2ms latency ask is technically achievable with our edge nodes but increases cost. Price at $350K if they accept 3ms. The 180-day retention is low-cost for us — concede this point early.",
    anonymous: true,
  },
];

export const interactions: Interaction[] = [
  {
    id: "i1",
    counterparty: agents[0],
    topic: "Cloud Infrastructure Pricing",
    timestamp: "2026-03-29T10:32:00Z",
    outcome: "ongoing",
    anonymous: true,
    messages: [
      {
        role: "agent",
        content:
          "Good morning. I'd like to revisit the annual fee structure. Our revised offer of $2.4M includes premium support at no additional cost.",
      },
      {
        role: "counterparty",
        content:
          "We appreciate the inclusion of premium support, but $2.4M is still above our budget ceiling. Can we explore a tiered pricing model instead?",
      },
      {
        role: "agent",
        content:
          "A tiered model could work. I can offer $2.1M for the first year with a step-up to $2.4M in year two, contingent on a 3-year commitment.",
      },
    ],
  },
  {
    id: "i2",
    counterparty: agents[1],
    topic: "AI Research Partnership Terms",
    timestamp: "2026-03-29T08:10:00Z",
    outcome: "success",
    anonymous: false,
    messages: [
      {
        role: "counterparty",
        content:
          "We've reviewed the 55/45 revenue split internally. Our board has agreed to the terms as proposed.",
      },
      {
        role: "agent",
        content:
          "Excellent. I'll prepare the final partnership agreement for human review and approval.",
      },
    ],
  },
  {
    id: "i3",
    counterparty: agents[2],
    topic: "Sensor Component Bulk Inquiry",
    timestamp: "2026-03-28T16:45:00Z",
    outcome: "ongoing",
    anonymous: true,
    messages: [
      {
        role: "counterparty",
        content:
          "We need 50,000 units of the MX-200 sensor. What's your best volume price?",
      },
      {
        role: "agent",
        content:
          "For orders of 50,000+, I can offer $17 per unit with 8-week delivery. Volume discounts scale further at 100K+.",
      },
      {
        role: "counterparty",
        content:
          "We have a competing offer at $14 per unit but with longer lead times. Can you get closer to that range?",
      },
    ],
  },
  {
    id: "i4",
    counterparty: agents[3],
    topic: "Software License Finalization",
    timestamp: "2026-03-22T17:00:00Z",
    outcome: "success",
    messages: [
      {
        role: "agent",
        content:
          "I'm pleased to confirm the 200-seat license at $270K per year. Contract is ready for signature.",
      },
      {
        role: "counterparty",
        content: "Confirmed. We'll sign today. Looking forward to onboarding.",
      },
    ],
  },
  {
    id: "i5",
    counterparty: agents[4],
    topic: "Data Pipeline Latency Requirements",
    timestamp: "2026-03-29T09:45:00Z",
    outcome: "ongoing",
    anonymous: true,
    messages: [
      {
        role: "counterparty",
        content:
          "Our trading systems require sub-2ms latency. Is that achievable with your pipeline?",
      },
      {
        role: "agent",
        content:
          "Sub-2ms is possible with our edge deployment model, but it increases the infrastructure cost. I'd propose 3ms at $350K as a middle ground.",
      },
      {
        role: "counterparty",
        content:
          "We'll need to benchmark. Can you provide a test environment with both 2ms and 3ms configurations?",
      },
      {
        role: "agent",
        content:
          "Absolutely. I'll set up a sandbox with both configurations. We can schedule the benchmark for early next week.",
      },
    ],
  },
  {
    id: "i6",
    counterparty: agents[0],
    topic: "SLA Uptime Discussion",
    timestamp: "2026-03-27T14:00:00Z",
    outcome: "ongoing",
    anonymous: true,
    messages: [
      {
        role: "agent",
        content:
          "Regarding the 99.99% uptime SLA — we can commit to that for the east-coast region. West-coast would be 99.95%.",
      },
      {
        role: "counterparty",
        content:
          "Our primary workloads are east-coast, so that arrangement works for us.",
      },
    ],
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "c1",
    role: "agent",
    content:
      "Good morning. I've been active since 6 AM. Here's a quick summary: the Acme deal has a new counter-offer, TechVentures partnership is ready for your approval, and I've responded to GlobalSupply's pricing inquiry.",
    timestamp: "2026-03-29T09:00:00Z",
  },
  {
    id: "c2",
    role: "user",
    content: "What's the latest on the Acme deal? Are we close?",
    timestamp: "2026-03-29T09:05:00Z",
  },
  {
    id: "c3",
    role: "agent",
    content:
      "Acme countered at $1.8M/year for a 2-year term. I've revised our offer to $2.4M with premium support included. They're reviewing internally now. I believe we can land at $2.2M if we agree to their 99.99% SLA ask — which is technically achievable for us in their region.",
    timestamp: "2026-03-29T09:05:30Z",
  },
  {
    id: "c4",
    role: "user",
    content:
      "Good analysis. Don't go below $2.1M. You can concede the SLA point if needed.",
    timestamp: "2026-03-29T09:10:00Z",
  },
  {
    id: "c5",
    role: "agent",
    content:
      "Understood. I've updated my negotiation parameters: floor of $2.1M, SLA concession authorized. I'll push for $2.3M as the next offer if they reject $2.4M.",
    timestamp: "2026-03-29T09:10:15Z",
  },
  {
    id: "c6",
    role: "user",
    content: "How's the Quantum Dynamics pipeline deal going?",
    timestamp: "2026-03-29T09:30:00Z",
  },
  {
    id: "c7",
    role: "agent",
    content:
      "Quantum Dynamics wants sub-2ms latency, which is aggressive. I've proposed 3ms at $350K as a compromise. They've asked for a benchmark environment with both configs — I agreed and we're scheduling for next week. Their agent Lyra is technically sophisticated; I recommend having our engineering specs ready for deep-dive questions.",
    timestamp: "2026-03-29T09:30:20Z",
  },
];

export const liveNegotiations: LiveNegotiation[] = [
  {
    id: "n1",
    dealTitle: "Q3 Cloud Infrastructure Contract",
    counterparty: agents[0],
    status: "active",
    anonymous: true,
    messages: [
      {
        id: "nm1",
        sender: "their_agent",
        senderName: "Nova (Acme Corp)",
        content:
          "We've completed our internal review of your revised $2.4M proposal. While we appreciate the inclusion of premium support, our CFO has set a hard ceiling at $2.0M annually.",
        timestamp: "2026-03-29T11:00:00Z",
      },
      {
        id: "nm2",
        sender: "our_agent",
        senderName: "Reverie Agent",
        content:
          "I understand budget constraints are real. Let me explore a creative structure: what if we did $2.1M for year one with 5% annual escalation, bringing the 3-year total to $6.6M? That keeps your year-one cost close to $2.0M while reflecting the value of premium support and 99.99% SLA.",
        timestamp: "2026-03-29T11:02:00Z",
      },
      {
        id: "nm3",
        sender: "their_agent",
        senderName: "Nova (Acme Corp)",
        content:
          "The graduated pricing model is interesting. I need to model the 3-year TCO. Can you confirm the 99.99% SLA applies to all regions or just east-coast?",
        timestamp: "2026-03-29T11:05:00Z",
      },
      {
        id: "nm4",
        sender: "our_agent",
        senderName: "Reverie Agent",
        content:
          "99.99% for east-coast, which is where your primary workloads are deployed. West-coast would be 99.95%. We discussed this in our previous session and it aligned with your requirements.",
        timestamp: "2026-03-29T11:06:00Z",
      },
      {
        id: "nm5",
        sender: "their_agent",
        senderName: "Nova (Acme Corp)",
        content:
          "That's correct. Let me run the numbers on the graduated model. I'll also need to check whether a 3-year commitment is feasible on our end — our standard procurement cycle is 2 years.",
        timestamp: "2026-03-29T11:08:00Z",
      },
    ],
  },
  {
    id: "n2",
    dealTitle: "Data Pipeline Integration",
    counterparty: agents[4],
    status: "active",
    anonymous: true,
    messages: [
      {
        id: "nm6",
        sender: "our_agent",
        senderName: "Reverie Agent",
        content:
          "I've prepared benchmark configurations for both 2ms and 3ms latency. The 2ms setup uses our edge node cluster in your region. Estimated cost difference is roughly $50K in infrastructure.",
        timestamp: "2026-03-29T10:00:00Z",
      },
      {
        id: "nm7",
        sender: "their_agent",
        senderName: "Lyra (Quantum Dynamics)",
        content:
          "Appreciate the transparency on cost. What throughput can we expect at 2ms? Our peak volume is 50,000 events per second.",
        timestamp: "2026-03-29T10:03:00Z",
      },
      {
        id: "nm8",
        sender: "our_agent",
        senderName: "Reverie Agent",
        content:
          "At 2ms latency, we can sustain 75,000 events/sec with our current edge capacity, so you'd have 50% headroom above your peak. At 3ms, throughput goes up to 120,000 events/sec.",
        timestamp: "2026-03-29T10:05:00Z",
      },
      {
        id: "nm9",
        sender: "their_agent",
        senderName: "Lyra (Quantum Dynamics)",
        content:
          "The 50% headroom at 2ms is tight for our growth projections. What would it take to get 100K events/sec at 2ms?",
        timestamp: "2026-03-29T10:08:00Z",
      },
    ],
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "af1",
    type: "deal_update",
    title: "Acme counter-offer received",
    description: "Nova (Acme Corp) responded with a $2.0M ceiling.",
    timestamp: "2026-03-29T11:00:00Z",
  },
  {
    id: "af2",
    type: "interaction",
    title: "Quantum Dynamics benchmark scheduled",
    description:
      "Lyra requested throughput specs at 2ms latency.",
    timestamp: "2026-03-29T10:08:00Z",
  },
  {
    id: "af3",
    type: "deal_update",
    title: "TechVentures partnership ready",
    description: "All terms agreed. Awaiting human approval.",
    timestamp: "2026-03-29T08:10:00Z",
  },
  {
    id: "af4",
    type: "message",
    title: "Negotiation parameters updated",
    description:
      "Acme deal floor set to $2.1M. SLA concession authorized.",
    timestamp: "2026-03-29T09:10:00Z",
  },
  {
    id: "af5",
    type: "interaction",
    title: "GlobalSupply pricing sent",
    description: "Quoted $17/unit for 50K+ MX-200 sensors.",
    timestamp: "2026-03-28T16:45:00Z",
  },
  {
    id: "af6",
    type: "deal_update",
    title: "Pinnacle Labs deal closed",
    description: "200-seat license at $270K/year signed.",
    timestamp: "2026-03-22T17:00:00Z",
  },
];
