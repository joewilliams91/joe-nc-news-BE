# Joe's Northcoder's News

This repo includes my first full project, a reddit-style news page!

I have built the back-end from scratch, allowing the user to build their database using knex migrations, seed the tables with existing data files utilising knex's in-built seed features and interact with the database using knex in a Promise-based, MVC structured server comprising multiple endpoints. These endpoints have been comprehensively tested, with sufficient error handling, to ensure full, predictable API functionality.

## Getting Started

### Prerequisites

The following need to be pre-installed:

- Node.js
- Git
- PostgreSQL

### Installing

#### Cloning

```
$ git clone https://github.com/joewilliams91/joe-nc-news
```

#### Setup

```
$ npm install

$ npm run setup-db
```

You will also need to create a knex file in your main directory:

```
$ touch knexfile.js
```

Go into your knex file and enter the code below, making sure to update the username and password properties (NB- if you are using Mac OS, these keys can be omitted). This will tell knex the location of the directories with which to migrate and seed the database, as well as which database to use, depending on whether you are in test, development or production mode.

```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: <yourPostgresUsername>,
      password: <yourPostgresPassword>
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: <yourPostgresUsername>,
      password: <yourPostgresPassword>
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

## Running the Tests

```
$ npm test
```

## Deployment

My project is deployed on https://joe-nc-news.herokuapp.com/

## Built With

My project was built using:

- Javascript
- Knex
- PostgreSQL
- Express.js

## Authors

**Joe Williams** - _Initial Work_ - Northcoders.

## License

- ISC License
- Copyright 2019 Joe Williams

## Acknowledgements

Thank you to Northcoders for making this happen.
