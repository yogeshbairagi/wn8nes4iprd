const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const multer = require("multer");
const fs = require("fs");
const app = express();

// Database Connection management

var connection;

const connectdb = () => {
    connection = mysql.createConnection({
        host: 'localhost',
        port: '3308',
        user: 'root',
        password: 'admin',
        database: 'wn8nes4iprd'
    });

    connection.connect(function (err) {
        if (err) throw err;
    });
}

const releasedb = () => {
    connection.end(function (err) {
        if (err) throw err;
    });
}

// Error handling
const sendError = (err, res) => {
    response.data = [];
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.json(response);
};

// Response Handling
const sendResponse = (result, res) => {
    response.data = result;
    response.status = 200;
    response.message = null;
    res.json(response);
};

// Response content
let response = {
    status: 200,
    data: [],
    message: null
};

// Get User Roles
router.get('/roles', (req, res) => {

    var sql = 'SELECT distinct role FROM users order by role desc';

    connectdb();

    connection.query(sql, function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Get Users
router.get('/getusers', (req, res) => {

    var sql = 'SELECT * FROM users order by fname';

    connectdb();

    connection.query(sql, function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Get Links by category
router.get('/getlinks/:linkcategory', (req, res) => {

    var linkcategory = req.params.linkcategory;

    var sql = 'SELECT * FROM links WHERE linkcategory = ? order by linktitle';

    connectdb();

    connection.query(sql, [linkcategory], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Get Links by ID
router.get('/getlinkbyid/:linkid', (req, res) => {

    var linkid = req.params.linkid;

    var sql = 'SELECT * FROM links WHERE linkid = ?';

    connectdb();

    connection.query(sql, [linkid], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

//Get Categories
router.get('/categories/:purpose', (req, res) => {

    var purpose = req.params.purpose;
    var sql = "SELECT * FROM categories";

    if (purpose === "drop") {
        sql = sql + " WHERE visibleTo = 'All'";
    }

    connectdb();

    connection.query(sql, function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Add Category
router.post('/addcategory', (req, res) => {

    var catDesc = req.body.catDesc;

    var sql = 'INSERT INTO categories (catDesc, visibleTo) VALUES (?, ?)';

    connectdb();

    connection.query(sql, [catDesc, "All"], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

//Get Dashboards
router.get('/dashboards/:catId/:status/:userId', (req, res) => {

    var catId = parseInt(req.params.catId);
    var status = req.params.status;
    var userId = req.params.userId;
    var sql;

    if (catId === 0) {
        sql = "SELECT * FROM dashboard WHERE status = ?";

        connectdb();

        connection.query(sql, [status], function (err, result) {
            if (err) {
                releasedb();
                sendError(err, res);
            }
            else {
                releasedb();
                sendResponse(result, res);
            }
        });
    }
    else if (catId === 1) {
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, favorite.userId FROM dashboard INNER JOIN favorite ON dashboard.dashId = favorite.dashId WHERE status = ? AND userId = ?";

        connectdb();

        connection.query(sql, [status, userId], function (err, result) {
            if (err) {
                releasedb();
                sendError(err, res);
            }
            else {
                releasedb();
                sendResponse(result, res);
            }
        });
    }
    else {
        //sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, favorite.userId FROM dashboard LEFT JOIN favorite ON dashboard.dashId = favorite.dashId WHERE catId = ? AND status = ?";
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, fav.userId FROM dashboard LEFT JOIN (SELECT * FROM favorite where userId = ?) AS fav ON dashboard.dashId = fav.dashId WHERE catId = ? AND status = ?";
        
        connectdb();

        connection.query(sql, [userId, catId, status], function (err, result) {
            if (err) {
                releasedb();
                sendError(err, res);
            }
            else {
                releasedb();
                sendResponse(result, res);
            }
        });
    }
});

//count Favorites
router.get('/favoritecount/:email', (req, res) => {

    var email = req.params.email;

    var sql = 'SELECT count(*) as count FROM favorite WHERE userId = ?';

    connectdb();

    connection.query(sql, [email], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

//Change password
router.post('/changepassword', (req, res) => {

    var email = req.body.uname;
    var password = req.body.password;

    var sql = 'UPDATE users SET password=? WHERE userId=?';

    connectdb();

    connection.query(sql, [password, email], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// User login
router.get('/login/:email', (req, res) => {

    var email = req.params.email;

    var sql = 'SELECT * FROM users WHERE userId = ?';

    connectdb();

    connection.query(sql, [email], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else
        {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// User signup
router.post('/signup', (req, res) => {

    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.uname;
    var role = req.body.role;
    var status = req.body.status;
    var password = req.body.password;

    var sql = 'INSERT INTO users (userId, fname, lname, role, status, password) VALUES (?,?,?,?,?,?)';

    connectdb();

    connection.query(sql, [email, fname, lname, role, status, password], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

//Update user
router.post('/updateuser', (req, res) => {

    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.uname;
    var role = req.body.role;
    var status = req.body.status;
    var password = req.body.password;

    var sql = 'UPDATE users SET userId=?, fname=?, lname=?, role=?, status=?, password=? WHERE userId=?';

    connectdb();

    connection.query(sql, [email, fname, lname, role, status, password, email], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

//Delete user
router.post('/deleteuser', (req, res) => {

    var email = req.body.uname;
    
    var sql = 'DELETE FROM users WHERE userId=?';

    connectdb();

    connection.query(sql, [email], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Add dashboard to favorite
router.post('/addfavorite', (req, res) => {

    var dashId = req.body.dashId;
    var userId = req.body.userId;

    var sql = 'INSERT INTO favorite (userId, dashId) VALUES (?,?)';

    connectdb();

    connection.query(sql, [userId, dashId], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Remove dashboard to favorite
router.post('/removefavorite', (req, res) => {

    var dashId = req.body.dashId;
    var userId = req.body.userId;

    var sql = 'DELETE FROM favorite WHERE dashId = ? AND userId = ?';

    connectdb();

    connection.query(sql, [dashId, userId], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
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

    connectdb();

    connection.query(sql, [dname, ddesc, imageuri, dlink, status, category, age, views, uusers], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Add Links
router.post('/addlinks', (req, res) => {

    var linktitle = req.body.linktitle;
    var linkdesc = req.body.linkdesc;
    var linkurl = req.body.linkurl;
    var linkcategory = req.body.linkcategory;
    var catId = req.body.catId;
    
    var sql = 'INSERT INTO links (linktitle, linkdesc, linkurl, linkcategory, catId) VALUES (?,?,?,?,?)';

    connectdb();

    connection.query(sql, [linktitle, linkdesc, linkurl, linkcategory, catId], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

// Update Links
router.post('/updatelinks', (req, res) => {

    var linktitle = req.body.linktitle;
    var linkdesc = req.body.linkdesc;
    var linkurl = req.body.linkurl;
    var linkcategory = req.body.linkcategory;
    var catId = req.body.catId;
    var linkid = req.body.linkid;
    
    var sql = 'UPDATE links SET linktitle=?, linkdesc=?, linkurl=?, linkcategory=?, catId=? WHERE linkid=?';

    connectdb();

    connection.query(sql, [linktitle, linkdesc, linkurl, linkcategory, catId, linkid], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
            sendResponse(result, res);
        }
    });
});

//Delete Link
router.post('/deletelink', (req, res) => {

    var linkid = req.body.linkid;
    
    var sql = 'DELETE FROM links WHERE linkid=?';

    connectdb();

    connection.query(sql, [linkid], function (err, result) {
        if (err) {
            releasedb();
            sendError(err, res);
        }
        else {
            releasedb();
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