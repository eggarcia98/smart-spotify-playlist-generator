export {};

declare global {
    interface EnvConfig {
        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;
        PORT?: string;
        // add other env vars here
    }
}
