export interface PastProject {
  id: string;
  title: string;
  type: 'Virtual Twin' | 'CAD Integration' | 'Configurator' | 'VR Experience' | 'PLM Migration';
  year: string;
  status: 'Delivered' | 'Ongoing' | 'In Review';
  description: string;
  highlights: string[];
  value: string; // budget range
}

export interface ClientRecord {
  companyName: string;
  accountManager: string;
  since: string;
  projects: PastProject[];
}

// Keyed by lowercase company name (partial match supported)
export const CLIENT_RECORDS: ClientRecord[] = [
  {
    companyName: 'BMW Group',
    accountManager: 'Sophie Laurent',
    since: '2019',
    projects: [
      {
        id: 'bmw-001',
        title: 'iX3 Commercial Virtual Twin',
        type: 'Virtual Twin',
        year: '2023',
        status: 'Delivered',
        description: 'End-to-end Virtual Twin for the iX3 across 4 body variants, covering exterior and interior soft parts.',
        highlights: ['4 body variants', '12 exterior colors', 'Real-time web configurator', 'EU & APAC markets'],
        value: '$38,000–$45,000',
      },
      {
        id: 'bmw-002',
        title: '5-Series G60 CAD Integration',
        type: 'CAD Integration',
        year: '2022',
        status: 'Delivered',
        description: 'CATIA V5 to 3DEXPERIENCE migration for the G60 5-Series production model hierarchy.',
        highlights: ['CATIA V5 source', '3 trim levels', 'Automated LOD pipeline', 'ISO 26262 compliance'],
        value: '$24,000–$28,000',
      },
    ],
  },
  {
    companyName: 'Mercedes-Benz',
    accountManager: 'Marco Rossi',
    since: '2020',
    projects: [
      {
        id: 'mb-001',
        title: 'EQS Interior Configurator VR',
        type: 'VR Experience',
        year: '2023',
        status: 'Delivered',
        description: 'Photorealistic VR configurator for the EQS interior, deployed at 22 dealerships across Europe.',
        highlights: ['30 interior options', 'Real-time material swap', 'Oculus & HTC Vive', '22 dealerships'],
        value: '$52,000–$60,000',
      },
      {
        id: 'mb-002',
        title: 'C-Class W206 Virtual Twin',
        type: 'Virtual Twin',
        year: '2022',
        status: 'Delivered',
        description: 'Commercial Virtual Twin covering the W206 C-Class full variant lineup for the North American market.',
        highlights: ['6 body styles', '18 colors', 'STEP & JT formats', 'NA market'],
        value: '$41,000–$48,000',
      },
    ],
  },
  {
    companyName: 'Mahindra',
    accountManager: 'Priya Sharma',
    since: '2021',
    projects: [
      {
        id: 'mah-001',
        title: 'Scorpio-N Virtual Twin',
        type: 'Virtual Twin',
        year: '2023',
        status: 'Delivered',
        description: 'Full exterior Virtual Twin for the Scorpio-N, covering 5 trims and 8 exterior colors for the Indian market.',
        highlights: ['5 trim levels', '8 exterior colors', 'India & ME markets', 'JT format'],
        value: '$28,000–$34,000',
      },
      {
        id: 'mah-002',
        title: 'XEV 9e Configurator',
        type: 'Configurator',
        year: '2024',
        status: 'Ongoing',
        description: 'Web-based real-time configurator for the new XEV 9e electric SUV launch.',
        highlights: ['6 color options', '3 trim grades', 'WebGL render', 'Global launch'],
        value: '$35,000–$42,000',
      },
    ],
  },
  {
    companyName: 'Mahindra and Mahindra',
    accountManager: 'Priya Sharma',
    since: '2021',
    projects: [
      {
        id: 'mah-001',
        title: 'Scorpio-N Virtual Twin',
        type: 'Virtual Twin',
        year: '2023',
        status: 'Delivered',
        description: 'Full exterior Virtual Twin for the Scorpio-N, covering 5 trims and 8 exterior colors for the Indian market.',
        highlights: ['5 trim levels', '8 exterior colors', 'India & ME markets', 'JT format'],
        value: '$28,000–$34,000',
      },
      {
        id: 'mah-002',
        title: 'XEV 9e Configurator',
        type: 'Configurator',
        year: '2024',
        status: 'Ongoing',
        description: 'Web-based real-time configurator for the new XEV 9e electric SUV launch.',
        highlights: ['6 color options', '3 trim grades', 'WebGL render', 'Global launch'],
        value: '$35,000–$42,000',
      },
    ],
  },
  {
    companyName: 'Tata Motors',
    accountManager: 'Rohan Mehta',
    since: '2022',
    projects: [
      {
        id: 'tata-001',
        title: 'Nexon EV Max Virtual Twin',
        type: 'Virtual Twin',
        year: '2023',
        status: 'Delivered',
        description: 'Exterior and interior Virtual Twin for Nexon EV Max with soft-parts modeling.',
        highlights: ['4 trim levels', '7 colors', 'Interior soft parts', 'India market'],
        value: '$26,000–$31,000',
      },
    ],
  },
  {
    companyName: 'Hyundai',
    accountManager: 'Ji-woo Park',
    since: '2020',
    projects: [
      {
        id: 'hyu-001',
        title: 'IONIQ 6 Commercial VT',
        type: 'Virtual Twin',
        year: '2022',
        status: 'Delivered',
        description: 'Commercial Virtual Twin for the IONIQ 6 covering global markets and 3 body derivatives.',
        highlights: ['3 derivatives', '12 colors', 'EU / NA / APAC', 'STEP format'],
        value: '$44,000–$50,000',
      },
      {
        id: 'hyu-002',
        title: 'Tucson PLM Migration',
        type: 'PLM Migration',
        year: '2023',
        status: 'Delivered',
        description: 'Full PLM migration of Tucson model hierarchy from legacy system to 3DEXPERIENCE.',
        highlights: ['4 body types', '22 markets', 'Full traceability', 'ISO 27001'],
        value: '$31,000–$38,000',
      },
    ],
  },
];

/** Find a client record by fuzzy company name match */
export function findClientRecord(companyName: string): ClientRecord | null {
  const q = companyName.toLowerCase().trim();
  return (
    CLIENT_RECORDS.find(
      (r) =>
        r.companyName.toLowerCase() === q ||
        r.companyName.toLowerCase().includes(q) ||
        q.includes(r.companyName.toLowerCase())
    ) ?? null
  );
}
