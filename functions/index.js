const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const { rawBody, busBoyUpload } = require("./lib/middleware");
const create = require("./api/create");
const get = require("./api/get");
const list = require("./api/list");
const fileUpload = require("./api/fileUpload");

const app = express();

app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));
app.use(compression());
app.use(rawBody);
app.use(busBoyUpload);

app.post("/", create);
app.get("/:id", get);
app.get("/:limit/:offsetId", list);
app.post("/upload", fileUpload);

exports.rent = functions.https.onRequest(app);
