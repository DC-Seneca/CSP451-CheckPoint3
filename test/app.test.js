const request = require("supertest");
const app = require("../src/app");

describe("GET /", () => {
  test("returns ok status", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /health", () => {
  test('returns status 200 and status === "healthy"', async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("healthy");
  });

  test("returns uptime and it is a number", async () => {
    const res = await request(app).get("/health");

    expect(res.body).toHaveProperty("uptime");
    expect(typeof res.body.uptime).toBe("number");
  });
});
