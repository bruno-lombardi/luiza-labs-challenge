<h2 align="center">
  Favorite Products API
</h2>

<p align="center">
  <a href="#rocket-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-principles">Principles</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

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

To access API endpoints documentation, start the docker service with the `yarn up` command, and open [http://localhost:5000/](http://localhost:5000/).

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
