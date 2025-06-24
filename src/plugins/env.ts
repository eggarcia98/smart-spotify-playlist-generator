const schema = {
    type: "object",
    required: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"],
    properties: {
        SPOTIFY_CLIENT_ID: { type: "string" },
        SPOTIFY_CLIENT_SECRET: { type: "string" },
        PORT: { type: "string", default: "3000" },
    },
};

const options = {
    schema,
    dotenv: true,
    confKey: "config",
};

export default options;
