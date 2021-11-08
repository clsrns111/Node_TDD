const app = require("../index");
const syncDB = require("./syncDB");

syncDB().then((_) => {
  console.log("Sync database");
  app.listen(3000, () => {
    console.log("server connected");
  });
});
