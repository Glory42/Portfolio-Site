import type { LiteralReadingState } from "../../types/Book.ts";

export async function fetchCurrentlyReading(): Promise<void> {
    const readingContainer = document.getElementById('reading-books');
    if (!readingContainer) return;

    try {
        const res = await fetch('https://ma-portfolio-backend.onrender.com/api/literal', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            readingContainer.innerHTML = 'Error loading books';
            console.error('Backend error:', await res.text());
            return;
        }

        const books: LiteralReadingState[] = await res.json();
        const limited = books.slice(0, 3);

        if (!limited.length) {
            readingContainer.innerHTML = `<li class="text-amber-200">📚 Not currently reading any book</li>`;
            return;
        }

        const html = limited.map(book => `
            <li class="w-60 min-h-[280px] p-4 flex flex-col justify-between items-center transition-transform hover:-translate-y-0.5">
                <img 
                    src="${book.book.cover}" 
                    class="w-60 h-80 object-cover rounded-md mb-3 hover:scale-105 transition-transform"
                />
            </li>
        `).join('');

        readingContainer.innerHTML = html;
    } catch (err) {
        console.error('Error fetching Literal books: ', err);
        const container = document.getElementById('reading-books');
        if (container) container.innerHTML = 'Error loading books';
    }
}
