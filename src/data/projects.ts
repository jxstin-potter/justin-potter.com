import { ImageAsset } from "../types";
import {
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
    // Not /login: GitHub Pages has no server-side routing, so every deep link
    // resolves through 404.html and returns HTTP 404 even though the SPA then
    // renders fine. The root returns 200 and the auth guard redirects to
    // /login anyway, so this is the same destination without the 404.
    liveUrl: "https://jxstin-potter.github.io/2DU/",
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
    liveUrl: "https://jxstin-potter.github.io/Limprimerie-Bakery-Website/",
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

  // Never wrap back around to the current project, even when the list is
  // shorter than the requested count.
  const limit = Math.min(count, projectDetails.length - 1);
  const nextProjects: ProjectDetailData[] = [];
  for (let offset = 1; offset <= limit; offset += 1) {
    const nextIndex = (currentIndex + offset) % projectDetails.length;
    nextProjects.push(projectDetails[nextIndex]);
  }
  return nextProjects;
};
