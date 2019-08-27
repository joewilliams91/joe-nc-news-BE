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
