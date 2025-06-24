import Fastify from "fastify";
import fastifyEnv from "@fastify/env";

import fastifyEnvOptions from "./plugins/env";
import { getSpotifyToken } from "./services/spotifyAuth";

const fastifyInstance = Fastify({ logger: true });

const server = async () => {

    await fastifyInstance.register(fastifyEnv, fastifyEnvOptions);
    const envs = fastifyInstance.getEnvs<EnvConfig>();
    
    fastifyInstance.get("/ping", async (request, reply) => {
        return { pong: true };
    });

    fastifyInstance.get("/spotify-token", async (_, reply) => {
        const token = await getSpotifyToken(envs);
        reply.send({ token });
    });

    try {
        await fastifyInstance.listen({
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0",
        });

        console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
    } catch (err) {
        fastifyInstance.log.error(err);
        process.exit(1);
    }
};

server();

export default server;
