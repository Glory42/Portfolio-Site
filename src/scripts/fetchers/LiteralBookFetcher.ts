import type { LiteralReadingState } from "../../types/Book.ts";

export async function fetchCurrentlyReading(): Promise<LiteralReadingState[]> {
    try {   
        const res = await fetch('https://ma-portfolio-backend.onrender.com/api/literal', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`Backend fetch failed: ${res.status}`);

        const books: LiteralReadingState[] = await res.json();
        return books.slice(0, 3);
    } catch (err) {           
        console.error('Error fetching Literal books: ', err);
        return [];
    }
}
