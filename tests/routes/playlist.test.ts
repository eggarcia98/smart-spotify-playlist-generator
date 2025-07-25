// test/routes/playlist-recommendation.test.ts
import supertest from "supertest";
import buildApp from "../../src/server";

import tap from "tap";

tap.test("POST /playlist-recommendation returns recommendations", async (t) => {
    t.test("✅ Accepts valid request body", async (t) => {
        const fastifyTestApp = await buildApp();
        t.teardown(() => fastifyTestApp.close());

        const validBody = {
            generalPreferences: {
                languageDistribution: { en: 80, es: 20 },
                genresInclude: ["reggaeton", "pop"],
                moodsIncluded: ["happy"],
                situationDescription: "latin party"
            },
            userPreferences: {
                useMyTopSongs: true,
                limitDurationInMinutes: 120,
            },
        };

        const res = await supertest(fastifyTestApp.server)
            .post("/playlist-recommendation")
            .send(validBody);

        t.equal(res.statusCode, 200, "Should return 200 for valid request");
        t.ok(res.body.playlist, "Should return a playlist");
        // t.ok(res.body.link, "Should return a link");
    });

    t.test("❌ Rejects invalid languageDistribution format", async (t) => {
        const fastifyTestApp = await buildApp();
        t.teardown(() => fastifyTestApp.close());

        const invalidBody = {
            generalPreferences: {
                languageDistribution: { english: 100 },
            },
        };

        const res = await supertest(fastifyTestApp.server)
            .post("/playlist-recommendation")
            .send(invalidBody);

        t.equal(res.statusCode, 400, "Should return 400 for invalid lang key");
    });

    t.test("❌ Rejects wrong type for moodsIncluded", async (t) => {
        const fastifyTestApp = await buildApp();
        t.teardown(() => fastifyTestApp.close());

        const invalidBody = {
            generalPreferences: {
                moodsIncluded: "romantic",
            },
        };

        const res = await supertest(fastifyTestApp.server)
            .post("/playlist-recommendation")
            .set("Content-Type", "application/json") // 👈 force JSON
            .send(invalidBody);

        t.equal(res.statusCode, 400, "Should return 400 for wrong array type");
    });
});
