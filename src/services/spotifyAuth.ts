let accessToken = "";
let tokenExpiresAt = 0;

export const getSpotifyToken = async (envs: EnvConfig): Promise<any> => {

    const now = Date.now();
    if (accessToken && now < tokenExpiresAt) {
        return accessToken;
    }

    const clientID = envs.SPOTIFY_CLIENT_ID;
    const clientSecret = envs.SPOTIFY_CLIENT_SECRET;


    const tokenUrl = "https://accounts.spotify.com/api/token";

    const credentialsString = `${clientID}:${clientSecret}`;
    const credentials = Buffer.from(credentialsString).toString("base64");

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
        tokenExpiresAt = Date.now() + data.expires_in * 1000; // Convert seconds to milliseconds (1 Hour later approx)
        accessToken = data.access_token;

        return accessToken;
    } catch (error) {
        console.error("Error generating credentials:", error);
        throw new Error("Failed to generate Spotify credentials");
    }
};
