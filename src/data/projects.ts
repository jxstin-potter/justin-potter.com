import projectHeroImage from '../assets/landingpage.png';
import twoDuLoginImage from '../assets/2du-login.png';
// import limprHeroImage from '../assets/limp-landingpage';

export interface ProjectResult {
  label: string;
  value: string;
}

export interface ProjectCarbonFootprint {
  gramsCO2: number;
  cleanerThanPercent: number;
  sourceLabel: string;
  sourceUrl: string;
}

export interface ProjectDetailData {
  id: number;
  slug: string;
  title: string;
  role: string;
  year: number;
  services: string[];
  liveUrl: string;
  awards: string[];
  results: ProjectResult[];
  carbonFootprint: ProjectCarbonFootprint;
  summary: string;
  description: string;
  imageUrl: string;
}

export interface ProjectSummary {
  id: number;
  slug: string;
  title: string;
  imageUrl: string;
  liveUrl: string;
  role: string;
  year: number;
}

export const projectDetails: ProjectDetailData[] = [
  {
    id: 1,
    slug: 'commerceflow',
    title: 'CommerceFlow',
    role: 'Fullstack Development',
    year: 2025, services: ['Branding', 'Product Design', 'Fullstack Development'],
    liveUrl: 'https://commerce-flow-v2.vercel.app/',
    awards: ['Featured on Awwwards (Concept)'],
    results: [
      { label: 'Monthly Active Users', value: '12k+' },
      { label: 'Checkout Conversion', value: '+18%' },
    ],
    carbonFootprint: {
      gramsCO2: 0.12,
      cleanerThanPercent: 86,
      sourceLabel: 'Websitecarbon.com',
      sourceUrl: 'https://www.websitecarbon.com/', }, summary: 'A commerce platform focused on frictionless checkout and modern retail UX.', description: '', imageUrl: projectHeroImage, },

      {
        id: 2,
        slug: '2du',
        title: '2DU - Task Management',
        role: 'Design & Development',
        year: 2026,
        services: ['Branding', 'Web Design', 'Full-stack Development'],
        liveUrl: 'https://jxstin-potter.github.io/2DU/login',
        awards: ['CSS Design Awards (Shortlist)'],
        results: [
      { label: 'Avg. Session Time', value: '3:42' },
      { label: 'Project Inquiries', value: '+64%' },
    ],
    carbonFootprint: {
      gramsCO2: 0.1,
      cleanerThanPercent: 92,
      sourceLabel: 'Websitecarbon.com',
      sourceUrl: 'https://www.websitecarbon.com/',
    },
    summary:
      'A minimal, experience-driven task management system',
    description:
      'Built to showcase product and engineering work with fast load times, a flexible layout system, and a motion language inspired by editorial design.',
    imageUrl: twoDuLoginImage,
  },
  {
    id: 3,
    slug: 'limprimerie-bakery',
    title: 'Limprimerie - Bakery',
    role: 'Product Design',
    year: 2025,
    services: ['Product Strategy', 'UX Design', 'UI Systems'],
    liveUrl: '#',
    awards: ['Product Hunt (Top 10)'],
    results: [
      { label: 'Teams Onboarded', value: '210+' },
      { label: 'Avg. Tasks / Week', value: '1.8k' },
    ],
    carbonFootprint: {
      gramsCO2: 0.15,
      cleanerThanPercent: 80,
      sourceLabel: 'Websitecarbon.com',
      sourceUrl: 'https://www.websitecarbon.com/',
    },
    summary:
      'A task system designed to keep fast-moving teams aligned and focused.',
    description:
      'Task Manager introduces contextual prioritization and a calm UI to reduce operational noise across distributed teams.',
    imageUrl: projectHeroImage,
  },
  {
    id: 4,
    slug: 'api-dashboard',
    title: 'API Dashboard',
    role: 'Frontend Engineering',
    year: 2024,
    services: ['UI Engineering', 'Data Visualization', 'Design Systems'],
    liveUrl: '#',
    awards: [],
    results: [
      { label: 'Latency Reduction', value: '35%' },
      { label: 'Dashboard Adoption', value: '4x' },
    ],
    carbonFootprint: {
      gramsCO2: 0.2,
      cleanerThanPercent: 74,
      sourceLabel: 'Websitecarbon.com',
      sourceUrl: 'https://www.websitecarbon.com/',
    },
    summary:
      'A telemetry dashboard that translates complex API data into clear insights.',
    description:
      'The dashboard pairs dense data with a flexible system of charts, filters, and alerts to help teams monitor their critical endpoints in real time.',
    imageUrl: projectHeroImage,
  },
  {
    id: 5,
    slug: 'new-project',
    title: 'New Project',
    role: 'Creative Direction',
    year: 2024,
    services: ['Creative Direction', 'Prototype', 'Brand Systems'],
    liveUrl: '#',
    awards: [],
    results: [
      { label: 'Prototype Users', value: '150+' },
      { label: 'Engagement Rate', value: '62%' },
    ],
    carbonFootprint: {
      gramsCO2: 0.18,
      cleanerThanPercent: 82,
      sourceLabel: 'Websitecarbon.com',
      sourceUrl: 'https://www.websitecarbon.com/',
    },
    summary:
      'An experimental experience exploring interaction and brand storytelling.',
    description:
      'New Project is a sandbox for testing emerging interaction patterns and storytelling mechanics ahead of a full release.',
    imageUrl: projectHeroImage,
  },
];

export const projectSummaries: ProjectSummary[] = projectDetails.map((project) => ({
  id: project.id,
  slug: project.slug,
  title: project.title,
  imageUrl: project.imageUrl,
  liveUrl: project.liveUrl,
  role: project.role,
  year: project.year,
}));

export const getProjectBySlug = (slug: string) =>
  projectDetails.find((project) => project.slug === slug);

export const getNextProjects = (slug: string, count = 3): ProjectDetailData[] => {
  const currentIndex = projectDetails.findIndex((project) => project.slug === slug);
  if (currentIndex === -1) return projectDetails.slice(0, count);

  const nextProjects: ProjectDetailData[] = [];
  for (let offset = 1; offset <= count; offset += 1) {
    const nextIndex = (currentIndex + offset) % projectDetails.length;
    nextProjects.push(projectDetails[nextIndex]);
  }
  return nextProjects;
};
