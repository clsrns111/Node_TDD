const express = require("express");
const user = require("./api/user");
const app = express();

/* if(process.env.NODE_ENV !== 'test'){
    app.use()
} */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", user);

module.exports = app;
