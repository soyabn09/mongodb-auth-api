const express = require("express");
const userRouter = require("./routers/user.js");
const port = process.env.PORT;
require("./db/db.js");

const app = express();

app.use(express.urlencoded());

app.use(express.json());
app.use(userRouter);

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/user", function(request, response) {
  response.sendFile(__dirname + "/views/user.html");
});

app.get("/signup", function(request, response) {
  response.sendFile(__dirname + "/views/register.html");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
