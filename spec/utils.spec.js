const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const actualResult = formatDates(input);
    const expectedResult = [];
    expect(actualResult).to.eql(expectedResult);
  });
  it("returns a new array containing an object with an updated created_at value when passed an array containing a single object", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389
      }
    ];
    const actualResult = formatDates(input);
    const expectedDate = new Date(1471522072389);
    expect(actualResult[0].created_at).to.eql(expectedDate);
  });
  it("returns a new array containing objects with updated created_at values when passed an array containing multipe objects", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    const actualResult = formatDates(input);
    const expectedDate1 = new Date(1471522072389);
    const expectedDate2 = new Date(1478813209256);
    expect(actualResult[0].created_at).to.eql(expectedDate1);
    expect(actualResult[1].created_at).to.eql(expectedDate2);
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389
      }
    ];
    const control = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389
      }
    ];
    formatDates(input);
    expect(input).to.eql(control);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    const input = [];
    const actualResult = makeRefObj(input, "title", "article_id");
    const expectedResult = {};
    expect(actualResult).to.eql(expectedResult);
  });
  it("returns an object with a single key value pair when passed an array containing a single element", () => {
    const input = [
      {
        article_id: 26,
        title: "HOW COOKING HAS CHANGED US",
        body:
          "In a cave in South Africa, archaeologists have unearthed the remains of " +
          "a million-year-old campfire, and discovered tiny bits of animal bones " +
          "and ash from plants. It’s the oldest evidence of our ancient human " +
          "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
          "meal.",
        votes: 0,
        topic: "cooking",
        author: "weegembump",
        created_at: "2017-04-21T12:34:54.761Z"
      }
    ];
    const actualResult = makeRefObj(input, "title", "article_id");
    const expectedResult = { "HOW COOKING HAS CHANGED US": 26 };
    expect(actualResult).to.eql(expectedResult);
  });
  it("returns an object with multiple key value pairs when passed an array containing multiple elements", () => {
    const input = [
      {
        article_id: 26,
        title: "HOW COOKING HAS CHANGED US",
        body:
          "In a cave in South Africa, archaeologists have unearthed the remains of " +
          "a million-year-old campfire, and discovered tiny bits of animal bones " +
          "and ash from plants. It’s the oldest evidence of our ancient human " +
          "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
          "meal.",
        votes: 0,
        topic: "cooking",
        author: "weegembump",
        created_at: "2017-04-21T12:34:54.761Z"
      },
      {
        article_id: 27,
        title: "Thanksgiving Drinks for Everyone",
        body:
          "Thanksgiving is a foodie’s favorite holiday. Mashed potatoes, " +
          "cranberry sauce, stuffing, and last but not least, a juicy " +
          "turkey. Don’t let your meticulous menu fall short of " +
          "perfection; flavorful cocktails are just as important as the " +
          "meal. Here are a few ideas that will fit right into your " +
          "festivities.",
        votes: 0,
        topic: "cooking",
        author: "grumpy19",
        created_at: "2017-04-23T18:00:55.514Z"
      },
      {
        article_id: 28,
        title: "High Altitude Cooking",
        body:
          "Most backpacking trails vary only a few thousand feet " +
          "elevation. However, many trails can be found above 10,000 " +
          "feet. But what many people don’t take into consideration at " +
          "these high altitudes is how these elevations affect their " +
          "cooking.",
        votes: 0,
        topic: "cooking",
        author: "happyamy2016",
        created_at: "2018-05-27T03:32:28.514Z"
      }
    ];
    const actualResult = makeRefObj(input, "title", "article_id");
    const expectedResult = {
      "HOW COOKING HAS CHANGED US": 26,
      "Thanksgiving Drinks for Everyone": 27,
      "High Altitude Cooking": 28
    };
    expect(actualResult).to.eql(expectedResult);
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        article_id: 26,
        title: "HOW COOKING HAS CHANGED US",
        body:
          "In a cave in South Africa, archaeologists have unearthed the remains of " +
          "a million-year-old campfire, and discovered tiny bits of animal bones " +
          "and ash from plants. It’s the oldest evidence of our ancient human " +
          "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
          "meal.",
        votes: 0,
        topic: "cooking",
        author: "weegembump",
        created_at: "2017-04-21T12:34:54.761Z"
      }
    ];
    const control = [
      {
        article_id: 26,
        title: "HOW COOKING HAS CHANGED US",
        body:
          "In a cave in South Africa, archaeologists have unearthed the remains of " +
          "a million-year-old campfire, and discovered tiny bits of animal bones " +
          "and ash from plants. It’s the oldest evidence of our ancient human " +
          "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
          "meal.",
        votes: 0,
        topic: "cooking",
        author: "weegembump",
        created_at: "2017-04-21T12:34:54.761Z"
      }
    ];
    makeRefObj(input, "title", "article_id");
    expect(input).to.eql(control);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const lookup = makeRefObj(
      [
        {
          article_id: 26,
          title: "HOW COOKING HAS CHANGED US",
          body:
            "In a cave in South Africa, archaeologists have unearthed the remains of " +
            "a million-year-old campfire, and discovered tiny bits of animal bones " +
            "and ash from plants. It’s the oldest evidence of our ancient human " +
            "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
            "meal.",
          votes: 0,
          topic: "cooking",
          author: "weegembump",
          created_at: "2017-04-21T12:34:54.761Z"
        }
      ],
      "title",
      "article_id"
    );
    const actualResult = formatComments(input, lookup);
    const expectedResult = [];
    expect(actualResult).to.eql(expectedResult);
  });
  it("returns a new array when passed an array containing a single object", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "HOW COOKING HAS CHANGED US",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const lookup = makeRefObj(
      [
        {
          article_id: 26,
          title: "HOW COOKING HAS CHANGED US",
          body:
            "In a cave in South Africa, archaeologists have unearthed the remains of " +
            "a million-year-old campfire, and discovered tiny bits of animal bones " +
            "and ash from plants. It’s the oldest evidence of our ancient human " +
            "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
            "meal.",
          votes: 0,
          topic: "cooking",
          author: "weegembump",
          created_at: "2017-04-21T12:34:54.761Z"
        }
      ],
      "title",
      "article_id"
    );
    const actualResult = formatComments(input, lookup);
    expect(actualResult[0]).to.have.keys(
      "article_id",
      "created_at",
      "body",
      "author",
      "votes"
    );
    expect(actualResult[0].created_at).to.eql(new Date(1479818163389));
    expect(actualResult[0].author).to.equal(input[0].created_by);
    expect(actualResult[0].article_id).to.equal(lookup[input[0].belongs_to]);
  });

  it("returns a new array when passed an array containing multiple objects", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "The Notorious MSG’s Unlikely Formula For Success",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "HOW COOKING HAS CHANGED US",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const lookup = makeRefObj(
      [
        {
          article_id: 26,
          title: "HOW COOKING HAS CHANGED US",
          body:
            "In a cave in South Africa, archaeologists have unearthed the remains of " +
            "a million-year-old campfire, and discovered tiny bits of animal bones " +
            "and ash from plants. It’s the oldest evidence of our ancient human " +
            "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
            "meal.",
          votes: 0,
          topic: "cooking",
          author: "weegembump",
          created_at: "2017-04-21T12:34:54.761Z"
        },
        {
          article_id: 34,
          title: "The Notorious MSG’s Unlikely Formula For Success",
          body:
            "The 'umami' craze has turned a much-maligned and misunderstood " +
            "food additive into an object of obsession for the world’s most " +
            "innovative chefs. But secret ingredient monosodium glutamate’s " +
            "biggest secret may be that there was never anything wrong with it " +
            "at all.",
          votes: 0,
          topic: "cooking",
          author: "grumpy19",
          created_at: "2017-08-16T22:08:30.430Z"
        }
      ],
      "title",
      "article_id"
    );
    const actualResult = formatComments(input, lookup);
    for (let i = 0; i < actualResult.length; i++) {
      expect(actualResult[i]).to.have.keys(
        "article_id",
        "created_at",
        "body",
        "author",
        "votes"
      );
      expect(actualResult[i].author).to.equal(input[i].created_by);
      expect(actualResult[i].article_id).to.equal(lookup[input[i].belongs_to]);
      expect(actualResult[i].created_at).to.eql(new Date(input[i].created_at));
    }
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "HOW COOKING HAS CHANGED US",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const control = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "HOW COOKING HAS CHANGED US",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const lookup = makeRefObj(
      [
        {
          article_id: 26,
          title: "HOW COOKING HAS CHANGED US",
          body:
            "In a cave in South Africa, archaeologists have unearthed the remains of " +
            "a million-year-old campfire, and discovered tiny bits of animal bones " +
            "and ash from plants. It’s the oldest evidence of our ancient human " +
            "ancestors—probably Homo erectus, a species that preceded ours—cooking a " +
            "meal.",
          votes: 0,
          topic: "cooking",
          author: "weegembump",
          created_at: "2017-04-21T12:34:54.761Z"
        }
      ],
      "title",
      "article_id"
    );
    formatComments(input, lookup);
    expect(input).to.eql(control);
  });
});
