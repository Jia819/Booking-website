var express = require('express');
var router = express.Router();
var CLIENT_ID = '476828837879-ql8u52s5u72kijn96odo9vu8ep5dtr6m.apps.googleusercontent.com';
var {
  OAuth2Client
} = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);

var userData = [];
var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("home.html");
});

//Get user Data from Database
router.post('/register.json', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var q = "SELECT username, email FROM user INNER JOIN userInfo " +
      "ON user.UID = userInfo.UID;";
    connection.query(q, function(err, rows, fields) {
      connection.release();
      userData = rows;
      //Call this function after we retrive the data
      callback();
    });
  });

  function callback() {
    //check whether the username is already registered
    var i;
    var isRepeat = false;
    for (i = 0; i < userData.length; i++) {
      isRepeat = (req.body.username === userData[i].username) ? true : isRepeat;
      isRepeat = (req.body.email === userData[i].email) ? true : isRepeat;
    }

    if (isRepeat) {
      res.status(500).json({
        error: "Username/Email has already been registered"
      });
    } else {
      //record user's details in session
      var count = userData.length + 1;
      sess = req.session;
      sess.username = req.body.username;
      sess.first_name = req.body.first_name;
      sess.last_name = req.body.last_name;
      sess.email = req.body.email;
      sess.UID = count;
      sess.auth_level = 1;
      sess.img = "/images/user-image.png";

      //if it's a valid username, record the user info to database and send 200 ok
      res.status(200).jsonp({
        message: "ok"
      });

      req.pool.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        var q = "INSERT INTO user (UID, username, password, auth_level) " +
          "VALUES ( ? , ? , ? , ?);";
        connection.query(q, [count, req.body.username, req.body.password, 1], function(err, rows, fields) {
          if (err) throw err;
          connection.release();
        });
      });

      req.pool.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        var q = "INSERT INTO userInfo (UID, first_name, last_name, email, img) " +
          "VALUES ( ? , ? , ? , ? , ? );";
        connection.query(q, [count, req.body.first_name, req.body.last_name, req.body.email, '/images/user-image.png'], function(err, rows, fields) {
          if (err) throw err;
          connection.release();
        });
      });
    }
  }
});

router.get('/restaurant/reviews/list', function(req, res, next) {
  var rid = req.query.rid;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    connection.query('SELECT * FROM posts WHERE RID = ?;', [rid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.status(200).json(rows);
    });
  });
});

router.post('/reviews/add.json', function(req, res, next) {
  var body = req.body;
  console.log(body);
  req.pool.getConnection( function(err, connection){
    if (err) throw err;
    var q = "INSERT INTO posts (name, date, time, img, content, RID, marks) "+
            "VALUES ( ? , ? , ? , ? , ? , ? , ? );";

    connection.query(q, [body.name, body.date, body.time, body.img, body.content, body.rid, body.marks], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.sendStatus(200);
    });
  });
});

router.post('/login.json', function(req, res, next) {
  if (req.body.idtoken !== undefined) {
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.body.idtoken,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      return payload;
      // If request specified a G Suite domain:
      //const domain = payload['hd'];
    }
    verify().then(
      function(user_ticket){
        req.pool.getConnection(function(err, connection) {
          if (err) throw err;
          var q = 'SELECT * FROM user INNER JOIN userInfo ON user.UID = userInfo.UID '+
                  'WHERE user.google_id = ?;';
          connection.query(q, [user_ticket['sub']], function(err, rows, fields) {
            if (err) throw err;
            connection.release();

            if(!rows.length){
              var uid = 0;
              req.pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query('SELECT UID FROM user', function(err, rows, fields) {
                  if (err) throw err;
                  connection.release();
                  uid = rows[rows.length-1].UID + 1;
                  register(uid, user_ticket);
                  res.sendStatus(200);
                });
              });
            }
            else{
              sess = req.session;
              sess.first_name = rows[0].first_name;
              sess.last_name = rows[0].last_name;
              sess.email = rows[0].email;
              sess.UID = rows[0].UID;
              sess.auth_level = rows[0].auth_level;
              sess.img = rows[0].img;
              sess.address = rows[0].address;
              sess.phone = rows[0].phone;
              sess.postcode = rows[0].postcode;
              sess.google = 1;
              res.sendStatus(200);
            }
          });
        });
      }
    ).catch(console.error);
  } else {
    req.pool.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      var login_with = req.body.username.includes('@') ? "userInfo.email" : "user.username";
      var q = "SELECT * FROM user INNER JOIN userInfo " +
        "ON user.UID = userInfo.UID WHERE " + login_with + " = ?;";
      connection.query(q, [req.body.username], function(err, rows, fields) {
        if (err) throw err;
        connection.release();
        userData = rows;
        if (userData.length !== 0) {
          validateUser();
        } else {
          return res.status(500).json({
            error: "User doesn't exist!"
          });
        }
      });
    });
  }

  function register(uid, user_ticket){
    sess = req.session;
    sess.first_name = user_ticket['given_name'];
    sess.last_name = user_ticket['family_name'];
    sess.email = user_ticket['email'];
    sess.UID = uid;
    sess.auth_level = 1;
    sess.img = user_ticket['picture'];
    sess.google = TRUE;
    req.pool.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      var q = "INSERT INTO user (UID, google_id, auth_level) " +
              "VALUES ( ? , ? , ? );";
      connection.query(q, [uid, user_ticket['sub'], 1], function(err, rows, fields) {
        if (err) throw err;
        connection.release();
      });
    });

    req.pool.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      var q = "INSERT INTO userInfo (UID, first_name, last_name, email, img) " +
              "VALUES ( ? , ? , ? , ? , ? );";
      connection.query(q, [uid, user_ticket['given_name'], user_ticket['family_name'], user_ticket['email'], user_ticket['picture']], function(err, rows, fields) {
        if (err) throw err;
        connection.release();
      });
    });
  }

  function validateUser() {
    if (userData[0].password === req.body.password) {
      sess = req.session;
      sess.username = userData[0].username;
      sess.first_name = userData[0].first_name;
      sess.last_name = userData[0].last_name;
      sess.email = userData[0].email;
      sess.UID = userData[0].UID;
      sess.auth_level = userData[0].auth_level;
      sess.img = userData[0].img;
      sess.address = userData[0].address;
      sess.phone = userData[0].phone;
      sess.postcode = userData[0].postcode;
      res.sendStatus(200);
    } else {
      return res.status(500).json({
        error: "Password Incorrect!"
      });
    }
  }
});

router.get('/search', function(req, res, next) {
  var meal;
  if (req.query.time <= 11) {
    meal = 'resData.breakfast';
  } else if (req.body.time <= 18) {
    meal = 'resData.lunch';
  } else {
    meal = 'resData.dinner';
  }
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    req.query.text = '%' + req.query.text + '%';
    var q = "SELECT * FROM resInfo INNER JOIN resData ON resInfo.RID = resData.RID " +
      "WHERE (resInfo.res_name LIKE ? OR resInfo.city LIKE ? OR resInfo.description LIKE ? ) " +
      "AND ?? = 1;";
    connection.query(q, [req.query.text, req.query.text, req.query.text, meal], function(err, rows, fields) {
      if (err) throw err;
      connection.release();
      res.status(200).json(rows);
    });
  });
});

router.post('/book.json', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) throw err;
    var q = "SELECT REF FROM booking;";
    connection.query(q, function(err, rows, fields) {
      if (err) throw err;
      connection.release();
      var ref;
      if (rows.length) {
        ref = rows[rows.length - 1].REF + 1;
      } else {
        ref = 1;
      }
      callback(ref);
    });
  });

  function callback(ref) {
    var low_interval;
    var high_interval;
    if (req.body.time_int <= 11) {
      low_interval = 7;
      high_interval = 11;
    } else if (req.body.time_int <= 18) {
      low_interval = 12;
      high_interval = 18;
    } else {
      low_interval = 19;
      high_interval = 23;
    }
    var body = req.body;
    req.pool.getConnection(function(err, connection) {
      if (err) throw err;
      var q = "SELECT available_seats FROM booking " +
        "WHERE RID = ? AND date = ? AND time >= ? AND time <= ?;";
      connection.query(q, [body.resid, body.date, low_interval, high_interval], function(err, rows, fields) {
        if (err) throw err;
        connection.release();
        var seats;
        if (!rows.length) {
          getSeats(body.resid, body, ref);
        } else {
          seats = rows[rows.length - 1].available_seats;
          record(seats, body, ref);
        }
      });
    });
  }

  function getSeats(resid, body, ref) {
    req.pool.getConnection(function(err, connection) {
      if (err) throw err;
      var q = "SELECT seats FROM resData " +
        "WHERE RID = ?;";
      connection.query(q, [resid], function(err, rows, fields) {
        if (err) throw err;
        connection.release();
        record(rows[0].seats, body, ref);
      });
    });
  }

  function record(seats, body, ref) {
    req.pool.getConnection(function(err, connection) {
      if (err) throw err;
      var q = "INSERT INTO booking (UID, RID, date, pax, available_seats, time, REF) " +
        "VALUES ( ? , ? , ? , ? , ? , ? , ? );";
      connection.query(q, [body.uid, body.resid, body.date, body.seats, seats, body.time_int, ref], function(err, rows, fields) {
        if (err) throw err;
        connection.release();
        res.sendStatus(200);
      });
    });
  }
});

module.exports = router;
