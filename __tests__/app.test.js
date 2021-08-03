const request = require("supertest");
const { seed } = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const { toBeSortedBy } = require("jest-sorted");

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
      .then(({ body }) => {
        expect(body.categories).toEqual([
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
  test("status: 200 responds with an object of the review at the correct id with all its native keys and an additional key of comment_count", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body.review.review_id).toBe(3);
        expect(body.review).toHaveProperty("review_id");
        expect(body.review).toHaveProperty("title");
        expect(body.review).toHaveProperty("review_body");
        expect(body.review).toHaveProperty("designer");
        expect(body.review).toHaveProperty("review_img_url");
        expect(body.review).toHaveProperty("votes");
        expect(body.review).toHaveProperty("category");
        expect(body.review).toHaveProperty("owner");
        expect(body.review).toHaveProperty("created_at");
        expect(body.review).toHaveProperty("comment_count");
        expect(body.review.comment_count).toBe(3);
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
  test("status 200: responds with a review object with the correct review_id and all its native keys", () => {
    const newVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review.review_id).toBe(2);
        expect(body.review).toHaveProperty("review_id");
        expect(body.review).toHaveProperty("title");
        expect(body.review).toHaveProperty("review_body");
        expect(body.review).toHaveProperty("designer");
        expect(body.review).toHaveProperty("review_img_url");
        expect(body.review).toHaveProperty("votes");
        expect(body.review).toHaveProperty("category");
        expect(body.review).toHaveProperty("owner");
        expect(body.review).toHaveProperty("created_at");
      });
  });
  test("status: 200 responds with a review object with the votes property increased by the number passed in the request if that number is positive", () => {
    const newVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review.votes).toBe(8);
      });
  });
  test("status: 200 responds with a review object with the votes property decreased by the number passed in the request if that number is negative", () => {
    const newVotes = { inc_votes: -1 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review.votes).toBe(4);
      });
  });
  test("status: 200 responds with the updated review object even if unrelated info is sent along with inc_votes in the patch request", () => {
    const newVotes = { inc_votes: 4, name: "Mitch" };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review.votes).toBe(9);
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

describe("GET /api/reviews?", () => {
  test("status: 200 responds with a list of all reviews with their native keys when requested without queries", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(13);
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
        expect(reviews.length).toBeGreaterThan(0);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("comment_count");
          if (review.review_id === 4) {
            expect(review.comment_count).toBe(0);
          }
        });
      });
  });
  test("status: 200 if no sort_by query is passed in, default sorts by date descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status: 200 sorts by any valid column name if passed in as sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("designer");
      });
  });
  test("status: 200 can specify sort order to be ASC", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at");
      });
  });
  test("status: 200 accepts a valid column name for category and filters accordingly", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBeGreaterThan(0);
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  test("status: 200 and an empty array when passed a valid column name for category that does not have any reviews associated with it", () => {
    return request(app)
      .get("/api/reviews?category=children%27s%20games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(0);
      });
  });
  test("status: 400 and error message if sent category query that is not valid", () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please provide a valid category query");
      });
  });
  test("status: 400 error message if sent order query that is not valid", () => {
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

describe("GET /api/reviews/:review_id/comments", () => {
  test("status: 200 responds with a list of comments associated with that review id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(3);
        expect(comments).toContainEqual({
          comment_id: 1,
          author: "bainesface",
          votes: 16,
          created_at: "2017-11-22T12:43:33.389Z",
          body: "I loved this game too!",
        });
      });
  });
  test("status: 404 responds with a no comments found message when passed a review id that does not have any associated comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comments found for this review");
      });
  });
  test("status: 400 responds with an invalid request parameter message if passed something that isn't a valid review id", () => {
    return request(app)
      .get("/api/reviews/dog/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request parameter");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("status: 201 responds with posted comment", () => {
    const commentToSend = {
      username: "mallionaire",
      body: "I played Catan before it was cool!",
    };
    return request(app)
      .post("/api/reviews/13/comments")
      .send(commentToSend)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("review_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("body");
        expect(comment.author).toBe("mallionaire");
        expect(comment.body).toBe("I played Catan before it was cool!");
      });
  });
  test("status: 422 responds with an error message when trying to post a comment with a username that isn't in users", () => {
    const commentToSend = {
      username: "calvinofcalvinandhobbesfame",
      body: "I played Catan before it was cool!",
    };
    return request(app)
      .post("/api/reviews/13/comments")
      .send(commentToSend)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Username not recognised, please provide a user from the database"
        );
      });
  });
  test("status: 404 responds with an error message when attempting to post to a review id that does not exist ", () => {
    const commentToSend = {
      username: "mallionaire",
      body: "I played Catan before it was cool!",
    };
    return request(app)
      .post("/api/reviews/413/comments")
      .send(commentToSend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review with this id found");
      });
  });
  test("status: 400 responds with an error message when using something that isn't a valid review_id", () => {
    const commentToSend = {
      username: "mallionaire",
      body: "I played Catan before it was cool!",
    };
    return request(app)
      .post("/api/reviews/doggo/comments")
      .send(commentToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request parameter");
      });
  });
});

describe("GET /api", () => {
  test("status: 200 responds with JSON describing all available endpoints", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("endpoints");
        expect(body.endpoints).toHaveProperty("GET /api");
        expect(body.endpoints).toHaveProperty("GET /api/categories");
        expect(body.endpoints).toHaveProperty("GET /api/reviews");
        expect(body.endpoints).toHaveProperty("GET /api/reviews/:review_id");
        expect(body.endpoints).toHaveProperty("PATCH /api/reviews/:review_id");
        expect(body.endpoints).toHaveProperty(
          "GET /api/reviews/:review_id/comments"
        );
        expect(body.endpoints).toHaveProperty(
          "POST /api/reviews/:review_id/comments"
        );
      });
  });
});

describe("DELETE /api/reviews/:review_id/comments/:comment_id", () => {
  test("status: 204 and no content once comment is deleted", () => {
    return request(app).delete("/api/reviews/2/comments/1").expect(204);
  });
  test("status: 404 and error message stating no comment with this id if no comment with this id", () => {
    return request(app)
      .delete("/api/reviews/2/comments/413")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found with this id");
      });
  });
});

describe("GET /api/users", () => {
  test("status: 200 responds with an array of objects containing all usernames", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ username: "mallionaire" }),
            expect.objectContaining({ username: "philippaclaire9" }),
            expect.objectContaining({ username: "bainesface" }),
            expect.objectContaining({ username: "dav3rid" }),
          ])
        );
      });
  });
});

describe("GET /api/users/:username", () => {
  test("status: 200 responds with an object of the user associated with the queried username", () => {
    return request(app)
      .get("/api/users/dav3rid")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toHaveProperty("username", "dav3rid");
        expect(body.user).toHaveProperty("avatar_url");
        expect(body.user).toHaveProperty("name", "dave");
      });
  });
  test("status: 404 and a message stating wrong username if no username found with this id", () => {
    return request(app)
      .get("/api/users/lalalala")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found with this username");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("status: 200 responds with the comment with all its native keys and the votes count updated if passed a positive integer", () => {
    const newVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(1);
        expect(body.comment).toHaveProperty("author");
        expect(body.comment).toHaveProperty("review_id");
        expect(body.comment).toHaveProperty("created_at");
        expect(body.comment).toHaveProperty("body");
        expect(body.comment.votes).toBe(19);
      });
  });
  test("status: 200 responds with the comment with all its native keys and the votes decreased if passed a negative integer", () => {
    const newVotes = { inc_votes: -3 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(13);
      });
  });
  test("status: 200 responds with the updated comment even if unrelated info is sent along with inc_votes", () => {
    const newVotes = { inc_votes: 4, name: "Mitch" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(20);
      });
  });
  test("status: 422 responds with a message indication that inc_votes is needed to update votes when passed a patch request without inc_votes", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/comments/:comment_id")
      .send(newVotes)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Please provide a number to alter the votes count by"
        );
      });
  });
  test("status: 400 responds with a message indicating that inc_votes needs to be a number when passed something that isn't one", () => {
    const newVotes = { inc_votes: "mitch" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request parameter");
      });
  });
});

describe("POST api/reviews", () => {
  test("status: 201 responds with the posted review", () => {
    const reviewToSend = {
      owner: "dav3rid",
      title: "the classic",
      review_body:
        "Catan needs no introduction, just trust me and start an evil sheep empire",
      designer: "Klaus Teuber",
      category: "euro game",
    };
    return request(app)
      .post("/api/reviews")
      .send(reviewToSend)
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toHaveProperty("review_id");
        expect(body.review).toHaveProperty("owner");
        expect(body.review).toHaveProperty("title");
        expect(body.review).toHaveProperty("designer");
        expect(body.review).toHaveProperty("category");
        expect(body.review).toHaveProperty("review_body");
        expect(body.review).toHaveProperty("created_at");
        expect(body.review).toHaveProperty("votes");
        expect(body.review.owner).toBe("dav3rid");
        expect(body.review.review_body).toBe(
          "Catan needs no introduction, just trust me and start an evil sheep empire"
        );
      });
  });
  test("status: 422 if not passed a valid category", () => {
    const reviewToSend = {
      owner: "dav3rid",
      title: "the classic",
      review_body:
        "Catan needs no introduction, just trust me and start an evil sheep empire",
      designer: "Klaus Teuber",
      category: "apple pie",
    };
    return request(app)
      .post("/api/reviews")
      .send(reviewToSend)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "invalid category, please provide a valid category from the database"
        );
      });
  });
  test("status: 422 when passed an owner not in the users table", () => {
    const reviewToSend = {
      owner: "daverid",
      title: "the classic",
      review_body:
        "Catan needs no introduction, just trust me and start an evil sheep empire",
      designer: "Klaus Teuber",
      category: "euro game",
    };
    return request(app).post("/api/reviews").send(reviewToSend).expect(422);
  });
});

describe("POST /api/categories", () => {
  test("status: 201 and responds with the new category object", () => {
    const categoryToSend = {
      slug: "cat games",
      description:
        "a game where you have to sit still for a long time and then pounce",
    };
    return request(app)
      .post("/api/categories")
      .send(categoryToSend)
      .expect(201)
      .then(({ body }) => {
        expect(body.slug).toBe("cat games");
        expect(body.description).toBe(
          "a game where you have to sit still for a long time and then pounce"
        );
      });
  });
});

describe("DELETE /api/reviews/:review_id", () => {
  test("status: 204 when a review has been deleted", () => {
    return request(app).delete("/api/reviews/1").expect(204);
  });
  test("status: 422 and an error message when using a review id not associated with a review", () => {
    return request(app)
      .delete("/api/reviews/200000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review with this ID");
      });
  });
  test("status: 400 bad request if passed something that isnt a valid review id", () => {
    return request(app).delete("/api/reviews/applepie").expect(400);
  });
});

afterAll(() => {
  return db.end();
});
