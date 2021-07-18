const {
  keyReplacer,
  makeReference,
  idFetcher,
  offsetCalculator,
} = require("../db/utils/data-manipulation");
const { categoriesLookup } = require("../db/utils/lookups.js");
const { selectReviewsQueryString } = require("../db/utils/querystrings.js");
const { numberSanitiser } = require("../db/utils/sanitisers.js");

describe("keyReplacer", () => {
  test("returns a new empty object when passed an empty object", () => {
    const testObject = {};
    expect(keyReplacer(testObject)).toEqual({});
    expect(keyReplacer(testObject)).not.toBe(testObject);
  });
  test("should return new object with keyToReplace replaced with newKey", () => {
    const testObject = {
      body: "I loved this game too!",
      belongs_to: "Jenga",
      created_by: "bainesface",
      votes: 16,
      created_at: 1511354613389,
    };
    const keyToReplace = "created_by";
    const newKey = "author";
    expect(keyReplacer(testObject, keyToReplace, newKey)).toEqual({
      body: "I loved this game too!",
      belongs_to: "Jenga",
      author: "bainesface",
      votes: 16,
      created_at: 1511354613389,
    });
    expect(keyReplacer(testObject)).not.toBe(testObject);
  });
});

describe("makeReference", () => {
  test("returns an empty object if given an empty array", () => {
    const input = [];
    expect(makeReference(input)).toEqual({});
  });
  test("returns a reference table if given an array of 2 objects", () => {
    const input = [
      {
        review_id: 1,
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: 1610964020514,
        votes: 1,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
      {
        review_id: 2,
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: 1610964101251,
        votes: 5,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];
    expect(makeReference(input)).toEqual({ Agricola: 1, Jenga: 2 });
  });
  test("leaves original input unmodified", () => {
    const input = [
      {
        review_id: 1,
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: 1610964020514,
        votes: 1,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
      {
        review_id: 2,
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: 1610964101251,
        votes: 5,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];
    makeReference(input);
    expect(input).toBe(input);
  });
});
describe("idFetcher", () => {
  test("returns a new array of objects", () => {
    const input = [{}, {}];
    const ref = {
      Agricola: 1,
      Jenga: 2,
    };
    expect(idFetcher(input, ref)).not.toBe(input);
    expect(idFetcher(input, ref)).toHaveLength(2);
  });
  test("returns new object with belongs_to swapped with review_id", () => {
    const input = [{ belongs_to: "Agricola" }];
    const ref = {
      Agricola: 1,
      Jenga: 2,
    };
    expect(idFetcher(input, ref)).toEqual([{ review_id: 1 }]);
  });
  test("returns new object with belongs_to swapped with review_id", () => {
    const input = [
      {
        body: "I loved this game too!",
        belongs_to: "Agricola",
        author: "happyamy2016",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const ref = {
      Agricola: 1,
      Jenga: 2,
    };
    expect(idFetcher(input, ref)).toEqual([
      {
        body: "I loved this game too!",
        review_id: 1,
        author: "happyamy2016",
        votes: 16,
        created_at: 1511354163389,
      },
    ]);
  });
});

describe("categoriesLookup", () => {
  test("should return an array", () => {
    return categoriesLookup().then((result) => {
      expect(Array.isArray(result)).toBe(true);
    });
  });
  test("should return all the slugs in categories", () => {
    return categoriesLookup().then((result) => {
      expect(result).toContain(
        "euro game",
        "social deduction",
        "dexterity",
        "children's games"
      );
    });
  });
});

describe("selectReviewsQueryString", () => {
  test("should return a string", () => {
    expect(typeof selectReviewsQueryString()).toBe("string");
  });
  test("should return the queryString the correct sort_by and order queries inserted", () => {
    const sort_by = "created_at";
    const order = "DESC";
    let category;
    const validLimit = "10";
    const expectedOutput = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  LIMIT 10 OFFSET 0;
  `;
    expect(selectReviewsQueryString(sort_by, order, category, validLimit)).toBe(
      expectedOutput
    );
  });
  test("should return the queryString with the correct WHERE clause inserted if categories is not undefined", () => {
    const sort_by = "review_id";
    const order = "ASC";
    const category = "social deduction";
    const validLimit = "10";
    const expectedOutput = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE category LIKE 'social deduction'
  GROUP BY reviews.review_id
  ORDER BY reviews.review_id ASC
  LIMIT 10 OFFSET 0;
  `;
    expect(selectReviewsQueryString(sort_by, order, category, validLimit)).toBe(
      expectedOutput
    );
  });
  test("should return the queryString with the correct LIMIT inserted when there is no category specified", () => {
    const sort_by = "created_at";
    const order = "DESC";
    let category;
    const validLimit = "12";
    const expectedOutput = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  LIMIT 12 OFFSET 0;
  `;
    expect(selectReviewsQueryString(sort_by, order, category, validLimit)).toBe(
      expectedOutput
    );
  });
  test("should return the queryString with the correct LIMIT inserted when there is a category specified", () => {
    const sort_by = "review_id";
    const order = "ASC";
    const category = "social deduction";
    const validLimit = "8";
    const expectedOutput = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE category LIKE 'social deduction'
  GROUP BY reviews.review_id
  ORDER BY reviews.review_id ASC
  LIMIT 8 OFFSET 0;
  `;
    expect(selectReviewsQueryString(sort_by, order, category, validLimit)).toBe(
      expectedOutput
    );
  });
  test("should return the queryString with teh correct offset inserted when passed p != 1 when there is no category specified", () => {
    const sort_by = "created_at";
    const order = "DESC";
    let category;
    const validLimit = "12";
    const p = "2";
    const expectedOutput = `
  SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  LIMIT 12 OFFSET 12;
  `;
    expect(
      selectReviewsQueryString(sort_by, order, category, validLimit, p)
    ).toBe(expectedOutput);
  });
});

describe("numberSanitiser", () => {
  test("should return a string", () => {
    const limit = "12";
    expect(typeof numberSanitiser(limit)).toBe("string");
  });
  test("should check if the passed string can be converted into an integer and return the string of the integer if yes", () => {
    const limit = "11";
    const limitNotInt = "11.2";
    expect(numberSanitiser(limit)).toBe("11");
    expect(numberSanitiser(limitNotInt)).toBe("11");
  });
  test("should return a string of NaN if the passed string cannot be converted to an integer", () => {
    const limit = "ffff3";
    const limit2 = "   ";
    expect(numberSanitiser(limit)).toBe("NaN");
    expect(numberSanitiser(limit2)).toBe("NaN");
  });
});

describe("offsetCalculator", () => {
  test("should return a stringified integer representing the offset number that follows OFFSET = ((p-1) x validLimit) formula", () => {
    const validLimit = "10";
    const p = "2";
    const validLimit2 = "3";
    const p2 = "12";
    expect(offsetCalculator(validLimit, p)).toBe("10");
    expect(offsetCalculator(validLimit2, p2)).toBe("33");
  });
  test("should return 0 if p is anything that cannot be parsed into a valid integer", () => {
    const validLimit = "11";
    const p = "FUI";
    expect(offsetCalculator(validLimit, p)).toBe("0");
  });
});
