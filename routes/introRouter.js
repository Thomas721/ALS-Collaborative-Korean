const express = require("express");
const session = require("express-session");

var router = express.Router();

router.get("/", (req, res) => {
    console.log(req.session);
    res.render('intro', {task: 0});
})

router.get("/task1", (req, res) => {
    res.render('intro', {task: 1});
})

router.get("/task2", (req, res) => {
    res.render('intro', {task: 2});
})

router.get("/task3", (req, res) => {
    res.render('intro', {task: 3});
})

router.get("/task4", (req, res) => {
    res.render('intro', {task: 4});
})

router.get("/task5", (req, res) => {
    res.render('intro', {task: 5});
})

module.exports = router;