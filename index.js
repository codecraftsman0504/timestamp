// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const router = require("./routes");

app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api", router);

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
