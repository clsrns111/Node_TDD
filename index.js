const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
let users = [
  { id: 1, name: "elice" },
  { id: 2, name: "jop" },
  { id: 3, name: "bekc" },
];

app.get("/users", (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = +req.query.limit;

  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  res.json(users.slice(0, limit));
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.filter((user) => user.id == +id)[0];

  if (Number.isNaN(+id)) {
    return res.status(400).end();
  }
  if (!user) {
    return res.status(404).end();
  }
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const id = +req.params.id;
  console.log(id);
  if (Number.isNaN(+id)) {
    return res.status(400).end();
  }
  users = users.filter((user) => user.id !== id);
  res.status(204).end();
});

app.post("/users", (req, res) => {
  const name = req.body.name;
  const id = Date.now();
  const user = { id, name };

  if (!name) return res.status(400).end();

  if (users.filter((user) => user.name === name).length) {
    return res.status(409).end();
  }

  res.status(201).json(user);
});

app.listen(port, () => console.log(`Example app listening on port port!`));

module.exports = app;
