import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import server from "../src/server";
import request from "supertest";

describe("POST /playlist", () => {
    const app = Fastify();

    beforeAll(async () => {
        app.register(fastifyPlugin(server));
        await app.ready();
    });

    it("should generate a playlist successfully with valid input", async () => {
        const response = await request(app.server)
            .post("/playlist")
            .send({
                durationLimitHours: 5,
                languageMix: { english: 70, spanish: 30 },
                maxRepeatPercent: 20,
                genres: ["reggaeton", "pop"],
                mood: "latin party",
                sourceMix: { userTop: 50, trending: 30, recommended: 20 },
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tracks");
        expect(Array.isArray(response.body.tracks)).toBe(true);
    });

    it("should fail if the language mix is invalid", async () => {
        const response = await request(app.server)
            .post("/playlist")
            .send({
                durationLimitHours: 5,
                languageMix: { english: 80, spanish: 40 }, // 120%
                maxRepeatPercent: 20,
                genres: ["reggaeton"],
                mood: "party",
                sourceMix: { userTop: 50, trending: 30, recommended: 20 },
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail if source mix doesn’t add up to 100%", async () => {
        const response = await request(app.server)
            .post("/playlist")
            .send({
                durationLimitHours: 5,
                languageMix: { english: 60, spanish: 40 },
                maxRepeatPercent: 20,
                genres: ["pop"],
                mood: "romantic",
                sourceMix: { userTop: 40, trending: 30, recommended: 10 }, // only 80%
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
