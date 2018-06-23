const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const multer = require("multer");
const fs = require("fs");
const app = express();

// Connect
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: 'admin',
    database: 'wn8nes4iprd'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
});

// Error handling
const sendError = (err, res) => {
    response.data = [];
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.json(response);
};

// Response return
const sendResponse = (result, res) => {
    response.data = result;
    response.status = 200;
    response.message = null;
    res.json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

//Get Categories
router.get('/categories/:purpose', (req, res) => {

    var purpose = req.params.purpose;
    var sql = "SELECT * FROM categories";

    if (purpose === "drop") {
        sql = sql + " WHERE visibleTo = 'All'";
    }

    connection.query(sql, function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//Get Dashboards
router.get('/dashboards/:catId/:status', (req, res) => {

    var catId = parseInt(req.params.catId);
    var status = req.params.status;
    var sql;

    if(catId == 0)
    {
        sql = "SELECT * FROM dashboard WHERE status = ?";

        connection.query(sql, [status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else if (catId == 1) {
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, favorite.userId FROM dashboard INNER JOIN favorite ON dashboard.dashId = favorite.dashId WHERE status = ?";

        connection.query(sql, [status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else {
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, favorite.userId FROM dashboard LEFT JOIN favorite ON dashboard.dashId = favorite.dashId WHERE catId = ? AND status = ?";

        connection.query(sql, [catId, status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
});

// User login
router.get('/login/:email', (req, res) => {

    var email = req.params.email;

    var sql = 'SELECT * FROM users WHERE userId = ?';

    connection.query(sql, [email], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        response.data = result;
        res.json(response);
    });
});

// User signup
router.post('/signup', (req, res) => {

    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.uname;
    var role = req.body.role;
    var status = req.body.status;

    var sql = 'INSERT INTO users (userId, fname, lname, role, status) VALUES (?,?,?,?,?)';

    connection.query(sql, [email, fname, lname, role, status], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Add dashboard to favorite
router.post('/addfavorite', (req, res) => {

    var dashId = req.body.dashId;
    var userId = req.body.userId;

    var sql = 'INSERT INTO favorite (userId, dashId) VALUES (?,?)';

    connection.query(sql, [userId, dashId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Remove dashboard to favorite
router.post('/removefavorite', (req, res) => {

    var dashId = req.body.dashId;
    var userId = req.body.userId;

    var sql = 'DELETE FROM favorite WHERE dashId = ? AND userId = ?';

    connection.query(sql, [dashId, userId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Add dashboard
router.post('/adddashboard', (req, res) => {

    var category = req.body.category;
    var dname = req.body.dname;
    var ddesc = req.body.ddesc;
    var dlink = req.body.dlink;
    var uusers = req.body.uusers;
    var views = req.body.views;
    var age = req.body.age;
    var imageuri = req.body.imageuri;
    var status = req.body.status;

    var sql = 'INSERT INTO dashboard (dashname, dashdesc, imguri, dashlink, status, catId, age, views, unique_users) VALUES (?,?,?,?,?,?,?,?,?)';

    connection.query(sql, [dname, ddesc, imageuri, dlink, status, category, age, views, uusers], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//file upload
var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

var upload = multer({ storage: store }).single('file');

router.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(501).json({ error: err });
        }
        return res.json({ originalname: req.file.originalname, uploadname: req.file.filename, filepath: req.file.path });
    });
});

module.exports = router;