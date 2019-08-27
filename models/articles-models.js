const connection = require("../db/connection");

exports.selectArticleByArticleId = article_id => {
  const article = connection
    .select()
    .from("articles")
    .where("articles.article_id", "=", article_id);

  const count = connection
    .count()
    .from("comments")
    .where("comments.article_id", "=", article_id);

  return Promise.all([article, count]).then(([[article], count]) => {
    article.comment_count = +count[0].count;
    return article;
  });
};

exports.updateArticleByArticleId = (incrementer, article_id) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", incrementer)
    .returning("*")
    .then(([updatedArticle]) => {
      return this.selectArticleByArticleId(updatedArticle.article_id);
    });
};

exports.insertCommentByArticleId = (author, body, article_id) => {
  const newComment = { author, body, article_id };
  return connection("comments")
    .insert(newComment)
    .where(article_id)
    .returning("*")
    .then(([addedComment]) => {
      return addedComment;
    });
};

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  return connection("comments")
    .select("comment_id", "author", "votes", "created_at", "body")
    .where(article_id)
    .orderBy(sort_by || "created_at", order || "asc")
    .then(comments => {
      return comments;
    });
};

exports.selectArticles = (sort_by, order, author, topic) => {
  return connection("articles")
    .select("article_id", "author", "title", "topic", "created_at", "votes")
    .where(builder => {
      builder
        .whereIn(
          "author",
          author
            ? [author]
            : function() {
                this.select("author").from("articles");
              }
        )
        .whereIn(
          "topic",
          topic
            ? [topic]
            : function() {
                this.select("topic").from("articles");
              }
        );
    })
    .orderBy(sort_by || "created_at", order || "asc")
    .then(articles => {
      const articleArray = [];
      articles.forEach(article => {
        articleArray.push(this.selectArticleByArticleId(article.article_id));
      });
      return Promise.all(articleArray);
    })
    .then(articles => {
      articles.forEach(article => {
        delete article.body;
      });
      return articles;
    });
};
