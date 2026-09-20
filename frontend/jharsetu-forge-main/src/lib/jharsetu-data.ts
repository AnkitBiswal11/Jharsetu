export const DISTRICTS = [
  "Ranchi",
  "Khunti",
  "Dhanbad",
  "East Singhbhum",
  "West Singhbhum",
  "Bokaro",
  "Hazaribagh",
  "Gumla",
  "Dumka",
  "Deoghar",
  "Palamu",
  "Giridih",
  "Latehar",
  "Simdega",
  "Sahibganj",
  "Chatra",
];

export const DOMAINS = [
  "Water Resources",
  "Agriculture & Soil",
  "Rural Healthcare",
  "Clean Energy",
  "Tribal Livelihood",
  "Infrastructure",
  "Education Access",
] as const;

export type Domain = (typeof DOMAINS)[number];

export type Challenge = {
  id: string;
  title: string;
  domain: Domain;
  district: string;
  feasibility: number;
  summary: string;
  gap: string;
  deliverable: string;
  institute: string;
  csr: string;
  adopted: boolean;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "JS-26043-0117",
    title: "Low-cost fluoride remediation for hand-pump groundwater in Palamu belt",
    domain: "Water Resources",
    district: "Palamu",
    feasibility: 88,
    summary:
      "Field reports across 14 villages show fluoride above 1.8 mg/L. Existing activated-alumina units fail within 4 months due to un-monitored saturation.",
    gap: "No affordable saturation-indicator media validated for high-iron groundwater common to the Palamu plateau.",
    deliverable: "Working filter prototype + colorimetric saturation strip",
    institute: "BIT Mesra",
    csr: "Tata Steel Foundation",
    adopted: false,
  },
  {
    id: "JS-26043-0142",
    title: "Solar-thermal drying unit for lac and tasar produce in Khunti blocks",
    domain: "Tribal Livelihood",
    district: "Khunti",
    feasibility: 91,
    summary:
      "Monsoon spoilage removes an estimated 22% of raw lac value before it reaches the mandi. Open-sun drying is uneven and labour intensive.",
    gap: "Drying curve data for lac resin at sub-60°C is absent; no low-cost humidity control design exists for SHG scale.",
    deliverable: "Deployable 50 kg-batch dryer + SHG operating manual",
    institute: "NIT Jamshedpur",
    csr: "CCL CSR Cell",
    adopted: true,
  },
  {
    id: "JS-26043-0163",
    title: "Offline-first triage assistant for sub-centre ANMs in Gumla",
    domain: "Rural Healthcare",
    district: "Gumla",
    feasibility: 79,
    summary:
      "ANMs cover 6–9 hamlets with no continuous connectivity. Referral decisions for maternal risk cases are delayed by an average of 31 hours.",
    gap: "No validated offline decision protocol mapped to Jharkhand's HMIS referral codes.",
    deliverable: "Android offline app + field validation report",
    institute: "IIT ISM Dhanbad",
    csr: "SAIL Community Trust",
    adopted: false,
  },
  {
    id: "JS-26043-0188",
    title: "Mine-subsidence early warning using low-cost tilt sensor mesh, Jharia",
    domain: "Infrastructure",
    district: "Dhanbad",
    feasibility: 74,
    summary:
      "Residential clusters near abandoned galleries report progressive floor cracking. Manual survey cycles are quarterly at best.",
    gap: "Commercial tilt meters cost ₹40k/node; no ruggedised sub-₹3k node validated for coalfield thermal conditions.",
    deliverable: "Sensor node prototype + LoRa dashboard",
    institute: "IIT ISM Dhanbad",
    csr: "BCCL",
    adopted: false,
  },
  {
    id: "JS-26043-0201",
    title: "Micro-lift irrigation scheduling for upland paddy in Simdega",
    domain: "Agriculture & Soil",
    district: "Simdega",
    feasibility: 83,
    summary:
      "Upland plots depend on erratic lift pumping; farmers over-irrigate early and run dry at grain-fill, cutting yields by a third.",
    gap: "No locally calibrated soil-moisture threshold model for lateritic upland soils.",
    deliverable: "Scheduling model + SMS advisory pilot",
    institute: "BIT Mesra",
    csr: "Tata Steel Foundation",
    adopted: false,
  },
  {
    id: "JS-26043-0224",
    title: "Community mini-grid load balancing for tribal hamlets, Sahibganj",
    domain: "Clean Energy",
    district: "Sahibganj",
    feasibility: 86,
    summary:
      "Three pilot mini-grids trip nightly as households add unmetered loads. Battery cycle life has dropped below 40% of the rated figure.",
    gap: "Absence of an affordable prepaid load-limiter compatible with 48V DC hamlet grids.",
    deliverable: "Load-limiter hardware + tariff simulation",
    institute: "SUIIT Chaibasa",
    csr: "Coal India Ltd.",
    adopted: true,
  },
];

export const DOMAIN_ACCENT: Record<Domain, string> = {
  "Water Resources": "domain-water",
  "Agriculture & Soil": "domain-agri",
  "Rural Healthcare": "domain-health",
  "Clean Energy": "domain-energy",
  "Tribal Livelihood": "domain-livelihood",
  Infrastructure: "domain-infra",
  "Education Access": "domain-edu",
};
