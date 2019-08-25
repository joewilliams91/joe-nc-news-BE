exports.formatDates = list => {
  function timeConverter(UNIX) {
    const convertedDate = new Date(UNIX);
    return convertedDate;
  }

  const newArticles = list.map(
    obj =>
      (obj = {
        ...obj,
        created_at: timeConverter(obj.created_at)
      })
  );
  return newArticles;
};

exports.makeRefObj = (list, key, value) => {
  const lookupObj = {};
  if (list.length === 0) {
    return lookupObj;
  } else {
    for (let i = 0; i < list.length; i++) {
      lookupObj[list[i][key]] = list[i][value];
    }
  }
  return lookupObj;
};

exports.formatComments = (comments, articleRef) => {
  function renameProperty(
    oldProp,
    newProp,
    newVal,
    { [oldProp]: oldVal, ...rest }
  ) {
    return {
      [newProp]: newVal,
      ...rest
    };
  }

  function renameKey(oldProp, newProp, { [oldProp]: oldVal, ...rest }) {
    return {
      [newProp]: oldVal,
      ...rest
    };
  }
  function dateFormatter(list) {
    function timeConverter(UNIX) {
      const convertedDate = new Date(UNIX);
      return convertedDate;
    }
    const newArticles = list.map(
      obj =>
        (obj = {
          ...obj,
          created_at: timeConverter(obj.created_at)
        })
    );
    return newArticles;
  }
  if (comments.length === 0) {
    return [];
  } else {
    const firstFormat = comments.map(element =>
      renameProperty(
        "belongs_to",
        "article_id",
        articleRef[element.belongs_to],
        element
      )
    );

    const secondFormat = firstFormat.map(element =>
      renameKey("created_by", "author", element)
    );
    const finalFormat = dateFormatter(secondFormat);

    return finalFormat
  }
};

