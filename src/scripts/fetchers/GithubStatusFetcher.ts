import type { Week, ContributionDay } from '../../types/Status.js'

export async function fetchContributions(): Promise<void> {
    const contributionsGrid = document.getElementById('contributions-grid');
    if (!contributionsGrid) return;

    try {
        const response = await fetch('https://ma-portfolio-backend.onrender.com/api/github-status');
        if (!response.ok) {
            contributionsGrid.innerHTML = 'Error loading contributions';
            console.error('Backend error:', await response.text());
            return;
        }

        const calendar = await response.json();

        let gridHTML = '';
        const maxWeeks = calendar.weeks.length;
        const grid = Array(7).fill(null).map(() => Array(maxWeeks).fill(null));

        calendar.weeks.forEach((week: Week, weekIndex: number) => {
            const fullWeek = Array(7).fill(null);

            week.contributionDays.forEach((day: ContributionDay, dayIndex: number) => {
                fullWeek[dayIndex] = day;
            });

            fullWeek.forEach((day: ContributionDay | null, dayIndex: number) => {
                const col = weekIndex;
                const row = dayIndex;

                if (row < 7 && col < maxWeeks) {
                    if (day) {
                        const count = day.contributionCount;
                        let colorClass = 'bg-gray-600';
                        if (count > 0) colorClass = 'bg-[#0e4429]';
                        if (count >= 4) colorClass = 'bg-[#006d32]';
                        if (count >= 7) colorClass = 'bg-[#26a641]';
                        if (count >= 10) colorClass = 'bg-[#39d353]';
                        grid[row][col] = `<div class="w-2.5 h-2.5 ${colorClass} hover:opacity-10 transition-opacity duration-150" title="${day.date}: ${count} contributions"></div>`;
                    } else {
                        grid[row][col] = `<div class="w-2.5 h-2.5 bg-gray-600 hover:opacity-10 transition-opacity duration-150" title="No data"></div>`;
                    }
                }
            });
        });

        gridHTML = grid.map(row => `<div class="flex gap-0.5 justify-center">${row.join('')}</div>`).join('');
        contributionsGrid.innerHTML = gridHTML;

    } catch (error) {
        console.error('Error fetching contributions:', error);
        contributionsGrid.innerHTML = 'Error loading contributions';
    }
}
