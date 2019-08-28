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
  describe("ERROR HANDLING incorrect/unavailable URL", () => {
    it("returns a 404 error when an invalid file path is requested", () => {
      return request(app)
        .get("/api/invalidPath")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql("Not Found");
        });
    });
  });
  describe("/topics", () => {
    describe("/", () => {
      describe("GET", () => {
        it("STATUS:200 and returns an object containing a key of topic, which includes an array of all topics", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(response => {
              for (let i = 0; i < response.body.topics.length; i++) {
                expect(response.body.topics[i]).to.have.keys(
                  "slug",
                  "description"
                );
              }
              expect(response.body.topics[0].description).to.equal(
                "The man, the Mitch, the legend"
              );
              expect(response.body.topics[0].slug).to.equal("mitch");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("STATUS CODE:405 when invalid methods are requested", () => {
          const invalidMethods = ["delete", "patch", "put", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not Allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        it("STATUS:200 and returns an object containing a key matching the input username with a value of the desired username object", () => {
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
        it("ERROR STATUS:404 when a valid username referring to a non-existent user is passed as the :username parametric endpoint", () => {
          return request(app)
            .get("/api/users/nonExistentUser")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Not Found");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("STATUS:405 when invalid methods are requested", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not Allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe("/articles", () => {
    describe("/", () => {
      describe("GET", () => {
        it("STATUS:200 and returns an array of article objects", () => {
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
                +response.body.articles.find(
                  article => article.article_id === 9
                ).comment_count
              ).to.equal(2);
            });
        });
        it("STATUS:200 and default sorts the article objects by created_by, in ascending order", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.be.ascendingBy("created_at");
            });
        });
        it("STATUS:200 and sorts the article objects in descending order if passed desc as a valid url order query", () => {
          return request(app)
            .get("/api/articles?order=desc")
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.be.descendingBy("created_at");
            });
        });
        it("STATUS:200 and sorts the article objects according to a valid non-numerical sort_by url query", () => {
          return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.be.ascendingBy("title");
            });
        });
        it("STATUS:200 and sorts the article objects according to a valid numerical sort_by url query", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.be.ascendingBy("votes");
            });
        });
        it("STATUS:200 and filters the article objects according to a valid author url query, if provided", () => {
          return request(app)
            .get("/api/articles?author=icellusedkars")
            .expect(200)
            .then(response => {
              expect(response.body.articles).to.have.length(6);
              for (let i = 0; i < response.body.articles.length; i++) {
                expect(response.body.articles[i].author).to.equal(
                  "icellusedkars"
                );
              }
            });
        });
        it("STATUS:200 and filters the article objects according to a valid topic url query, if provided", () => {
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
        it("ERROR STATUS:400 when a valid value matching no columns is entered as a sort_by url query", () => {
          return request(app)
            .get("/api/articles?sort_by=notAColumn")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("ERROR STATUS:400 when an invalid value is entered as an order url query", () => {
          return request(app)
            .get("/api/articles?order=notAnOrder")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("ERROR STATUS:400 when a valid topic/author that does not match any topics in the database is passed as a topic/author url query", () => {
          return request(app)
            .get("/api/articles?topic=notATopic")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            })
            .then(() => {
              return request(app)
                .get("/api/articles?author=notAnAuthor")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Bad Request");
                });
            });
        });
        it("ERROR STATUS:400 when a valid topic/author, matching a topic/author in the database, is passed as a topic/author url query, but the chosen topic/author does not have any associated articles", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            })
            .then(() => {
              return request(app)
                .get("/api/articles?author=lurker")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Bad Request");
                });
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("STATUS:405 when invalid methods are requested", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not Allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/:article_id", () => {
      describe("/", () => {
        describe("GET", () => {
          it("STATUS:200 and responds with an object containing an article key containing an object with properties corresponding to the article_id in the url query", () => {
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
                expect(+response.body.article.comment_count).to.equal(13);
              });
          });
          it("ERROR STATUS:404 when a valid article_id corresponding to a non-existing article is passed as the :article_id parametric endpoint", () => {
            return request(app)
              .get("/api/articles/99999999")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Not Found");
              });
          });
          it("ERROR STATUS:400 when an invalid article_id is passed as the :article_id parametric endpoint", () => {
            return request(app)
              .get("/api/articles/invalidId")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
        describe("PATCH", () => {
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
          it("ERROR STATUS:404 when a valid article_id corresponding to a non-existent article is passed as the :article_id parametric endpoint", () => {
            return request(app)
              .patch("/api/articles/99999999")
              .send({ inc_votes: 1 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Not Found");
              });
          });
          it("ERROR STATUS:400 when an invalid article_id is passed as the :article_id parametric endpoint", () => {
            return request(app)
              .patch("/api/articles/invalidId")
              .send({ inc_votes: 1 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR STATUS:400 when the request body does not contain an inc_votes key", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR STATUS:400 when the inc_votes key value is invalid, i.e. not a number", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "invalidValue" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR STATUS:400 when the request body contains further properties that are not allowed", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 1, otherProp: "notAllowed" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("STATUS CODE: 405 when invalid methods are requested", () => {
            const invalidMethods = ["put", "post", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
      describe("/comments", () => {
        describe("POST", () => {
          it("status:201 and returns the successfully posted comment object", () => {
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
          it("ERROR STATUS:422 when a valid, non-existent article_id is passed as the article_id parametric endpoint", () => {
            return request(app)
              .post("/api/articles/9999999/comments")
              .send({ username: "icellusedkars", body: "Love it" })
              .expect(422)
              .then(({ body }) => {
                expect(body.msg).to.equal("Unprocessable Entity");
              });
          });
          it("ERROR STATUS:400 when an invalid article_id is passed as the article_id parametric endpoint", () => {
            return request(app)
              .post("/api/articles/invalidId/comments")
              .send({ username: "icellusedkars", body: "Love it" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR STATUS:400 when a post request is made with an empty object", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR STATUS:400 when a post request is made with one key missing", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "icellusedkars" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              })
              .then(() => {
                return request(app)
                  .post("/api/articles/1/comments")
                  .send({ body: "Love it" })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.equal("Bad Request");
                  });
              });
          });
          it("ERROR STATUS:422 when a post request is made containing a valid username which does not match any users", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "nonExistentUser", body: "Love it" })
              .expect(422)
              .then(({ body }) => {
                expect(body.msg).to.equal("Unprocessable Entity");
              });
          });
          it("ERROR STATUS:400 when a post request is made containing an invalid body", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "icellusedkars",
                body: ["invalidBody", 1234, { invalid: "body" }]
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
        describe("GET", () => {
          it("STATUS:200 and returns an array of all comment objects for the given article_id", () => {
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
          it("ERROR STATUS:404 when a valid, non-existent article_id is passed as the article_id parametric endpoint", () => {
            return request(app)
              .get("/api/articles/9999999/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Page not Found");
              });
          });
          it("ERROR STATUS:400 when an invalid article_id is passed as the article_id parametric endpoint", () => {
            return request(app)
              .get("/api/articles/invalidId/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR STATUS:400 when an value referring to a non-existent column is passed as a sort_by url query", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=invalidColumn")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR STATUS:400 when an invalid order value is passed as an order query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=invalidOrder")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("STATUS CODE:405 when invalid methods are requested", () => {
            const invalidMethods = ["patch", "delete", "put"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("STATUS:200 and returns a successfully updated comment when passed a valid request body containing an amount of votes with which to update the specified comment's vote count", () => {
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
        it("ERROR STATUS:404 when a valid comment_id matching no comments in the database is passed as a parametric endpoint", () => {
          return request(app)
            .patch("/api/comments/999999999")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Not Found");
            });
        });
        it("ERROR STATUS:400 when an invalid comment_id is passed as a parametric endpoint", () => {
          return request(app)
            .patch("/api/comments/notAComment")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("ERROR STATUS:400 when an empty request body is sent", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("ERROR STATUS:400 when a request body containing an invalid key or value is sent", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ notAValidKey: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            })
            .then(() => {
              return request(app)
                .patch("/api/comments/1")
                .send({ inc_votes: "notANumber" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Bad Request");
                });
            });
        });
        it("ERROR STATUS:400 when a request body containing additional properties is sent", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1, anotherKey: "invalid" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
      });

      describe("DELETE", () => {
        it("STATUS CODE:204 no content for successful deletion, which also ensures deletion is accounted for at other endpoints", () => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.have.length(2);
            })
            .then(() => {
              return request(app)
                .get("/api/articles/9")
                .expect(200)
                .then(response => {
                  expect(+response.body.article.comment_count).to.equal(2);
                });
            })
            .then(() => {
              return request(app)
                .delete("/api/comments/1")
                .expect(204);
            })

            .then(() => {
              return request(app)
                .get("/api/articles/9/comments")
                .expect(200)
                .then(response => {
                  expect(response.body.comments).to.have.length(1);
                });
            })
            .then(() => {
              return request(app)
                .get("/api/articles/9")
                .expect(200)
                .then(response => {
                  expect(+response.body.article.comment_count).to.equal(1);
                });
            });
        });
        it("ERROR STATUS:404 when a valid comment_id that does not match any comment_id in the database is passed as a parametric endpoint", () => {
          return request(app)
            .delete("/api/comments/999999999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Not Found");
            });
        });
        it('ERROR STATUS:400 when an invalid comment_id is passed as a parametric endpoint', () => {
          return request(app)
            .delete("/api/comments/invalidComment")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        })
      });
      describe("INVALID METHODS", () => {
        it("STATUS CODE:405 when invalid methods are requested", () => {
          const invalidMethods = ["get", "post", "put"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not Allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
