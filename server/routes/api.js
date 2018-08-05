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
const sessionStore = new MySQLStore({ options }/* session store options */, connection);

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

// Get Links by Link Type
router.get('/getlinks/:catId/:linkcategory/:status', (req, res) => {

    var catId = parseInt(req.params.catId);
    var linkcategory = req.params.linkcategory;
    var status = req.params.status;

    var sql = 'SELECT * FROM links WHERE catId = ? AND linkcategory = ? AND status = ? order by linktitle';

    connection.query(sql, [catId, linkcategory, status], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Get Links by Category
router.get('/getlinkscat/:catId/:status', (req, res) => {

    var catId = parseInt(req.params.catId);
    var status = req.params.status;

    var sql = 'SELECT * FROM links WHERE catId = ? AND status = ? order by linktitle';

    connection.query(sql, [catId, status], function (err, result) {
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

// Get Links for approval
router.get('/getlinksforapproval/:catId/:status/:role', (req, res) => {

    var catId = parseInt(req.params.catId);
    var status = req.params.status;
    var role = req.params.role;
    var sql;

    if (role == "Admin") {
        sql = 'SELECT * FROM links WHERE catId = ? AND status = ?';

        connection.query(sql, [catId, status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else {
        sql = 'SELECT * FROM links WHERE status = ?';

        connection.query(sql, [status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
});

// Get Links for approval by Category
router.get('/getlinksforapprovalcat/:catId/:status', (req, res) => {

    var catId = parseInt(req.params.catId);
    var status = req.params.status;
    var sql = 'SELECT * FROM links WHERE catId = ? AND status = ?';

    connection.query(sql, [catId, status], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Get Links by Category and Type
router.get('/getlinkbycat/:category/:type/:userId/:status', (req, res) => {

    var category = parseInt(req.params.category);
    var linkcategory = req.params.type;
    var userId = req.params.userId;
    var status = req.params.status;

    if (category === 1) {
        sql = "SELECT links.linkId, links.linktitle, links.linkdesc, links.linkurl, links.linkcategory, links.catId, favoritelinks.userId FROM links INNER JOIN favoritelinks ON links.linkId = favoritelinks.linkId WHERE linkcategory = ? AND userId = ? AND status = ? ORDER BY links.linktitle";

        connection.query(sql, [linkcategory, userId, status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else {
        sql = "SELECT links.linkId, links.linktitle, links.linkdesc, links.linkurl, links.linkcategory, links.catId, favoritelinks.userId FROM links LEFT JOIN (SELECT * FROM favoritelinks where userId = ?) AS favoritelinks ON links.linkId = favoritelinks.linkId WHERE catId = ? AND linkcategory = ? AND status = ? ORDER BY links.linktitle";

        connection.query(sql, [userId, category, linkcategory, status], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
});

// Get Training by Category
router.get('/training/:category', (req, res) => {

    var category = parseInt(req.params.category);

    var sql = 'SELECT * FROM training WHERE category = ?';

    connection.query(sql, [category], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Get Material by Category
router.get('/getmaterial/:category/:userId', (req, res) => {

    var category = parseInt(req.params.category);
    var userId = req.params.userId;

    //var sql = 'SELECT training.tid, training.title, training.tdesc, material.matid, material.mattitle, material.matdesc, material.maturl, material.mattype FROM training inner join material where training.tid = material.tid and training.category = ? order by training.title, material.mattype, material.mattitle';
    if (category === 1) {
        //var sql = 'SELECT mat.tid, mat.title, mat.tdesc, mat.matid, mat.mattitle, mat.matdesc, mat.maturl, mat.mattype, favoritematerial.userId FROM (SELECT training.tid, training.title, training.tdesc, material.matid, material.mattitle, material.matdesc, material.maturl, material.mattype FROM training inner join material where training.tid = material.tid and training.category = ? order by training.title, material.mattype, material.mattitle) AS mat INNER JOIN favoritematerial ON mat.matid = favoritematerial.matid WHERE userId = ?';

        var sql = 'SELECT training.tid, training.title, training.tdesc, mat.matid, mat.mattitle, mat.matdesc, mat.maturl, mat.mattype, mat.userId FROM training inner join (SELECT material.matid, material.mattitle, material.matdesc, material.maturl, material.tid, material.mattype, favoritematerial.userId from material inner join favoritematerial where material.matid = favoritematerial.matid and favoritematerial.userId = ?) as mat where training.tid = mat.tid ORDER BY training.title, mat.mattype, mat.mattitle';

        connection.query(sql, [userId], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else {
        var sql = 'SELECT mat.tid, mat.title, mat.tdesc, mat.matid, mat.mattitle, mat.matdesc, mat.maturl, mat.mattype, favoritematerial.userId FROM (SELECT training.tid, training.title, training.tdesc, material.matid, material.mattitle, material.matdesc, material.maturl, material.mattype FROM training inner join material where training.tid = material.tid and training.category = ? order by training.title, material.mattype, material.mattitle) AS mat LEFT JOIN (SELECT * FROM favoritematerial where userId = ?) AS favoritematerial ON mat.matid = favoritematerial.matid';

        connection.query(sql, [category, userId], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
});

// Get Rowspan for Training
router.get('/getrowspan/:category/:userId', (req, res) => {

    var category = parseInt(req.params.category);
    var userId = req.params.userId;

    var sql;

    if (category === 1) {
        sql = 'SELECT training.tid, training.title, count(*) as count FROM training inner join (SELECT material.matid, material.mattitle, material.matdesc, material.maturl, material.tid, material.mattype, favoritematerial.userId from material inner join favoritematerial where material.matid = favoritematerial.matid and favoritematerial.userId = ?) as mat where training.tid = mat.tid group by training.tid';
        connection.query(sql, [userId], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else {
        sql = 'SELECT training.tid, training.title, count(*) as count FROM training inner join material where training.tid = material.tid and training.category = ? group by training.tid';
        connection.query(sql, [category], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
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

// Delete Category
router.post('/deletecategory', (req, res) => {

    var catId = parseInt(req.body.catId);

    var sql = 'DELETE FROM categories WHERE catId = ?';

    connection.query(sql, [catId], function (err, result) {
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
    var category = req.body.category;

    var sql = 'INSERT INTO training (title, category, tdesc) VALUES (?,?,?)';

    connection.query(sql, [title, category, desc], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Add Material
router.post('/addmaterial', (req, res) => {

    var materialList = req.body.materialList;
    var records = [];

    for (var i = 0; i < materialList.length; i++) {
        records.push([materialList[i].mattitle, materialList[i].matdesc, materialList[i].maturl, materialList[i].tid, materialList[i].mattype]);
    }

    var sql = 'INSERT INTO material (mattitle, matdesc, maturl, tid, mattype) VALUES ?';

    connection.query(sql, [records], function (err, result) {
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

    if (catId === 1) {
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, favorite.userId FROM dashboard INNER JOIN favorite ON dashboard.dashId = favorite.dashId WHERE status = ? AND userId = ? ORDER BY dashboard.views DESC";

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
        sql = "SELECT dashboard.dashId, dashboard.dashname, dashboard.dashdesc, dashboard.imguri, dashboard.dashlink, dashboard.status, dashboard.catId, dashboard.age, dashboard.views, dashboard.unique_users, fav.userId FROM dashboard LEFT JOIN (SELECT * FROM favorite where userId = ?) AS fav ON dashboard.dashId = fav.dashId WHERE catId = ? AND status = ? ORDER BY dashboard.views DESC";

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

//Get Pending Dashboards
router.get('/pendingdashboards/:catId/:status/:role', (req, res) => {

    var catId = parseInt(req.params.catId);
    var status = req.params.status;
    var role = req.params.role;
    var sql;

    if (role === "Admin") {
        sql = "SELECT * FROM dashboard WHERE status = ? AND catId = ?";

        connection.query(sql, [status, catId], function (err, result) {
            if (err) {
                sendError(err, res);
            }
            else {
                sendResponse(result, res);
            }
        });
    }
    else {
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
});

//display Dashboard
router.get('/displaydashboard/:dashId', (req, res) => {

    var dashId = req.params.dashId;

    var sql = 'SELECT * FROM dashboard WHERE dashId=?';

    connection.query(sql, [dashId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//approve dashboard
router.get('/approvedashboard/:dashId', (req, res) => {

    var dashId = req.params.dashId;
    var status = "Approved";

    var sql = 'UPDATE dashboard SET status=? WHERE dashId=?';

    connection.query(sql, [status, dashId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//approve Links
router.get('/approvelinks/:linkid/:approvedby', (req, res) => {

    var linkid = req.params.linkid;
    var status = "Approved";
    var approvedby = req.params.approvedby;

    var sql = 'UPDATE links SET status=?, approvedby=? WHERE linkid=?';

    connection.query(sql, [status, approvedby, linkid], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//Update dashboard
router.post('/updatedashboard', (req, res) => {
    var dashId = req.body.dashId;
    var category = req.body.category;
    var dname = req.body.dname;
    var ddesc = req.body.ddesc;
    var dlink = req.body.dlink;
    var uusers = req.body.uusers;
    var views = req.body.views;
    var age = req.body.age;
    var imageuri = req.body.imageuri;
    var addedby = req.body.addedby;
    var approvedby = req.body.approvedby;
    //var status = req.body.status;

    var sql = 'UPDATE dashboard SET dashname=?, dashdesc=?, imguri=?, dashlink=?, catId=?, age=?, views=?, unique_users=?, addedby=?, approvedby=? WHERE dashId=?';

    connection.query(sql, [dname, ddesc, imageuri, dlink, category, age, views, uusers, addedby, approvedby, dashId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//delete dashboard
router.get('/deletedashboard/:dashId', (req, res) => {

    var dashId = req.params.dashId;

    var sql = 'DELETE FROM dashboard WHERE dashId=?';

    connection.query(sql, [dashId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

//delete links
router.get('/deletelinks/:linkid', (req, res) => {

    var linkid = req.params.linkid;

    var sql = 'DELETE FROM dashboard WHERE linkid=?';

    connection.query(sql, [linkid], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
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
    var catId = parseInt(req.body.catId);

    var sql = 'INSERT INTO users (userId, fname, lname, role, status, password, catId) VALUES (?,?,?,?,?,?,?)';

    connection.query(sql, [email, fname, lname, role, status, password, catId], function (err, result) {
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
    var catId = parseInt(req.body.catId);

    var sql = 'UPDATE users SET userId=?, fname=?, lname=?, role=?, status=?, password=?, catId=? WHERE userId=?';

    connection.query(sql, [email, fname, lname, role, status, password, catId, email], function (err, result) {
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

// Add links to favorite
router.post('/addlinkfavorite', (req, res) => {

    var linkId = req.body.linkId;
    var userId = req.body.userId;

    var sql = 'INSERT INTO favoritelinks (userId, linkId) VALUES (?,?)';

    connection.query(sql, [userId, linkId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Add material to favorite
router.post('/addtrainingfavorite', (req, res) => {

    var matid = req.body.matid;
    var userId = req.body.userId;

    var sql = 'INSERT INTO favoritematerial (userId, matid) VALUES (?,?)';

    connection.query(sql, [userId, matid], function (err, result) {
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

// Remove links to favorite
router.post('/removelinkfavorite', (req, res) => {

    var linkId = req.body.linkId;
    var userId = req.body.userId;

    var sql = 'DELETE FROM favoritelinks WHERE linkId = ? AND userId = ?';

    connection.query(sql, [linkId, userId], function (err, result) {
        if (err) {
            sendError(err, res);
        }
        else {
            sendResponse(result, res);
        }
    });
});

// Remove material to favorite
router.post('/removetrainingfavorite', (req, res) => {

    var matid = req.body.matid;
    var userId = req.body.userId;

    var sql = 'DELETE FROM favoritematerial WHERE matid = ? AND userId = ?';

    connection.query(sql, [matid, userId], function (err, result) {
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
    var addedby = req.body.addedby;
    var approvedby = req.body.approvedby;

    var sql = 'INSERT INTO dashboard (dashname, dashdesc, imguri, dashlink, status, catId, age, views, unique_users, addedby, approvedby) VALUES (?,?,?,?,?,?,?,?,?,?,?)';

    connection.query(sql, [dname, ddesc, imageuri, dlink, status, category, age, views, uusers, addedby, approvedby], function (err, result) {
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
    var status = req.body.status;
    var addedby = req.body.addedby;
    var approvedby = req.body.approvedby;

    var sql = 'INSERT INTO links (linktitle, linkdesc, linkurl, linkcategory, catId, status, addedby, approvedby) VALUES (?,?,?,?,?,?,?,?)';

    connection.query(sql, [linktitle, linkdesc, linkurl, linkcategory, catId, status, addedby, approvedby], function (err, result) {
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
    var status = req.body.status;
    var addedby = req.body.addedby;
    var approvedby = req.body.approvedby;

    var sql = 'UPDATE links SET linktitle=?, linkdesc=?, linkurl=?, linkcategory=?, catId=?, status=?, addedby=?, approvedby=? WHERE linkid=?';

    connection.query(sql, [linktitle, linkdesc, linkurl, linkcategory, catId, status, addedby, approvedby, linkid], function (err, result) {
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