# Northcoders Games API

## Summary

This is an API of games reviews, written as part of a [Northcoders Bootcamp](https://northcoders.com/), using `Node.js` (minimum version 15.8.0) and `PSQL` (minimum version 12.8). It runs very similar to any reddit-style API, allowing you to vote on comments etc. You can find the hosted version [here](https://nc-games-api-lastjohahn.herokuapp.com/api).

## Installation

If you wish to have a play about with this yourself, feel free to fork and clone the repo here on github.

Once you have run `npm install` to get all your dependencies set up, you're good to start creating your .env files!

## Setup & Testing

You will need to create _two_ `.env` files for this: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Make sure that these `.env` files are .gitignored.

The tests in this repo work with jest and the test file `app.test.js` will always seed with the test data given before it runs (script: `npm test`). To use the development data instead, just call `seed.js` with the development data from `db/data/test-data/index.js` instead.

The test suite app.test.js contains all tests for all endpoints, it is recommended to run it regularly as you code to make sure everything works as it should.
