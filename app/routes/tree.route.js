const express = require("express");
const trees = require("../controllers/tree.controller");

const router = express.Router();

router.route("/")
    .get(trees.findAll)
    .post(trees.create)
    .delete(trees.deleteAll);

router.route("/favorite")
    .get(trees.findAllFavorite);

router.route("/:id")
    .get(trees.findOne)
    .put(trees.update)
    .delete(trees.delete);

module.exports = router;
