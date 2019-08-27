process.env.NODE_ENV = "test";
const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

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
    it("PATCH status: 200 and returns a successfully updated article when passed a valid request body containing a negative amount of votes with which to update the specified article's vote count", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(response => {
          expect(response.body.article.votes).to.equal(99);
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
  describe("/POST /articles/:article_id/comments", () => {
    it("POST status:201 and returns the successfully posted comment object", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "icellusedkars", body: "Love it" })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comment.author).to.equal("icellusedkars");
          expect(response.body.comment.votes).to.equal(0);
          expect(response.body.comment.article_id).to.equal(1);
          expect(response.body.comment.body).to.equal("Love it");
          expect(response.body.comment.comment_id).to.equal(19);
        });
    });
  });
  describe("/GET /articles/:article_id/comments", () => {
    it("GET STATUS:200 and returns an array of all comment objects for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(response => {
          for (let i = 0; i < response.body.comments.length; i++) {
            expect(response.body.comments[i]).to.have.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            );
          }
          expect(response.body.comments).to.have.length(13);
        });
    });
    it("GET STATUS:200 and default sorts the array by the created_at column in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.ascendingBy("created_at");
        });
    });
    it("GET STATUS:200 and sorts the array in descending order if passed desc as a url order query", () => {
      return request(app)
        .get("/api/articles/1/comments?order=desc")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.descendingBy("created_at");
        });
    });
    it("GET STATUS:200 and sorts the array according to valid sort_by url query referring to a column containing non-numerical data", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.ascendingBy("author");
        });
    });
    it("GET STATUS:200 and sorts the array according to valid sort_by url query referring to a column containing numerical data", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.ascendingBy("comment_id");
        });
    });
  });
  describe("/GET /articles", () => {
    it("GET STATUS:200 and returns an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          for (let i = 0; i < response.body.articles.length; i++) {
            expect(response.body.articles[i]).to.have.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          }
          expect(response.body.articles).to.have.length(12);
          expect(
            response.body.articles.find(article => article.article_id === 9)
              .comment_count
          ).to.equal(2);
        });
    });
    it("GET STATUS:200 and default sorts the article objects by created_by, in ascending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.ascendingBy("created_at");
        });
    });
    it("GET STATUS:200 and sorts the article objects in descending order if passed desc as a valid url order query", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.descendingBy("created_at");
        });
    });
    it("GET STATUS:200 and sorts the article objects according to a valid non-numerical sort_by url query", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.ascendingBy("title");
        });
    });
    it("GET STATUS:200 and sorts the article objects according to a valid numerical sort_by url query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.ascendingBy("votes");
        });
    });
    it("GET STATUS:200 and filters the article objects according to a valid author url query, if provided", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.have.length(6);
          for (let i = 0; i < response.body.articles.length; i++) {
            expect(response.body.articles[i].author).to.equal("icellusedkars");
          }
        });
    });
    it("GET STATUS:200 and filters the article objects according to a valid topic url query, if provided", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.have.length(1);
          for (let i = 0; i < response.body.articles.length; i++) {
            expect(response.body.articles[i].topic).to.equal("cats");
          }
        });
    });
  });
  describe("/PATCH /comments/:comment_id", () => {
    it("PATCH status: 200 and returns a successfully updated comment when passed a valid request body containing an amount of votes with which to update the specified comment's vote count", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(response => {
          expect(response.body.comment.votes).to.equal(17);
          expect(response.body.comment).to.have.keys(
            "comment_id",
            "article_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
          expect(response.body.comment.article_id).to.equal(9);
        });
    });
  });
});
