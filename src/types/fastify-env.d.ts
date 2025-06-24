import fastify from "fastify";

declare module "fastify" {
    interface FastifyInstance extends fastify {
        config: EnvConfig;
    }
}
