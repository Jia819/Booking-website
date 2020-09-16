var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'public/images/uploads' });

var sess;

var userData = [];
var resData = [];

/* GET users listing. */
router.get('/', function(req, res, next) {
  sess = req.session;
  if(sess.auth_level) {
    return res.status(200).json(sess);
  }
  next();
});

router.get('/logout', function(req, res, next) {
  sess = req.session;
  if (sess.auth_level) {
    req.session.destroy(function(err) {
      if (err) throw err;
      res.status(200).json({google: sess.google});
    });
  } else {
    res.sendStatus(200);
  }
});

router.post('/restaurant/add.json', function(req, res, next) {
  req.pool.getConnection( function(err, connection){
    if (err) {
      throw err;
    }
    connection.query("SELECT RID FROM resInfo;", function(err, rows, fields){
      if (err) throw err;
      connection.release();
      var count = rows.length + 1;
      addRestaurant(count);
    });
  });

  function addRestaurant(res_RID){
    req.pool.getConnection( function(err, connection){
      if (err) {
        throw err;
      }
      var q = "INSERT INTO resInfo (RID, res_name, city, res_address, res_contact, description, image) " +
              "VALUES ( ? , ? , ? , ? , ? , ? , ? );";
      connection.query(q, [res_RID, req.body.res_name, req.body.res_city, req.body.res_address, req.body.res_contact, '', '/images/sample-restaurant.png'], function(err, rows, fields){
        if (err) throw err;
        connection.release();
      });
    });

    req.pool.getConnection( function(err, connection){
      if (err) {
        throw err;
      }
      var q = "INSERT INTO link_res (UID, RID) " +
              "VALUES ( ? , ? );";
      connection.query(q, [req.body.user_UID, res_RID], function(err, rows, fields){
        if (err) throw err;
        connection.release();
      });
    });

    req.pool.getConnection( function(err, connection){
      if (err) {
        throw err;
      }
      var q = "INSERT INTO resData (RID, breakfast, lunch, dinner, seats) " +
              "VALUES ( ? , ? , ? , ? , ? );";

      connection.query(q, [res_RID, 0, 0, 0, 0], function(err, rows, fields){
        if (err) throw err;
        connection.release();
      });
    });

    if(req.session.auth_level === 1){
      req.pool.getConnection( function(err, connection){
        if (err) {
          throw err;
        }
        var q = "UPDATE user SET auth_level = ? " +
                "WHERE UID = ?;";
        connection.query(q, [2, req.body.user_UID], function(err, rows, fields){
          if (err) throw err;
          connection.release();
        });
      });
      req.session.auth_level = 2;
    }
    res.sendStatus(200);
  }
});

router.get('/restaurant/list', function(req, res, next) {
  var user_UID = req.query.uid;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "SELECT * FROM resInfo INNER JOIN link_res ON resInfo.RID = link_res.RID "+
            "INNER JOIN resData ON resInfo.RID = resData.RID WHERE link_res.UID = ?;"

    connection.query(q, [user_UID], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      if(!rows.length){
        return res.status(500).json({"error" : "No restaurant found!"});
      }
      res.status(200).json(rows);
    });
  });
});

router.get('/restaurant/booking', function(req, res, next) {
  var res_id = req.query.rid;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "SELECT * FROM userInfo INNER JOIN booking ON booking.UID = userInfo.UID "+
            "WHERE booking.RID = ?;"

    connection.query(q, [res_id], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.status(200).json(rows);
    });
  });
});

router.post('/restaurant/modify.json', function(req, res, next) {
  var body = req.body;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "UPDATE resInfo "+
            "SET res_name = ? , city = ? , res_address = ? , res_contact = ? , description = ? "+
            "WHERE RID = ?;"

    connection.query(q, [body.name, body.city, body.address, body.contact, body.description, body.rid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
    });
  });

  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "UPDATE resData "+
            "SET breakfast = ? , lunch = ? , dinner = ? , seats = ? "+
            "WHERE RID = ?;"

    connection.query(q, [body.breakfast, body.lunch, body.dinner, body.seats, body.rid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.sendStatus(200);
    });
  });
});

router.post('/modify.json', function(req, res, next) {
  var body = req.body;
  sess = req.session;
  sess.first_name = body.first;
  sess.last_name = body.last;
  sess.email = body.email;
  sess.address = body.address;
  sess.phone = body.contact;
  sess.postcode = body.postcode;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "UPDATE userInfo "+
            "SET first_name = ? , last_name = ? , email = ? , address = ? , phone = ? , postcode = ? "+
            "WHERE UID = ?;"

    connection.query(q, [body.first, body.last, body.email, body.address, body.contact, body.postcode, body.uid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.sendStatus(200);
    });
  });
});

router.get('/booking/remove', function(req, res, next) {
  var ref = req.query.ref;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "DELETE FROM booking "+
            "WHERE REF = ?;"

    connection.query(q, [ref], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.sendStatus(200);
    });
  });
});

router.get('/restaurant/remove', function(req, res, next) {
  var rid = req.query.rid;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "DELETE FROM resData "+
            "WHERE RID = ?;"

    connection.query(q, [rid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
    });
  });

  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "DELETE FROM resInfo "+
            "WHERE RID = ?;"

    connection.query(q, [rid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
    });
  });

  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "DELETE FROM link_res "+
            "WHERE RID = ?;"

    connection.query(q, [rid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.sendStatus(200);
    });
  });
});

router.post('/password', function(req, res, next){
  let body = req.body;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "SELECT * FROM user "+
            "WHERE UID = ? AND password = ?;"

    connection.query(q, [body.uid, body.password_old], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      if(rows.length){
        callback(body);
      }else{
        res.status(500).json({error: "Old password not correct"});
      }
    });
  });

  function callback(body){
    req.pool.getConnection( function(err, connection){
      if (err) throw err;

      var q = "UPDATE user "+
              "SET password = ? WHERE UID = ?;";

      connection.query(q, [body.password_new, body.uid], function(err, rows, fields){
        if (err) throw err;
        connection.release();
        res.sendStatus(200);
      });
    });
  }
});

router.get('/booking', function(req, res, next){
  var user_UID = req.query.uid;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "SELECT * FROM booking INNER JOIN resInfo ON resInfo.RID = booking.RID "+
            "WHERE booking.UID = ?;"

    connection.query(q, [user_UID], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.status(200).json(rows);
    });
  });
});

router.post('/booking/modify.json', function(req, res, next) {
  var body = req.body;
  req.pool.getConnection( function(err, connection){
    if (err) throw err;

    var q = "UPDATE booking "+
            "SET date = ? , pax = ? , time = ? "+
            "WHERE REF = ? ;"

    connection.query(q, [body.date, body.seats, body.time, body.ref], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.sendStatus(200);
    });
  });
});

router.post('/uploadimg', upload.single('avatar'), function (req, res, next) {
  req.pool.getConnection( function(err, connection){
    if (err) throw err;
    var q = "UPDATE userInfo "+
            "SET img = ? "+
            "WHERE UID = ?;"

    var newPath = "/images/uploads/" + req.file.filename;

    connection.query(q, [newPath, req.body.uid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      req.session.img = newPath;
      res.redirect("/users/profile.html");
    });
  });
});

router.post('/uploadres', upload.single('avatar'), function (req, res, next) {
  req.pool.getConnection( function(err, connection){
    if (err) throw err;
    var q = "UPDATE resInfo "+
            "SET image = ? "+
            "WHERE RID = ?;"

    var newPath = "/images/uploads/" + req.file.filename;

    connection.query(q, [newPath, req.body.rid], function(err, rows, fields){
      if (err) throw err;
      connection.release();
      res.redirect("/users/profile.html");
    });
  });
});

module.exports = router;
