export async function fetchGithubProject() {
  const res = await fetch('https://ma-portfolio-backend.onrender.com/api/github');
  if (!res.ok) throw new Error('Backend fetch failed');
  return await res.json();
}