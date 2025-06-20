import dotenv from "dotenv";

dotenv.config();

let accessToken = "";
let tokenExpiresAt = 0;

export const getSpotifyToken = async (): Promise<string> => {
    const now = Date.now();
    if (accessToken && now < tokenExpiresAt) {
        return accessToken;
    }

    const clientID = process.env.SPOTIFY_CLIENT_ID ?? "";
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";

    const tokenUrl = "https://accounts.spotify.com/api/token";

    const credentials = Buffer.from(clientID + ":" + clientSecret).toString(
        "base64"
    );


    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                Authorization: "Basic " + credentials,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ grant_type: "client_credentials" }),
        });
      
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch token: ${errorText}`);
        }

        const data = await response.json();
        accessToken = data.access_token;

        return accessToken;
    } catch (error) {
        console.error("Error generating credentials:", error);
        throw new Error("Failed to generate Spotify credentials");
    }
};
