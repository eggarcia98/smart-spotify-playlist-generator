// test/routes/playlist-recommendation.test.ts
import supertest from "supertest";
import buildApp from "../../src/server";

import tap from "tap";

tap.test("GET /ping helth response", async (t) => {
    const fastifyTestApp = await buildApp();
    t.teardown(() => fastifyTestApp.close());

    const response = await supertest(fastifyTestApp.server).get("/ping");

    t.strictSame(
        response.statusCode,
        200,
        "Response status code should be 200ss"
    );
});
