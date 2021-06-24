<h2 align="center">
  Favorite Products API
</h2>

<p align="center">
  <a href="#rocket-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-principles">Principles</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

[![Build Status](https://travis-ci.com/bruno-lombardi/luiza-labs-challenge.svg?branch=master)](https://travis-ci.com/bruno-lombardi/luiza-labs-challenge)
[![Coverage Status](https://coveralls.io/repos/github/bruno-lombardi/luiza-labs-challenge/badge.svg?branch=master)](https://coveralls.io/github/bruno-lombardi/luiza-labs-challenge?branch=master)

## :rocket: Technologies

The following tools and packages were used to develop this project:

- [Node.js](https://nodejs.org/en)
- [Typescript](https://www.typescriptlang.org)
- [Express](https://expressjs.com)
- [Jest](https://jestjs.io)
- [MongoDB](https://www.mongodb.com)
- [Travis](https://travis-ci.org)

## 💻 Project

This project is an HTTP API that allow customers to save their favorite products.

### Check it live

You can access this API endpoints in your favorite API client, (I recommend Insomnia). Here are the links:

- API: [https://favorite-products-challenge.herokuapp.com/api](https://favorite-products-challenge.herokuapp.com/api)
- DOCS: [https://favorite-products-challenge.herokuapp.com/docs](https://favorite-products-challenge.herokuapp.com/docs)

### Getting started

Install project dependencies using your favorite package manager, `npm` or `yarn`:

```sh
$ yarn install && yarn post:install
## or:
## npm install && npm run post:install
```

Run the `post:install` to setup husky.

After that, you can start the development using docker, just make sure you have the latest version of [Docker](https://www.docker.com/products/docker-desktop) installed. Just run:

```sh
$ yarn up
```

To see your changes reflect live in the docker container, run `yarn build:watch`.

### Testing

It is strongly recommended to use Test Driven Development techniques while developing this software. Run your tests while you make changes to the code.

To run unit tests:

```sh
$ yarn test:unit
```

To run integration tests:

```sh
$ yarn test:integration
```

When you push changes to the repository, husky will automatically run the script `test:ci`, that runs both integration and unit tests with coverage.
You can also run `yarn test` manually to not generate code coverage.

### Documentation

To access API endpoints documentation locally, after running the server, just open the url `/docs` in your browser: [http://localhost:3333/docs](http://localhost:3333/docs).

## ☀️ Principles

- Single Responsibility Principle (SRP)
- Open Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SOC)
- Don't Repeat Yourself (DRY)
- You Aren't Gonna Need It (YAGNI)
- Keep It Simple, Silly (KISS)
- Composition Over Inheritance

## :memo: License

This project is under MIT license. Check the [LICENSE](LICENSE.md) for more details.

---
