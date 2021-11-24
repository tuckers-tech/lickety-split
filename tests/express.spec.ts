import request from "supertest";
import expressApp from "./expressApp";
// data to test post request
import postme from './data/postme.json';
// get the expected results from JSON files
import expectedGetRootResult from './data/expectedGetRootResult.json';
import expectedGetActiveResult from './data/expectedGetActiveResult.json';
import expectedPostResult from './data/expectedPostResult.json';
import expected404Response from "./data/expected404Response.json"


describe("Test Express App GET /", () => {
  test("Should respond with full database", () => {
    return request(expressApp)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedGetRootResult);
      })
  });
});

describe("Test Express App GET /active", () => {
  test("Should respond with only active users ", () => {
    return request(expressApp)
      .get("/active")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedGetActiveResult);
      })
  });
});


describe("Test Express App POST / sample data", () => {
  test("Should respond with id, age and name of posted user", () => {
    return request(expressApp)
      .post("/")
      .send(postme)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedPostResult);
      })
  });
});



describe("Test Express App GET / again, should now include POSTed data", () => {
  test("Should respond with full database", () => {
    return request(expressApp)
      .get("/")
      .then(response => {
        const expected = expectedGetRootResult;
        expected.push(postme);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expected);
      })
  });
});

describe("Test Express App GET /friends/_id with id of POSTed person, friends should match POSTed friends", () => {
  test("Should respond with full database", () => {
    return request(expressApp)
      .get(`/friends/${postme._id}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(postme.friends);
      })
  });
});

describe("Test 404 GET /invalid ", () => {
  test("Should respond with 404", () => {
    return request(expressApp)
      .get(`/invalid`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject(expected404Response);
      })
  });
});