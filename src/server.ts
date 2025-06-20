import Fastify from "fastify";
import dotenv from "dotenv";
import { getSpotifyToken } from "./services/spotifyAuth";

dotenv.config();

const fastifyInstance = Fastify({ logger: true });

fastifyInstance.get("/ping", async (request, reply) => {
    return { pong: true };
});

fastifyInstance.get("/spotify-token", async (_, reply) => {
    const token = await getSpotifyToken();
    reply.send({ token });
});

const server = async () => {
    try {
        await fastifyInstance.listen({
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0",
        });
    } catch (err) {
        fastifyInstance.log.error(err);
        process.exit(1);
    }
};

server();

export default server;
