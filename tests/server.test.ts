import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import buildApp from "../src/server";


const app = Fastify();

beforeAll(async () => {
    const instance = await buildApp();
    app.register(fastifyPlugin(() => instance));
    await app.ready();
});

afterAll(() => app.close());

export default app;
