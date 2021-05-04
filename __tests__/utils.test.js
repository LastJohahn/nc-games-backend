const {
  keyReplacer,
  makeReference,
  idFetcher,
} = require("../db/utils/data-manipulation");
const { categoriesLookup } = require("../db/utils/categoriesLookup.js");

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
