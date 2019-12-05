
/**
 * Node.js Web Application Template
 *
 * The code below serves as a starting point for anyone wanting to build a
 * website using Node.js, Express, Handlebars, and MySQL. You can also use
 * Forever to run your service as a background process.
 */
const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
var md5 = require('md5');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({secret: 'sshhh'}));
// Configure handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

// Configure the views
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(path.basename(__dirname), 'views'));

// Setup static content serving
app.use(express.static(path.join(path.basename(__dirname), 'public')));

/**
 * Create a database connection. This is our middleware function that will
 * initialize a new connection to our MySQL database on every request.
 */
const config = require('./config');
function connectDb(req, res, next) {
  console.log('Connecting to the database');
  let connection = mysql.createConnection(config);
  connection.connect();
  req.db = connection;
  console.log('Database connected');
  next();
}

/**
 * This is the handler for our main page. The middleware pipeline includes
 * our custom `connectDb()` function that creates our database connection and
 * exposes it as `req.db`.
 */
app.get('/', connectDb, function(req, res) {
  res.render('home');

  close(req);
});

app.get('/restaurants', connectDb, function(req, res) {
  req.db.query('SELECT Res.*, AVG(Rev.rating) AvgRating from Restaurant Res, Review Rev where Res.RestaurantID=Rev.RestaurantID group by Res.RestaurantID', function (err, results) {
    if (err) throw err;
    let wrapper = {objects: results}
    res.render('restaurant', {wrapper});
    close(req);
  });
});

app.get('/reviews/:rest_id', connectDb, function(req, res) {
  req.db.query('SELECT * from Review WHERE RestaurantID = ?',
  [req.params.rest_id],
  function (err, results) {
    if (err) throw err;
    let wrapper = {objects: results}
    res.render('review', {wrapper});
    close(req);
  });
});

app.post('/post_review/:rest_id', connectDb, function(req, res) {
  if('username' in req.session) {
    req.db.query(
      "SELECT * from (select username FROM Employees UNION (select username from Users)) as u where u.username = ?",
      [req.session.username],
      function (err, results) {
        if (err) throw err;
        if(results.length == 1) {
          if(req.body.rating >= 0 && req.body.rating <= 5) {
            req.db.query(
              "INSERT INTO Review (text, rating, RestaurantID, Username) VALUE (?, ?, ?, ?)",
              [req.body.text, req.body.rating, req.params.rest_id, req.session.username],
              function (err, results) {
                if (err) throw err;
                res.sendStatus(200);
                close(req);
              }
            );
          } else {
            res.status(406).send("Rating must be between 0 and 5.");
            close(req);
          }
        } else {
          res.status(401).send("Unauthorized, please sign in to a valid account.");
          close(req);
        }
      });
  } else {
    res.status(401).send("Please sign in before posting a review.");
    close(req);
  }

});

app.get('/catalog', connectDb, function(req, res) {
  var result = []
  req.db.query('SELECT * from Toppings', function (err, results) {
    if (err) throw errl
    result.push({'topping': results});
    req.db.query('SELECT * from Restaurant', function (err, results) {
      if (err) throw errl
      result.push({'restaurant': results});
      req.db.query('SELECT * from Pizzas', function (err, results) {
        if (err) throw errl
        result.push({'pizza': results});
        let wrapper = {objects: result}
        res.render("catalog", {wrapper});
        close(req);
      });
    });
  });
});
app.get('/pizzas/:pizzaID', connectDb, function(req,res) {
  var result = []
  req.db.query('SELECT * from Pizzas WHERE pizzaID =?',[req.params.pizzaID], function (err, results) {
    if (err) throw err
    result.push({'pizzas': results});
    req.db.query('SELECT * from select_Toppings WHERE pizzaID = ?',[req.params.pizzaID], function (err, results) {
      if (err) throw err
      result.push({'toppings': results});
      let wrapper = {objects: result}
      res.render("pizzas", {wrapper});
      close(req);

    });
  });
});
app.get('/locations', connectDb, function(req, res) {
  res.render("locations");
});

app.get('/get_locations', connectDb, function(req, res) {
  result = {}
  req.db.query('SELECT * from Cities', function (err, results) {
    if (err) throw errl
    result['cities'] = results;
    req.db.query('SELECT RestaurantID, rest_name, Zipcode from Restaurant', function (err, results) {
      result['restaurants'] = results;
      res.json(result);
      close(req);
    });
  });
});

app.get('/login_page', connectDb, function(req, res) {
  if('username' in req.session) {
    res.render('logged_in');
  } else {
    res.render("login_register");
  }
  close(req);
});

app.post('/login', connectDb, function(req, res) {
  req.db.query(
    "SELECT * from (select username, password FROM Employees UNION (select username, password from Users)) as u where u.username = ?",
    [req.body.username],
    function (err, results) {
      if (err) throw err;
      if(results.length == 1 && results[0]['password'] == md5(req.body.password)) {
        req.session.username = req.body.username;
        res.sendStatus(200);
      } else {
        res.status(401).send("Account not found.");
      }
      close(req);
    });
});

app.post('/register', connectDb, function(req, res) {
  req.db.query(
    "SELECT * from (select username, password FROM Employees UNION (select username, password from Users)) as u where u.username = ?",
    [req.body.username],
    function (err, results) {
      if (err) throw err;
      if(results.length == 0) {
        req.db.query(
          "INSERT INTO Users (Username, Password) VALUE (?, ?)",
          [req.body.username, md5(req.body.password)],
          function (err, results) {
            if (err) throw err;
            req.session.username = req.body.username;
            res.sendStatus(200);
            close(req);
          });
      } else {
        res.status(401).send("Username already exists, try a new one.");
        close(req);
      }
    });
});

app.get('/logout', connectDb, function(req, res) {
  delete req.session['username'];
  res.sendStatus(200);
});

/**
 * Handle all of the resources we need to clean up. In this case, we just need
 * to close the database connection.
 *
 * @param {Express.Request} req the request object passed to our middleware
 */
function close(req) {
  if (req.db) {
    req.db.end();
    req.db = undefined;
    console.log('Database connection closed');
  }
}

/**
 * Capture the port configuration for the server. We use the PORT environment
 * variable's value, but if it is not set, we will default to port 3000.
 */
const port = process.env.PORT || 3000;

/**
 * Start the server.
 */
app.listen(port, function() {
  console.log('== Server is listening on port', port);
});
