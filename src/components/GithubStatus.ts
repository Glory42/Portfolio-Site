interface ContributionDay {
    date: string;
    contributionCount: number;
    color: string;
}

interface Week {
    contributionDays: ContributionDay[];
}

interface ContributionCalendar {
    weeks: Week[];
}

interface ContributionsCollection {
    contributionCalendar: ContributionCalendar;
}

interface User {
    contributionsCollection: ContributionsCollection;
}

export async function fetchContributions(): Promise<void> {
    console.log('Environment variables:', import.meta.env);
    const username = 'Glory42'; 
    const token = import.meta.env.GITHUB_TOKEN;

    console.log('Token loaded:', !!token);

    const contributionsGrid = document.getElementById('contributions-grid');
    if (!contributionsGrid) {
        console.error('Contributions grid element not found!');
        return;
    }

    if (!token || token === undefined || token === 'your_new_token_here' || token === 'ghp_YOUR_ACTUAL_TOKEN_HERE') {
        contributionsGrid.innerHTML = 'Please set a valid GitHub token in .env file!';
        console.error('GitHub token not found or invalid. Available env:', import.meta.env);
        return;
    }

    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1); 
    const toDate = new Date();
    const from = fromDate.toISOString();
    const to = toDate.toISOString();

    const query = `
        query {
            user(login: "${username}") {
                contributionsCollection(from: "${from}", to: "${to}") {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                                color
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
            },
            body: JSON.stringify({ query }),
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
            const responseText = await response.text();
            console.log('Response text:', responseText);
            throw new Error(`HTTP error! status: ${response.status} - ${responseText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        const calendar = data.data.user.contributionsCollection.contributionCalendar;
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
                        let colorClass = 'bg-gray-600 border-gray-600'; 
                        if (count > 0) colorClass = 'bg-[#0e4429] border-[#0e4429]'; 
                        if (count >= 4) colorClass = 'bg-[#006d32] border-[#006d32]'; 
                        if (count >= 7) colorClass = 'bg-[#26a641] border-[#26a641]'; 
                        if (count >= 10) colorClass = 'bg-[#39d353] border-[#39d353]'; 
                        
                        grid[row][col] = `<div class="w-2.5 h-2.5 ${colorClass} hover:opacity-10 transition-opacity duration-150" title="${day.date}: ${count} contributions"></div>`;
                    } else {
                        grid[row][col] = `<div class="w-2.5 h-2.5 bg-gray-600 border border-gray-600 hover:opacity-10 transition-opacity duration-150" title="No data"></div>`;
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