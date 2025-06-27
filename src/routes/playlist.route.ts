import { FastifyPluginAsync } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { getSpotifyToken } from "../services/spotifyAuth";

const playlistRequestBodySchema = {
    type: "object",
    additionalProperties: false,
    required: [],
    properties: {
        generalPreferences: {
            type: "object",
            additionalProperties: false,
            required: [],
            properties: {
                languageDistribution: {
                    type: "object",
                    default: { en: 100 },
                    patternProperties: {
                        "^[a-z]{2}$": {
                            type: "integer",
                            minimum: 0,
                            maximum: 100,
                        },
                    },
                    additionalProperties: false,
                },
                genresInclude: {
                    type: "array",
                    items: { type: "string" },
                },
                moodsIncluded: {
                    type: "array",
                    items: { type: "string" },
                },
                situationDescription: { type: "string" },
                limitDurationInMinutes: {
                    type: "integer",
                    minimum: 30,
                    maximum: 300,
                    default: 300,
                },
            },
        },
        userPreferences: {
            type: "object",
            additionalProperties: false,
            required: [],
            properties: {
                useMyTopSongs: { type: "boolean", default: false },
                limitDurationInMinutes: {
                    type: "integer",
                    minimum: 0,
                    default: 60,
                },
            },
        },
    },
} as const;

type PlaylistRecommendationRequest = FromSchema<
    typeof playlistRequestBodySchema
>;

export const playlistRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post<{ Body: PlaylistRecommendationRequest }>(
        "/playlist-recommendation",
        {
            schema: {
                body: playlistRequestBodySchema, // ✅ correct usage
            },
        },
        async (request, reply) => {
            const envs = fastify.getEnvs<EnvConfig>();

            console.log("Received request for playlist recommendation");
            // Access request.body safely here
            const { generalPreferences, userPreferences } = request.body;
            console.log("Received preferences:", {
                generalPreferences,
                userPreferences,
            });

            reply.send({ playlist: ["Song 1", "Song 2"] });
        }
    );
};

export default playlistRoutes;
