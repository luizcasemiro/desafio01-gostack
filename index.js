const express = require("express");

const server = express();

const projects = [];
let counter = 0;

function requestCount(req, res, next) {
  counter++;
  console.log(`Requests: ${counter}`);
  next();
}

server.use(express.json());
server.use(requestCount);

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex(item => item.id == id);
  if (index < 0) {
    return res.status(404).json("Object not found");
  }
  req.itemIndex = index;
  return next();
}

function checkValidTitle(req, res, next) {
  !req.body.title ? res.status(400).json("Title is required") : next();
}

server.post("/projects", checkValidTitle, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id: String(id), title: String(title), tasks: [] });

  return res.json(projects);
});

server.post(
  "/projects/:id/tasks",
  checkIdExists,
  checkValidTitle,
  (req, res) => {
    const { itemIndex } = req;
    const { title } = req.body;
    projects[itemIndex].tasks.push(String(title));

    return res.json(projects[itemIndex]);
  }
);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, checkValidTitle, (req, res) => {
  const { title } = req.body;
  const { itemIndex } = req;

  projects[itemIndex].title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { itemIndex } = req;
  projects.splice(itemIndex, 1);
  return res.send();
});

server.listen(3000);
