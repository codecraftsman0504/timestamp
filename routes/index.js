const router = require("express").Router();
const userRouter = require("./user.router");
var multer = require("multer");

var upload = multer({ storage: multer.memoryStorage() });

// your first API endpoint...
router.get("/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

router.get("/whoami", function (req, res) {
  res.json({
    ipaddress: req.ip, // or req.headers['x-forwarded-for'] for proxies
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

let urlDatabase = {};
let counter = 1;
// POST endpoint to create short URL
router.post("/shorturl", function (req, res) {
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
router.get("/shorturl/:short_url", function (req, res) {
  let shortUrl = req.params.short_url;
  let originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: "invalid url" });
  }
});

router.use("/users", userRouter);

router.post("/fileanalyse", upload.single("upfile"), function (req, res) {
  if (!req.file) {
    return res.json({ error: "No file uploaded" });
  }
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

router.get("/:date?", function (req, res) {
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

module.exports = router;
