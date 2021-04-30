const request = require("supertest");
const { seed } = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const { response } = require("express");

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
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
  test("status: 200 responds with an object of the review at the correct id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].review_id).toBe(2);
      });
  });
  test("status: 200 responds with the review with all its native keys", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0]).toHaveProperty("review_id");
        expect(body.review[0]).toHaveProperty("title");
        expect(body.review[0]).toHaveProperty("review_body");
        expect(body.review[0]).toHaveProperty("designer");
        expect(body.review[0]).toHaveProperty("review_img_url");
        expect(body.review[0]).toHaveProperty("votes");
        expect(body.review[0]).toHaveProperty("category");
        expect(body.review[0]).toHaveProperty("owner");
        expect(body.review[0]).toHaveProperty("created_at");
      });
  });
  test("status: 200 responds with the correct review with the additional key of comment_count, which represents the total count of all the comments with this review_id", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0]).toHaveProperty("comment_count");
        expect(body.review[0].comment_count).toBe(3);
      });
  });
  test("status: 400 responds with an invalid request parameter message if passed something that isn't a valid review id", () => {
    return request(app)
      .get("/api/reviews/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request parameter");
      });
  });
  test("status: 404 responds with a resource not found message when passed a review id that does not have an associated review", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status 200: responds with a review object with the correct review_id", () => {
    const newVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].review_id).toBe(2);
      });
  });
  test("status: 200 responds with the review with all its native keys", () => {
    const newVotes = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/3")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0]).toHaveProperty("review_id");
        expect(body.review[0]).toHaveProperty("title");
        expect(body.review[0]).toHaveProperty("review_body");
        expect(body.review[0]).toHaveProperty("designer");
        expect(body.review[0]).toHaveProperty("review_img_url");
        expect(body.review[0]).toHaveProperty("votes");
        expect(body.review[0]).toHaveProperty("category");
        expect(body.review[0]).toHaveProperty("owner");
        expect(body.review[0]).toHaveProperty("created_at");
      });
  });
  test("status: 200 responds with a review object with the votes property increased by the number passed in the request if that number is positive", () => {
    const newVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].votes).toBe(8);
      });
  });
  test("status: 200 responds with a review object with the votes property decreased by the number passed in the request if that number is negative", () => {
    const newVotes = { inc_votes: -1 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].votes).toBe(4);
      });
  });
  test("status: 200 responds with the updated review object even if unrelated info is sent along with inc_votes in the patch request", () => {
    const newVotes = { inc_votes: 4, name: "Mitch" };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0].votes).toBe(9);
      });
  });
  test("status: 422 responds with a message indication that inc_votes is needed to update votes when passed a patch request without inc_votes", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/reviews/3")
      .send(newVotes)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Please provide a number to alter the votes count by"
        );
      });
  });
  test("status: 400 responds with a message indicating that inc_votes should be a number when passed inc_votes with something that is not one", () => {
    const newVotes = { inc_votes: "cat" };
    return request(app)
      .patch("/api/reviews/4")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request parameter");
      });
  });
});

describe.only("GET /api/reviews?", () => {
  test("status: 200 responds with a list of all reviews when requested without queries", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(13);
      });
  });
  test("status: 200 all reviews have their native keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        for (let i = 0; i < body.reviews.length; i++) {
          expect(body.reviews[i]).toHaveProperty("review_id");
          expect(body.reviews[i]).toHaveProperty("title");
          expect(body.reviews[i]).toHaveProperty("review_body");
          expect(body.reviews[i]).toHaveProperty("designer");
          expect(body.reviews[i]).toHaveProperty("review_img_url");
          expect(body.reviews[i]).toHaveProperty("votes");
          expect(body.reviews[i]).toHaveProperty("category");
          expect(body.reviews[i]).toHaveProperty("owner");
          expect(body.reviews[i]).toHaveProperty("created_at");
        }
      });
  });
  test("status: 200 all reviews should also include a comment_count representing all the comments associated with its review id", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toHaveProperty("comment_count");
          if (review.review_id === 4) {
            expect(review.comment_count).toBe(0);
          }
        });
      });
  });
  test("status: 200 if no sort_by query is passed in, default sorts by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews[0].review_id).toBe(7);
        expect(reviews[5].review_id).toBe(9);
        expect(reviews[12].review_id).toBe(13);
      });
  });
  test("status: 200 sorts by any valid column name if passed in as sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews[0].review_id).toBe(3);
        expect(reviews[5].review_id).toBe(4);
        expect(reviews[12].review_id).toBe(9);
      });
  });
  test("status: 200 default sort order is descending if not specified", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews[0].review_id).toBe(7);
        expect(reviews[5].review_id).toBe(9);
        expect(reviews[12].review_id).toBe(13);
      });
  });
  test("status: 200 can specify sort order to be ASC", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews[0].review_id).toBe(13);
        expect(reviews[5].review_id).toBe(9);
        expect(reviews[12].review_id).toBe(7);
      });
  });
  test("status: 400 error message if  sent order query that is not valid", () => {
    return request(app)
      .get("/api/reviews?order=ASDFGL")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please provide a valid order query");
      });
  });
  test("status:400 returns an error message when passed a sort_by query that does not correspond to a column name", () => {
    return request(app)
      .get("/api/reviews?sort_by=desogner")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });
});

afterAll(() => {
  return db.end();
});
