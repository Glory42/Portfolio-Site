import type { Project } from "../../types/Project.ts";

export async function fetchGithubProjects(): Promise<void> {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;

  try {
    const response = await fetch('https://ma-portfolio-backend.onrender.com/api/github', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      projectsContainer.innerHTML = 'Error loading projects';
      return;
    }

    const projects = await response.json();
    projectsContainer.innerHTML = projects.map((p: any) => `
      <div class="w-80 min-h-[220px] border-2 border-gray-700 rounded-3xl p-4 flex flex-col 
      justify-between hover:bg-gray-900 transition-transform hover:-translate-y-0.5 shadow-[0_2px_5px_rgba(0,0,0,0.3)]">
        <h3 class="text-lg font-semibold">${p.name}</h3>
        <p class="text-gray-400">${p.description}</p>
        <a href="${p.html_url}" target="_blank" class="text-amber-200 hover:text-amber-400">View on GitHub</a>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error fetching projects:', error);
    projectsContainer.innerHTML = 'Error loading projects';
  }
}
