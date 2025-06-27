import { FastifyPluginAsync } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { getSpotifyToken } from "../services/spotifyAuth";

const playlistRecommendationSchema = {
    type: "object",
    required: [],
    properties: {
        generalPreferences: {
            type: "object",
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
                    default: [],
                },
                moodsIncluded: {
                    type: "array",
                    items: { type: "string" },
                    default: ["none"],
                },
                situationDescription: {
                    type: "string",
                },
                limitDurationInMinutes: {
                    type: "integer",
                    minimum: 30,
                    maximum: 300,
                    default: 300,
                },
            },

            additionalProperties: false,
        },
        userPreferences: {
            type: "object",
            required: [],
            properties: {
                useMyTopSongs: {
                    type: "boolean",
                    default: false,
                },
                limitDurationInMinutes: {
                    type: "integer",
                    minimum: 0,
                    default: 60,
                },
            },
            additionalProperties: false,
        },
    },
    additionalProperties: false,
} as const;

type PlaylistRecommendationRequest = FromSchema<
    typeof playlistRecommendationSchema
>;

const playlistRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post<{ Body: PlaylistRecommendationRequest }>(
        "/playlist-recommendation",
        {
            schema: {
                body: playlistRecommendationSchema,
            },
        },
        async (_, reply) => {
            const envs = fastify.getEnvs<EnvConfig>();

            reply.send({ playlist: ["Song 1", "Song 2"] });
        }
    );
};

export default playlistRoutes;
