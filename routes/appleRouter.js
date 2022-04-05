const express = require("express");

var router = express.Router();

router.get("/:task/:exercise", (req, res) => {
    res.render('apple', {task: 0});
})

module.exports = router;