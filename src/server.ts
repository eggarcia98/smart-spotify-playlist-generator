import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import fastifyCookie from "@fastify/cookie";

import fastifyEnvOptions from "./plugins/env";

import healthRoute from "./routes/heath.route";
import playlistRoutes from "./routes/playlist.route";

async function buildApp() {
    const fastifyInstance = Fastify({
        logger: true,
        ajv: {
            customOptions: {
                allErrors: true,
                strict: true,
                coerceTypes: false, // 👈 STOP coercing types like strings into arrays,
                removeAdditional: false, // 👈 Remove additional properties not defined in the schema
            },
        },
    });

    fastifyInstance.setErrorHandler((err, req, res) => {
        console.log({ body: req.body });
        if (err.validation) {
            console.error("Validation error:", err.validation);
        }
        res.status(400).send({
            error: "Invalid request",
            details: err.validation,
        });
    });
    
    // Register Plugins
    await fastifyInstance.register(fastifyEnv, fastifyEnvOptions);
    await fastifyInstance.register(fastifyCookie);

    // Register Routes
    await fastifyInstance.register(healthRoute);
    await fastifyInstance.register(playlistRoutes);

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

if (require.main === module) {
    server();
}

export default buildApp;
