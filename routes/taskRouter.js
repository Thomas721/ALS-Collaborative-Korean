const express = require("express");

var router = express.Router();

router.get("/:task/:exercise", (req, res) => {
    var task = req.params['task'];
    var ex = req.params['exercise'];
    res.render(`task${task}`, {exercise: ex});
    //var file = `task${exercise}`;
    //res.render(file, {exercise: exercise});
})


module.exports = router;