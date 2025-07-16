import { FastifyPluginAsync } from "fastify";
import crypto from "node:crypto";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const redirectUri = "http://127.0.0.1:5500/public/index.html"; // Spotify will redirect here
const scopes = "user-read-private user-read-email";

function generateCodeVerifier(): string {
    return crypto.randomBytes(64).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
    const hash = crypto.createHash("sha256").update(verifier).digest();
    return Buffer.from(hash).toString("base64url");
}

const authRoutes: FastifyPluginAsync = async (fastify) => {
    // Make sure you register cookie plugin first!

    fastify.get("/auth/login", async (request, reply) => {
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        const state = crypto.randomUUID();

        // Store the codeVerifier and state in a secure cookie (you could also use Redis, memory, etc.)
        reply.setCookie("spotify_pkce_verifier", codeVerifier, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 300, // 5 minutes
        });

        reply.setCookie("spotify_auth_state", state, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 300,
        });

        const spotifyAuthUrl = new URL(
            "https://accounts.spotify.com/authorize"
        );
        spotifyAuthUrl.searchParams.set("response_type", "code");
        spotifyAuthUrl.searchParams.set("client_id", clientId);
        spotifyAuthUrl.searchParams.set("redirect_uri", redirectUri);
        spotifyAuthUrl.searchParams.set("code_challenge_method", "S256");
        spotifyAuthUrl.searchParams.set("code_challenge", codeChallenge);
        spotifyAuthUrl.searchParams.set("state", state);
        spotifyAuthUrl.searchParams.set("scope", scopes);

        return reply.redirect(spotifyAuthUrl.toString());
    });
};

export default authRoutes;