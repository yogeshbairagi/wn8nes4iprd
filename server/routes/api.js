const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const multer = require("multer");
const fs = require("fs");
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// Database Connection management

const options = {
    // Host name for database connection:
    host: 'localhost',
    // Port number for database connection:
    port: 3308,
    // Database user:
    user: 'root',
    // Password for the above database user:
    password: 'admin',
    // Database name:
    database: 'wn8nes4iprd',
    // Whether or not to automatically check for and clear expired sessions:
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 900000,
    // The maximum age of a valid session; milliseconds:
    expiration: 86400000,
    // Whether or not to create the sessions database table, if one does not already exist:
    createDatabaseTable: true,
    // Number of connections when creating a connection pool:
    connectionLimit: 1,
    // Whether or not to end the database connection when the store is closed.
    // The default value of this option depends on whether or not a connection was passed to the constructor.
    // If a connection object is passed to the constructor, the default value for this option is false.
    endConnectionOnClose: true,
    charset: 'utf8mb4_bin',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const connection = mysql.createConnection(options); // or mysql.createPool(options);
const sessionStore = new MySQLStore({options}/* session store options */, connection);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

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

    connection.query(sql, function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Get Users
router.get('/getusers', (req, res) => {

    var sql = 'SELECT * FROM users order by fname';

    connection.query(sql, function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Get Links by category
router.get('/getlinks/:linkcategory', (req, res) => {

    var linkcategory = req.params.linkcategory;

    var sql = 'SELECT * FROM links WHERE linkcategory = ? order by linktitle';

    connection.query(sql, [linkcategory], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Get Links by ID
router.get('/getlinkbyid/:linkid', (req, res) => {

    var linkid = req.params.linkid;

    var sql = 'SELECT * FROM links WHERE linkid = ?';

    connection.query(sql, [linkid], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
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

    connection.query(sql, function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Add Category
router.post('/addcategory', (req, res) => {

    var catDesc = req.body.catDesc;

    var sql = 'INSERT INTO categories (catDesc, visibleTo) VALUES (?, ?)';

    connection.query(sql, [catDesc, "All"], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
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

        connection.query(sql, [status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else if (catId === 1) {
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, favorite.userId FROM dashboard INNER JOIN favorite ON dashboard.dashId = favorite.dashId WHERE status = ? AND userId = ?";

        connection.query(sql, [status, userId], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else {
        //sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, favorite.userId FROM dashboard LEFT JOIN favorite ON dashboard.dashId = favorite.dashId WHERE catId = ? AND status = ?";
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, fav.userId FROM dashboard LEFT JOIN (SELECT * FROM favorite where userId = ?) AS fav ON dashboard.dashId = fav.dashId WHERE catId = ? AND status = ?";

        connection.query(sql, [userId, catId, status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
});

//count Favorites
router.get('/favoritecount/:email', (req, res) => {

    var email = req.params.email;

    var sql = 'SELECT count(*) as count FROM favorite WHERE userId = ?';

    connection.query(sql, [email], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//Change password
router.post('/changepassword', (req, res) => {

    var email = req.body.uname;
    var password = req.body.password;

    var sql = 'UPDATE users SET password=? WHERE userId=?';

    connection.query(sql, [password, email], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// User login
router.get('/login/:email', (req, res) => {

    var email = req.params.email;

    var sql = 'SELECT * FROM users WHERE userId = ?';

    connection.query(sql, [email], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
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

    connection.query(sql, [email, fname, lname, role, status, password], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
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

    connection.query(sql, [email, fname, lname, role, status, password, email], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//Delete user
router.post('/deleteuser', (req, res) => {

    var email = req.body.uname;

    var sql = 'DELETE FROM users WHERE userId=?';

    connection.query(sql, [email], function (err, result) {
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

// Add Training
router.post('/addtraining', (req, res) => {

    var title = req.body.title;
    var desc = req.body.desc;

    var sql = 'call wn8nes4iprd.create_training(?, ?)';

    connection.query(sql, [title, desc], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
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

    connection.query(sql, [linktitle, linkdesc, linkurl, linkcategory, catId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
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

    connection.query(sql, [linktitle, linkdesc, linkurl, linkcategory, catId, linkid], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//Delete Link
router.post('/deletelink', (req, res) => {

    var linkid = req.body.linkid;

    var sql = 'DELETE FROM links WHERE linkid=?';

    connection.query(sql, [linkid], function (err, result) {
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