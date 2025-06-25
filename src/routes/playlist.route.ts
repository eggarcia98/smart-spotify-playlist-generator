import { FastifyPluginAsync } from "fastify";
import { getSpotifyToken } from "../services/spotifyAuth";

const playlistRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get("/playlist-recommendation", async (_, reply) => {
        const envs = fastify.getEnvs<EnvConfig>();

        reply.send({ playlist: ["Song 1", "Song 2"] });
    });
};

export default playlistRoutes;
