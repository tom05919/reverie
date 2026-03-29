import type { NegotiationScenario } from "@/lib/types";

export const scenarios: NegotiationScenario[] = [
  {
    id: "cloud-infrastructure",
    title: "Q3 Cloud Infrastructure Contract",
    description:
      "Multi-year cloud hosting deal. Reverie is selling infrastructure services to Acme Corp. Key sticking points: annual fee, SLA uptime, and contract length.",
    agentA: {
      companyName: "Reverie",
      agentName: "Reverie Agent",
      role: "seller",
      objectives: [
        "Secure annual fee of at least $2.1M",
        "Lock in a 3-year contract for revenue predictability",
        "Keep SLA commitment at 99.95% unless needed as a concession",
      ],
      constraints: {
        priceFloor: 2_100_000,
        mustHaves: [
          "Minimum 2-year contract",
          "Premium support tier included in pricing",
        ],
        walkAwayConditions: [
          "Annual fee drops below $2.0M",
          "Contract term less than 2 years",
        ],
      },
      style: "balanced",
      dealContext:
        "Acme Corp needs cloud capacity for their east-coast data center expansion. They have budget pressure this quarter but the deal is strategic. Our cost floor is $2.0M. The SLA ask of 99.99% is technically achievable for east-coast. We offered $2.4M with premium support; they countered at $1.8M for 2 years.",
    },
    agentB: {
      companyName: "Acme Corp",
      agentName: "Nova",
      role: "buyer",
      objectives: [
        "Keep annual cost at or below $2.0M",
        "Secure 99.99% SLA for east-coast operations",
        "Maintain flexibility with a 2-year commitment maximum",
      ],
      constraints: {
        priceCeiling: 2_200_000,
        mustHaves: [
          "99.99% uptime SLA for east-coast region",
          "Premium support tier",
        ],
        walkAwayConditions: [
          "Annual fee exceeds $2.2M",
          "SLA below 99.95% for east-coast",
        ],
      },
      style: "collaborative",
      dealContext:
        "We need cloud infrastructure for our east-coast data center expansion. Our CFO set a hard ceiling at $2.0M annually, but we have some flexibility up to $2.2M if we get strong SLA and support terms. The vendor's initial ask was $2.6M which we countered at $1.8M. We prefer a 2-year term to align with our procurement cycle.",
    },
    anonymous: true,
  },
  {
    id: "data-pipeline",
    title: "Data Pipeline Integration",
    description:
      "Quantum Dynamics wants to integrate Reverie's real-time data pipeline into their trading infrastructure. Key issues: latency SLA, throughput, and pricing.",
    agentA: {
      companyName: "Reverie",
      agentName: "Reverie Agent",
      role: "seller",
      objectives: [
        "Close integration deal at $350K or above",
        "Set latency SLA at 3ms to manage infrastructure costs",
        "Offer 90-day data retention as standard",
      ],
      constraints: {
        priceFloor: 300_000,
        mustHaves: ["Minimum 90-day data retention in contract"],
        walkAwayConditions: [
          "Price below $280K",
          "Latency SLA below 2ms without additional pricing",
        ],
      },
      style: "balanced",
      dealContext:
        "Quantum Dynamics wants sub-2ms latency for their trading systems. We can deliver 2ms with edge nodes but it increases cost by ~$50K. At 3ms we sustain 120K events/sec; at 2ms only 75K. Their peak is 50K events/sec. We proposed 3ms at $350K as a compromise. The 180-day retention they want is low-cost for us.",
    },
    agentB: {
      companyName: "Quantum Dynamics",
      agentName: "Lyra",
      role: "buyer",
      objectives: [
        "Achieve sub-2ms latency for trading operations",
        "Ensure throughput of at least 100K events/sec for growth",
        "Keep total cost under $350K",
      ],
      constraints: {
        priceCeiling: 380_000,
        mustHaves: [
          "Latency at or below 3ms",
          "180-day data retention",
          "Throughput above 50K events/sec",
        ],
        walkAwayConditions: [
          "Latency above 5ms",
          "Price exceeds $400K",
          "No path to sub-2ms in future",
        ],
      },
      style: "aggressive",
      dealContext:
        "Our trading systems need ultra-low latency. Our peak volume is 50K events/sec now but growth projections hit 100K within 18 months. The vendor offers 75K at 2ms or 120K at 3ms. We have competing bids but none match their technical capability. Budget is flexible up to $380K if we get the specs we need.",
    },
    anonymous: true,
  },
  {
    id: "bulk-components",
    title: "Bulk Component Pricing Agreement",
    description:
      "GlobalSupply Co wants to buy 50,000 sensor components at volume pricing. Negotiating unit price, minimum order quantity, and delivery window.",
    agentA: {
      companyName: "Reverie",
      agentName: "Reverie Agent",
      role: "seller",
      objectives: [
        "Sell MX-200 sensors at $15.50/unit or above for 50K+ orders",
        "Establish minimum order quantity of 50,000 units",
        "Maintain 8-week delivery window",
      ],
      constraints: {
        priceFloor: 14_00,
        mustHaves: [
          "Minimum order of 25,000 units",
          "Payment terms of net-30",
        ],
        walkAwayConditions: [
          "Unit price below $14",
          "Delivery window less than 5 weeks",
        ],
      },
      style: "collaborative",
      dealContext:
        "GlobalSupply Co is a new client with high growth potential. We quoted $17/unit for 50K+ orders. They have competing overseas offers at ~$13/unit but with 12-week lead times. We can go to $15.50 to win the account. Our cost basis is about $12/unit. This could be a gateway to a 100K+ annual relationship.",
    },
    agentB: {
      companyName: "GlobalSupply Co",
      agentName: "Atlas",
      role: "buyer",
      objectives: [
        "Secure unit price of $15/unit or below",
        "Start with 25,000 units as initial order with option to scale",
        "Get 6-week delivery window",
      ],
      constraints: {
        priceCeiling: 16_50,
        mustHaves: ["Consistent quality certification", "Delivery within 8 weeks"],
        walkAwayConditions: [
          "Unit price above $17",
          "Minimum order above 50,000 for first purchase",
          "Delivery window exceeds 10 weeks",
        ],
      },
      style: "balanced",
      dealContext:
        "We need 50,000 MX-200 sensor units but want to start smaller to validate quality. We have an overseas offer at $13/unit but 12-week delivery is too slow. Domestic supply at $17 is too high. We are targeting $14-15 per unit and want flexibility on the initial order size.",
    },
    anonymous: true,
  },
];

export function getScenario(id: string): NegotiationScenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function listScenarios(): { id: string; title: string; description: string }[] {
  return scenarios.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
  }));
}
