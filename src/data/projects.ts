import { ImageAsset } from "../types";
import {
  landingPage,
  landingPageCard,
  twoDuLogin,
  twoDuLoginCard,
  limpHomepage,
  limpHomepageCard,
  keyvaultHomepage,
  keyvaultHomepageCard,
} from "./images";

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
  results: ProjectResult[];
  carbonFootprint: ProjectCarbonFootprint;
  summary: string;
  description: string;
  /** Full-size asset for the project detail hero. */
  image: ImageAsset;
  /** Smaller asset for the 325px home-page card. */
  cardImage: ImageAsset;
}

export interface ProjectSummary {
  id: number;
  slug: string;
  title: string;
  image: ImageAsset;
  liveUrl: string;
  role: string;
  year: number;
}

export const projectDetails: ProjectDetailData[] = [
  {
    id: 1,
    slug: "keyvault",
    title: "KeyVault",
    role: "Fullstack Development",
    year: 2025,
    services: [
      "Backend Architecture",
      "Database Engineering",
      "Fullstack Development",
    ],
    liveUrl: "https://keyv.vercel.app",
    results: [
      { label: "Automated Tests", value: "164" },
      { label: "Bundle Size (gzip)", value: "-48%" },
    ],
    carbonFootprint: {
      gramsCO2: 0.14,
      cleanerThanPercent: 85,
      sourceLabel: "Websitecarbon.com",
      sourceUrl: "https://www.websitecarbon.com/",
    },
    summary:
      "A digital game-key marketplace where concurrent buyers can never claim the same key twice.",
    description:
      "Checkout claims stock with PostgreSQL row-level locking, proven by a 164-test suite run against a real database, with idempotent Stripe fulfillment and ordered refunds.",
    image: keyvaultHomepage,
    cardImage: keyvaultHomepageCard,
  },

  {
    id: 2,
    slug: "2du",
    title: "2DU - Task Management",
    role: "Design & Development",
    year: 2026,
    services: ["Branding", "Web Design", "Full-stack Development"],
    liveUrl: "https://jxstin-potter.github.io/2DU/login",
    results: [
      { label: "Avg. Session Time", value: "3:42" },
      { label: "Project Inquiries", value: "+64%" },
    ],
    carbonFootprint: {
      gramsCO2: 0.1,
      cleanerThanPercent: 92,
      sourceLabel: "Websitecarbon.com",
      sourceUrl: "https://www.websitecarbon.com/",
    },
    summary: "A minimal, experience-driven task management system",
    description:
      "Built to showcase product and engineering work with fast load times, a flexible layout system, and a motion language inspired by editorial design.",
    image: twoDuLogin,
    cardImage: twoDuLoginCard,
  },
  {
    id: 3,
    slug: "limprimerie-bakery",
    title: "Limprimerie - Bakery",
    role: "Product Design",
    year: 2026,
    services: ["Product Strategy", "UX Design", "UI Systems"],
    liveUrl: "#",
    results: [
      { label: "Teams Onboarded", value: "210+" },
      { label: "Avg. Tasks / Week", value: "1.8k" },
    ],
    carbonFootprint: {
      gramsCO2: 0.15,
      cleanerThanPercent: 80,
      sourceLabel: "Websitecarbon.com",
      sourceUrl: "https://www.websitecarbon.com/",
    },
    summary:
      "A user-centered bakery experience designed to make ordering, browsing, and discovery feel effortless.",
    description:
      "Built for a modern bakery audience, the UX focuses on warm visual storytelling, clear product hierarchy, and frictionless flows so customers can explore the menu, place orders, and return with ease.",
    image: limpHomepage,
    cardImage: limpHomepageCard,
  },
  {
    id: 4,
    slug: "api-dashboard",
    title: "API Dashboard",
    role: "Frontend Engineering",
    year: 2024,
    services: ["UI Engineering", "Data Visualization", "Design Systems"],
    liveUrl: "#",
    results: [
      { label: "Latency Reduction", value: "35%" },
      { label: "Dashboard Adoption", value: "4x" },
    ],
    carbonFootprint: {
      gramsCO2: 0.2,
      cleanerThanPercent: 74,
      sourceLabel: "Websitecarbon.com",
      sourceUrl: "https://www.websitecarbon.com/",
    },
    summary:
      "A telemetry dashboard that translates complex API data into clear insights.",
    description:
      "The dashboard pairs dense data with a flexible system of charts, filters, and alerts to help teams monitor their critical endpoints in real time.",
    image: landingPage,
    cardImage: landingPageCard,
  },
  {
    id: 5,
    slug: "new-project",
    title: "New Project",
    role: "Creative Direction",
    year: 2024,
    services: ["Creative Direction", "Prototype", "Brand Systems"],
    liveUrl: "#",
    results: [
      { label: "Prototype Users", value: "150+" },
      { label: "Engagement Rate", value: "62%" },
    ],
    carbonFootprint: {
      gramsCO2: 0.18,
      cleanerThanPercent: 82,
      sourceLabel: "Websitecarbon.com",
      sourceUrl: "https://www.websitecarbon.com/",
    },
    summary:
      "An experimental experience exploring interaction and brand storytelling.",
    description:
      "New Project is a sandbox for testing emerging interaction patterns and storytelling mechanics ahead of a full release.",
    image: landingPage,
    cardImage: landingPageCard,
  },
];

export const projectSummaries: ProjectSummary[] = projectDetails.map(
  (project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    image: project.cardImage,
    liveUrl: project.liveUrl,
    role: project.role,
    year: project.year,
  }),
);

export const getProjectBySlug = (slug: string) =>
  projectDetails.find((project) => project.slug === slug);

export const getNextProjects = (
  slug: string,
  count = 3,
): ProjectDetailData[] => {
  const currentIndex = projectDetails.findIndex(
    (project) => project.slug === slug,
  );
  if (currentIndex === -1) return projectDetails.slice(0, count);

  const nextProjects: ProjectDetailData[] = [];
  for (let offset = 1; offset <= count; offset += 1) {
    const nextIndex = (currentIndex + offset) % projectDetails.length;
    nextProjects.push(projectDetails[nextIndex]);
  }
  return nextProjects;
};
