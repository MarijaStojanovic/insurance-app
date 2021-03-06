const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const lusca = require('lusca');
const ErrorHandler = require('./middlewares/errorHandling/errorHandler');
const { ROUTE_PREFIX } = require('./config/constants');
const environments = require('./config/environments');
const { name } = require('./package.json');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const port = environments.PORT;
const appURL = `http://localhost:${port}${ROUTE_PREFIX}`;
mongoose.Promise = global.Promise;

const app = express();

// Application Routes
const UserRoutes = require('./components/user/userRouter');
const ContractRoutes = require('./components/contract/contractRouter');


app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(mongoSanitize());

app.disable('x-powered-by');

// Security
app.use(lusca.xframe('ALLOWALL'));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));


// Whitelisted routes
app.use(expressJwt({ secret: environments.JWT_SECRET }).unless({
  path: [
    `${ROUTE_PREFIX}/signin`,
    `${ROUTE_PREFIX}/signup`,
    /\/apidoc.+/,
  ],
}));


// Create the database connection
/* eslint-disable no-console */
mongoose.connect(process.env.DB_URL, {
  reconnectTries: Number.MAX_VALUE,
  useCreateIndex: true,
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${process.env.DB_URL}`);
});

// CONNECTION EVENTS
// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', () => {
  console.log('Mongoose default connection is open');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

app.use('/api/v1', UserRoutes);
app.use('/api/v1', ContractRoutes);

if (environments.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  require('./scripts/createDocs');
  app.use('/apidoc', express.static(path.join(__dirname, './doc')));
}

app.use(ErrorHandler());


// show env vars
console.log(`__________ ${name} __________`);
console.log(`Starting on port: ${port}`);
console.log(`Env: ${environments.NODE_ENV}`);
console.log(`App url: ${appURL}`);
console.log('______________________________');
/* eslint-enable no-console */

app.listen(port);
module.exports = app;
