import Fastify from "fastify";
import fastifyEnv from "@fastify/env";

import fastifyEnvOptions from "./plugins/env";
import { getSpotifyToken } from "./services/spotifyAuth";

async function buildApp() {
    const fastifyInstance = Fastify({ logger: true });

    await fastifyInstance.register(fastifyEnv, fastifyEnvOptions);
    const config = fastifyInstance.config;

    fastifyInstance.get("/ping", async () => ({ pong: true }));

    fastifyInstance.get("/spotify-token", async (_, reply) => {
        const token = await getSpotifyToken(config);
        reply.send({ token });
    });

    return fastifyInstance;
}

const server = async () => {
    const fastifyInstance = await buildApp();

    try {
        await fastifyInstance.listen({
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0",
        });

        console.log(
            `Server is running at http://localhost:${process.env.PORT || 3000}`
        );
    } catch (err) {
        fastifyInstance.log.error(err);
        process.exit(1);
    }
};

server();

export default server;
