require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { expect } = require('chai');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const apiRoutes = require('./routes/api.js');
const testRunner = require('./test-runner');

const app = express();

// Serve static files from 'public' directory
app.use('/public', express.static(`${process.cwd()}/public`));

// Allow cross-origin requests (FCC testing only)
app.use(cors({ origin: '*' }));

// Parse incoming requests as JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the index page (static HTML)
app.route('/')
  .get((req, res) => {
    res.sendFile(`${process.cwd()}/views/index.html`);
  });

// Register FCC testing routes
fccTestingRoutes(app);

// Register user-defined API routes
apiRoutes(app);

// Handle 404 errors (Page Not Found)
app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Start the server and run tests if in 'test' environment
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);

  if (process.env.NODE_ENV === 'test') {
    console.log('Running tests...');
    setTimeout(() => {
      try {
        testRunner.run();
      } catch (error) {
        console.log('Error: Tests are not valid.');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // Exports app for testing
