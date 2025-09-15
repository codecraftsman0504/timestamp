const express = require("express");
const router = express.Router();

// In-memory storage
let users = [];
let exercises = [];

router.post("/", (req, res) => {
  const username = req.body.username;
  const _id = String(Date.now() + Math.floor(Math.random() * 1000));
  const newUser = { username, _id };
  users.push(newUser);
  res.json(newUser);
});

// 4, 5, 6: Get all users
router.get("/", (req, res) => {
  res.json(users);
});

// 7 & 8: Add exercise to a user
router.post("/:_id/exercises", (req, res) => {
  const user = users.find((u) => u._id === req.params._id);
  if (!user) return res.json({ error: "User not found" });

  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  let date = req.body.date ? new Date(req.body.date) : new Date();

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  const exercise = {
    _id: user._id,
    description,
    duration,
    date: date.toDateString(),
  };

  exercises.push(exercise);

  res.json({
    username: user.username,
    description,
    duration,
    date: date.toDateString(),
    _id: user._id,
  });
});

// 9–16: Get exercise log
router.get("/:_id/logs", (req, res) => {
  const user = users.find((u) => u._id === req.params._id);
  if (!user) return res.json({ error: "User not found" });

  let { from, to, limit } = req.query;
  let log = exercises.filter((e) => e._id === user._id);

  if (from) {
    const fromDate = new Date(from);
    if (fromDate.toString() !== "Invalid Date") {
      log = log.filter((e) => new Date(e.date) >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (toDate.toString() !== "Invalid Date") {
      log = log.filter((e) => new Date(e.date) <= toDate);
    }
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log: log.map((e) => ({
      description: e.description,
      duration: e.duration,
      date: e.date,
    })),
  });
});

module.exports = router;
