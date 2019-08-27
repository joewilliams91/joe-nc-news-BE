process.env.NODE_ENV = "test";
const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const chai = require("chai");
const { expect } = chai;

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    connection.destroy();
  });
  describe("/GET /topics", () => {
    it("GET STATUS:200 and returns an object containing a key of topic, which includes an array of all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          for (let i = 0; i < response.body.topics.length; i++) {
            expect(response.body.topics[i]).to.have.keys("slug", "description");
          }
          expect(response.body.topics[0].description).to.equal(
            "The man, the Mitch, the legend"
          );
          expect(response.body.topics[0].slug).to.equal("mitch");
        });
    });
  });
  describe("/GET /users/:username", () => {
    it("GET STATUS:200 and returns an object containing a key matching the input username with a value of the desired username object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(response => {
          expect(response.body.user).to.have.keys(
            "username",
            "avatar_url",
            "name"
          );
          expect(response.body.user.name).to.equal("jonny");
          expect(response.body.user.avatar_url).to.equal(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
        });
    });
  });
  describe("/GET /articles/:article_id", () => {
    it("GET STATUS:200 and responds with an object containing an article key containing an object with properties corresponding to the article_id in the url query", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(response => {
          expect(response.body.article).to.have.keys(
            "author",
            "article_id",
            "title",
            "topic",
            "body",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(response.body.article.title).to.equal(
            "Living in the shadow of a great man"
          );
          expect(response.body.article.topic).to.equal("mitch");
          expect(response.body.article.author).to.equal("butter_bridge");
          expect(response.body.article.body).to.equal(
            "I find this existence challenging"
          );
          expect(response.body.article.votes).to.equal(100);
          expect(response.body.article.comment_count).to.equal(13);
        });
    });
  });
  describe("/PATCH /articles/:article_id", () => {
    it("PATCH status: 200 and returns a successfully updated article when passed a valid request body containing an amount of votes with which to update the specified article's vote count", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(response => {
          expect(response.body.article.votes).to.equal(101);
          expect(response.body.article).to.have.keys(
            "author",
            "article_id",
            "title",
            "topic",
            "body",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
  });
});
