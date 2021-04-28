const request = require("supertest");
const { seed } = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");

beforeEach(() => {
  return seed(testData);
});

describe("REQUEST TO /[invalid endpoint]", () => {
  test('should return status:404 and a "route not found" message', () => {
    return request(app)
      .get("/ap")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "route not found" });
      });
  });
});

describe("GET /api/categories", () => {
  test("status: 200 responds with a JSON object containing the categories as an array attached to a categories: key", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories).toEqual([
          {
            slug: "euro game",
            description: "Abstact games that involve little luck",
          },
          {
            slug: "social deduction",
            description: "Players attempt to uncover each other's hidden role",
          },
          { slug: "dexterity", description: "Games involving physical skill" },
          {
            slug: "children's games",
            description: "Games suitable for children",
          },
        ]);
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status: 200 responds with an object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
});

afterAll(() => {
  return db.end();
});
