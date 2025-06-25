// test/routes/playlist-recommendation.test.ts
import request from "supertest";
import app from "../server.test";

describe("GET /playlist-recommendation", () => {
    it("should return a playlist array and a link to Spotify", async () => {
        const res = await request(app.server).get("/playlist-recommendation");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.playlist)).toBe(true);
        expect(typeof res.body.link).toBe("string");
        expect(res.body.link).toMatch(/open\.spotify\.com/);

        if (res.body.playlist.length > 0) {
            const song = res.body.playlist[0];
            expect(song).toHaveProperty("name");
            expect(song).toHaveProperty("artist");
            expect(song.url).toMatch(/open\.spotify\.com/);
        }
    });
});
