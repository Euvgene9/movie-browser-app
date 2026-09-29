// OMDb search result item (from GET /media/search)
export interface OmdbSearchItem {
    Title: string;
    Year: string;
    imdbID: string;
    Type: 'movie' | 'series' | 'episode';
    Poster: string; // "N/A" when missing - handle this explicitly in UI
}

export interface OmdbSearchResponse {
    Search: OmdbSearchItem[];
    totalResults: string;
    Response: 'True' | 'False';
}

// Full title details (from GET /media/details)
export interface OmdbTitleDetails {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string; // comma-separated, e.g. "Action, Crime, Drama"
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Poster: string;
    imdbRating: string;
    imdbID: string;
    Type: 'movie' | 'series' | 'episode';
    Response: 'True' | 'False';
}

// Your Prisma models, as returned by the backend
export type MediaType = 'movie' | 'series';

export interface Bookmark {
    id: string;
    userId: string;
    imdbId: string;
    mediaType: MediaType;
    createdAt: string;
}

export interface Rating {
    id: string;
    userId: string;
    imdbId: string;
    mediaType: MediaType;
    score: number;
    review: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    accessToken: string;
}

export interface User {
    id: string;
    email: string;
    createdAt: string;
}