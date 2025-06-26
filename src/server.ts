import Fastify from "fastify";
import fastifyEnv from "@fastify/env";

import fastifyEnvOptions from "./plugins/env";

import healthRoute from "./routes/heath.route";
import playlistRoutes from "./routes/playlist.route";

async function buildApp() {
    const fastifyInstance = Fastify({ logger: true });

    // Register Plugins
    await fastifyInstance.register(fastifyEnv, fastifyEnvOptions);

    // Register Routes
    await fastifyInstance.register(healthRoute);
    fastifyInstance.register(playlistRoutes);

    await fastifyInstance.ready();
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

export default buildApp;
