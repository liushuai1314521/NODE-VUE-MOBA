"use strict";

var express = require("express");

var app = express();
app.set("secret", "asfdgsadg");
app.use(require("cors")());
app.get('/', function (req, res) {
  res.send("你好");
});
app.use(express.json());
app.use("/uploads", express["static"](__dirname + "/uploads"));

require("./plugins/db")(app);

require("./routes/admin")(app);

require("./routes/web")(app);

app.listen(3000, function () {
  console.log("http://localhost:3000");
});