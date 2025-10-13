import type { Project } from "../../types/Project.ts";

export async function fetchGithubProject(): Promise<Project[]> {
  try {
    const res = await fetch('https://your-backend-domain.com/api/projects', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`Backend fetch failed: ${res.status}`);

    const projects: Project[] = await res.json(); // typed here
    return projects;
  } catch (err) {
    console.error('error fetching projects: ', err);
    return [];
  }
};
