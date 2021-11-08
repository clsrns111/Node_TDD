const express = require("express");
const {
  limitController,
  deleteController,
  postController,
  putController,
  getUserController,
} = require("./user.ctrl");
const router = express.Router();

router.get("/", limitController);

router.get("/:id", getUserController);

router.delete("/:id", deleteController);

router.post("/", postController);

router.put("/:id", putController);

module.exports = router;
