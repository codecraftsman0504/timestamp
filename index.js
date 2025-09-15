// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/whoami", function (req, res) {
  res.json({
    ipaddress: req.ip, // or req.headers['x-forwarded-for'] for proxies
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

let urlDatabase = {};
let counter = 1;
// POST endpoint to create short URL
app.post("/api/shorturl", function (req, res) {
  let originalUrl = req.body.url;

  // Validate URL format
  const urlRegex = /^(http:\/\/|https:\/\/)(www\.)?.+/i;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Store and return short URL
  let shortUrl = counter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl,
  });
});

// Redirect short URL to original
app.get("/api/shorturl/:short_url", function (req, res) {
  let shortUrl = req.params.short_url;
  let originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/:date?", function (req, res) {
  let dateParam = req.params.date;
  let date;

  if (!dateParam) {
    // No date provided → current date
    date = new Date();
  } else {
    // Check if it's a unix timestamp (all digits)
    if (/^\d+$/.test(dateParam)) {
      date = new Date(parseInt(dateParam));
    } else {
      date = new Date(dateParam);
    }
  }

  // Validate date
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
