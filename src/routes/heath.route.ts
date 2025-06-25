import { FastifyPluginAsync } from "fastify";

const healthRoute: FastifyPluginAsync = async (fastify) => {
    fastify.get("/ping", async () => {
        return { pong: true };
    });
};

export default healthRoute;
