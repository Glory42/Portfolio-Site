export type LiteralBook = {
    id: string;
    cover: string;
    pageCount: number;
};

export type LiteralReadingState = {
    status: 'WANTS_TO_READ' | 'IS_READING' | 'FINISHED' | 'DROPPED' | 'NONE';
    book: LiteralBook;
};
