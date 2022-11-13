const express = require("express");
const types = require("../controllers/typetree.controller");

const router = express.Router();

router.route("/")
    .get(types.findAll)
    .post(types.create)
    .delete(types.deleteAll);

router.route("/:id")
    .get(types.findOne)
    .put(types.update)
    .delete(types.delete);

module.exports = router;
