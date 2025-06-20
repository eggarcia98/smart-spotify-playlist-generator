import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const fastifyInstance = Fastify({ logger: true });

fastifyInstance.get("/ping", async (request, reply) => {
    return { pong: true };
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
