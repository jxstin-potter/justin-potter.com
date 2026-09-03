import {
  projectDetails,
  projectSummaries,
  getProjectBySlug,
  getNextProjects,
} from "./projects";
import { ImageAsset } from "../types";

describe("getProjectBySlug", () => {
  it("finds a project by its slug", () => {
    const project = getProjectBySlug("2du");
    expect(project).toBeDefined();
    expect(project?.slug).toBe("2du");
  });

  it("returns undefined for a slug that does not exist", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("resolves every slug in the data set", () => {
    projectDetails.forEach((project) => {
      expect(getProjectBySlug(project.slug)).toBe(project);
    });
  });

  it("is case sensitive, matching how the route param arrives", () => {
    expect(getProjectBySlug("2DU")).toBeUndefined();
  });
});

describe("getNextProjects", () => {
  it("returns three projects by default", () => {
    expect(getNextProjects("keyvault")).toHaveLength(3);
  });

  it("starts from the project after the given slug", () => {
    const [first] = getNextProjects("keyvault");
    expect(first.slug).toBe(projectDetails[1].slug);
  });

  it("never includes the project it was asked about", () => {
    projectDetails.forEach((project) => {
      const slugs = getNextProjects(project.slug).map((p) => p.slug);
      expect(slugs).not.toContain(project.slug);
    });
  });

  it("wraps around past the end of the list", () => {
    const last = projectDetails[projectDetails.length - 1];
    const slugs = getNextProjects(last.slug).map((p) => p.slug);
    expect(slugs).toEqual([
      projectDetails[0].slug,
      projectDetails[1].slug,
      projectDetails[2].slug,
    ]);
  });

  it("falls back to the first projects for an unknown slug", () => {
    expect(getNextProjects("does-not-exist").map((p) => p.slug)).toEqual(
      projectDetails.slice(0, 3).map((p) => p.slug),
    );
  });

  it("honours a custom count", () => {
    expect(getNextProjects("keyvault", 1)).toHaveLength(1);
    expect(getNextProjects("keyvault", 4)).toHaveLength(4);
  });

  it("returns nothing when asked for nothing", () => {
    expect(getNextProjects("keyvault", 0)).toEqual([]);
  });
});

describe("project data integrity", () => {
  it("has unique ids", () => {
    const ids = projectDetails.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique slugs", () => {
    const slugs = projectDetails.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses url-safe slugs", () => {
    projectDetails.forEach((project) => {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it("gives every project the fields the detail page renders", () => {
    projectDetails.forEach((project) => {
      expect(project.title).toBeTruthy();
      expect(project.role).toBeTruthy();
      expect(typeof project.year).toBe("number");
      expect(project.services.length).toBeGreaterThan(0);
      expect(project.liveUrl).toBeTruthy();
    });
  });

  it("derives one summary per project, carrying the card image", () => {
    expect(projectSummaries).toHaveLength(projectDetails.length);
    projectSummaries.forEach((summary, index) => {
      expect(summary.slug).toBe(projectDetails[index].slug);
      expect(summary.image).toBe(projectDetails[index].cardImage);
    });
  });
});

// Jest stubs asset imports to their filename, so these assertions see the real
// file each field points at. This guards the bug that made the <picture>
// element serve WebP bytes from a source declared type="image/avif".
describe("image asset wiring", () => {
  const allAssets: Array<[string, ImageAsset]> = projectDetails.flatMap((p) => [
    [`${p.slug} image`, p.image],
    [`${p.slug} cardImage`, p.cardImage],
  ]);

  const stem = (filename: string) => filename.replace(/\.[^.]+$/, "");

  it.each(allAssets)("%s points each field at its own format", (_label, a) => {
    expect(a.src).toMatch(/\.jpg$/);
    expect(a.webpSrc).toMatch(/\.webp$/);
    expect(a.avifSrc).toMatch(/\.avif$/);
  });

  it.each(allAssets)("%s uses one image across all three formats", (_l, a) => {
    expect(stem(a.webpSrc)).toBe(stem(a.src));
    expect(stem(a.avifSrc)).toBe(stem(a.src));
  });

  it("gives the home page card a different, smaller asset than the detail hero", () => {
    projectDetails.forEach((project) => {
      expect(project.cardImage.src).not.toBe(project.image.src);
    });
  });
});
