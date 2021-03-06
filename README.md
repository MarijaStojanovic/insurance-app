# InsuranceAPI
### Prerequisites
[NodeJs](https://nodejs.org) `>= 8.6.0`
[npmjs](https://www.npmjs.com/) `>= 5.6.0`
[nodemon](https://nodemon.io/) `>= 1.14.0`
[git](https://git-scm.com/downloads) `>= 2.0.0`
[mongodb](https://www.mongodb.com) `>= 3.6`
## Installing / Getting started
```shell
git clone git@github.com/MarijaStojanovic/insurance-app.git
npm install
Start mongoDB
Create a `environments` folder into config and two files in it: `development.env` and `test.env`. Each of those two files should have the following format:
`PORT=8010`
`JWT_SECRET=123`
`NODE_ENV=test`
`development.env` file is used to start a local node server and `test.env` file is used for automated tests
```
## Developing
### Built With
- Bcrypt - Hashing passwords
- body-parser - body parsing middleware
- bunyan - JSON logging library
- compression - compression middleware
- dotenv - loads enviroment variables
- express-jwt - validates JsonWebTokens
- express - web framework
- jsonwebtoken - authentication middleware
- lodash - swiss army knife of useful functions
- lusca - security middleware
- mongoose - connection to the MongoDB database
___
#### Developer dependencies:
- apidoc - documentation generation
- eslint - code styleguide
- eslint-config-airbnb-base
- eslint-plugin-import
- eslint-plugin-jasmine
- faker - easy generation of fake data
- mocha - testing tool
- supertest - testing tool
- chai - testing tool
## Configuration
To run a project in a `development` enviroment run
```shell
npm run start
```
for running in a `production` environment run
```shell
npm run prod
```
Do note that `development.env` and `production.env` files must be present in order to run the project.
## Tests
To run API releated tests run
```shell
npm run test
```
## Style guide
Explain the CRUD functionalities using HTTP methods:
_How:_
- `GET`: To retrieve a representation of a resource.
- `POST`: To create new resources and su-resources.
- `PUT`: To update existing resources.
- `PATCH`: To update existing resources. It only updates the fields that were supplied, leaving the others alone.
- `DELETE`: To delete existing resources.
## Guidelines
- Prefer ES6 syntax
- All scripts that need to be ran on the server are to be placed in `/scripts` folder
## Database
- [MongoDB](https://www.mongodb.com) - version 3.6 and above