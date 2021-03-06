const express = require("express");
const session = require("express-session");

var router = express.Router();



//track progress
//dashboard
var startTime = new Date;
var startTimeTask = new Date;

var name1 = "Opa";
var name2 = "Oma";


//Session variables:
// var task = number 0-5;
// var exercise = number 0-n;
// var applesCompleted = number 0-n
// var theoryDone = boolean;



router.get("/", (req, res) => {
    res.render('selectRole');
});

router.get("/person/:personNb", (req, res) => {
    var personNb = req.params["personNb"]; //0 or 1

});

router.get("/start/:personNb", (req, res) => {
    var person = parseInt(req.params["personNb"]); //0 or 1
    var title = titles[0];
    var text = introText[0];
    var progressValue = progress(req);

    //initialize session
    req.session.person = person;
    req.session.task = 0;
    req.session.exercise = 0;
    req.session.theoryDone = false;
    req.session.introDone = false;

    res.render("intro", {text: text, title: title, progress: progressValue, person: person});
});


router.get("/exercises", (req, res)=>{ //request from introductionscreen task = x, exercise = 0, applesCompleted = 0 and introCompleted

    var person = req.session.person;
    var task = req.session.task;
    var exercise = req.session.exercise;
    var title = titles[task];

    //render intro at the start of task 1
    if (task == 0 || !req.session.introDone){
        if (task == 0) task = ++req.session.task;
        var text = introText[task];
        title = getTitle(req.session);
        var progressValue = progress(req);

        //update session
        req.session.introDone = true; //this person received the intro

        res.render("intro", {text: text, title: title, progress: progressValue});
        return;
    }

    //notify dashboard new task started
    if (exercise == 0 && !req.session.theoryDone){
        req.io.to("dashboard").emit("newTask", {task: task, time: new Date});
    }

    var taskData;
    var file = `task${task}`;
    if (task == 5) file = 'task4'; //Task 5 and 4 share the same html file
    if (hasTheory[task-1] && !req.session.theoryDone){
        taskData = theory[person][task-1][exercise];
        file += "Theory";
    }
    else {
        taskData = taskQuestions[task-1][exercise];
    }
    taskData = addData(taskData, title, progress(req));
    res.render(file, taskData)
})

//Updating dashboard
router.get("/completeExercise/:score/:total/:weight", (req, res)=>{
    var score = parseInt(req.params["score"]);
    var total = parseInt(req.params["total"]);
    var weight = parseInt(req.params["weight"]);
    var exercise = req.session.exercise;
    var task = req.session.task;
    var progressValue = progress(req);
    
    //update dashboard
    req.io.to("dashboard").emit("completedExercise", {score, total, task, exercise, weight});

    req.session.theoryDone = false;
    //route to next exercise
    exercise = ++req.session.exercise;
    if (exercise == totalExercises[task-1]){ //if it was the last exrcise of the task
        req.session.exercise = 0;
        req.session.introDone = false;
        task = ++req.session.task;
    }
  
    if (score == total){
        res.render('gainedApple', {progress: progressValue, title: titles[task]})
    }
    else{

        res.redirect("/exercises");//go to next exercise
    };
});


router.get("/dashboard", (req, res)=>{
    res.render("dashboard", {startTime, startTimeTask, name1, name2})
})



router.get("/appleRequest", (req, res)=>{ //after theory
    req.session.theoryDone = true;
    var progressValue = progress(req);
    var title = getTitle(req.session);
    res.render("applerequest", {progress: progressValue, title: title});
})

router.get("/appleQuestion", (req, res)=>{ //after theory
    var progressValue = progress(req);
    var title = getTitle(req.session);

    var data = appleQuestions[req.session.person][req.session.task-1][req.session.exercise];
    data = addData(data, title, progressValue);
    res.render("apple", data);
})

router.get("/appleCorrect",  (req, res) => {
    //update dashboard
    req.io.to("dashboard").emit("addApple", {task: "appleQuestion"});
    res.render("gainedApple", {progress: progress(req), title: titles[req.session.task]});
  });

function progress(req){
    var session = req.session;
    var task = session.task;
    if (task == 0) return 0; // introduction

    var progress  = session.exercise/totalExercises[task - 1];
    progress += 1/totalExercises[task-1] * (1/2 * session.theoryDone);
    progress = progress * 100;

    req.io.to("dashboard").emit("updateProgress", {progress: progress, task: task});

    return  progress;
}

function getTitle(session){
    var title = titles[session.task];
    session.title = title;
    return title;
}

function addData(data, title, progress){
    data["title"] = title;
    data["progress"] = progress;
    return data;
}

//general info of tasks:
const totalTasks = 5;
const totalExercises=[2, 2, 3, 3, 3];
const hasTheory = [true, true, false, false, false];
const introText = [
    `You and your teammate will have to solve in total 5 different tasks together. 
    Both of you will have to submit the solution to the exercises, but the minimum score is chosen, so help each other out.
    Pay attention to the dashboard in order to maintain a good balance in conversation.`,

    `In the first task you will get information about Korean symbols and their pronunciation. 
    Make sure you try to remember them, because you and your teammate will have to put them back together.`,

    `The second task is very similar to the first one. The main difference here is that you will have to deal with syllables.`,

    `In the third task, you will have to combine syllables to form a word. A small TIP: the symbol ????????? is often pronounced as ???r???. Koreans have the same symbol for ???r??? and ???l???.`,

    `In this task you will get the pronunciation of the word and you will have to type it using a Korean keyboard. Make sure to listen! Task 5 is a listening exercise.`,

    `In the last exercise you will have to listen to the audio and figure out how the word is written in Korean.`
];

const titles = [
    "Learning basic Korean words",
    "Task 1: Vowels and consonants",
    "Task 2: Syllables",
    "Task 3: Words",
    "Task 4: Writing",
    "Task 5: Listening"
];

//Apple questions:
const appleQuestions1 = [
    [{
        question: `Which symbol corresponds to the sound of ???eo????`, 
        answers: ["???", "???", "???"],
        correctAnswer: 2,
        feedback: `The corresponding symbol for eo is ???. ??? corresponds to a and ??? to i.`
    },
    {
        question: `Which symbol corresponds to the sound of ???S????`, 
        answers: ["???", "???", "???"],
        correctAnswer: 2,
        feedback: 'The corresponding symbol for s is ???. ??? and ??? you have not learned yet.'
    }],

    [{
        question: `To which sound does the red symbol correspond to?`, 
        answers: ["m", "u", "l"],
        correctAnswer: 1,
        feedback: 'The word in the picture consists out of 3 symbols. The middle one is highlighted and corresponds to the sound of u. The word is pronounced as mul.',
        image: "/images/moel.png"
    },
    {
        question: `To which consonant does the symbol ????????? correspond to if it is placed at the start of a syllable? (f.e. ???)`, 
        answers: ["h", "m", "Nothing"],
        correctAnswer: 2,
        feedback: 'If ??? is placed at the start of the symbol, it is not spoken, but it is needed for the vowel (??? is never used on its own, to write -a- you have to write ???).'
    }]
];
const appleQuestions2 = [
    [{
        question: `Which symbol corresponds to the sound of ???G????`, 
        answers: ["???", "???", "???"],
        correctAnswer: 0,
        feedback: 'The corresponding symbol for G is ???. ??? corresponds to N and ??? to D.'
    },
    {
        question: `Which symbol corresponds to the sound of ???u????`, 
        answers: ["???", "???", "???"],
        correctAnswer: 2,
        feedback: 'The corresponding symbol for u is ???. ??? corresponds to oh and ??? you will learn in the next task.'
    }],

    [{
        question: `What is the symbol that corresponds to the sound of ???yo???`, 
        answers: ["???", "???", "???"],
        correctAnswer: 2,
        feedback: 'The corresponding symbol for "yo" is ???. ??? corresponds to yu and ??? you have not learned yet.'
    },
    {
        question: `To which consonant does the symbol ????????? correspond if it is placed at the end?`, 
        answers: ["m", "Nothing", "ng"],
        correctAnswer: 2,
        feedback: 'If ??? is placed at the end of a syllable, it is pronounced as ng.'
    }]
];

const appleQuestions = [appleQuestions1, appleQuestions2];




//theory
//theory = [task1, task2] -> taskx = [person1, person2]
const task1TheoryPerson1 = [
    {
        englishLabels: ["Geu", "Gi", "Di", "Deu"],
        koreanLabels: ["???", "???", "???", "???"]
    },
    {
        englishLabels: ["Si", "Ba", "Seu", "Beu"],
        koreanLabels: ["???", "???", "???", "???"]
    }
];
const task1TheoryPerson2 = [
    {
        englishLabels: ["Meo", "Neo", "Ma", "Da"],
        koreanLabels: ["???", "???", "???", "???"]
    },
    {
        englishLabels: ["Go", "Gu", "Do", "Du"],
        koreanLabels: ["???", "???", "???", "???"]
    }
];
const task2TheoryPerson1 = [
    {
        englishLabels: ["Lom", "Leul", "Mal", "Lam"], 
        koreanLabels: ["???", "???", "???", "???"]
    },
    {
        englishLabels: ["I", "O", "Eug", "Teug"],
        koreanLabels: ["???", "???", "???", "???"]
    }
];
const task2TheoryPerson2 = [
    {
        englishLabels: ["Dya", "Gyun", "Dam", "Byag"], 
        koreanLabels: ["???", "???", "???", "???"]
    },
    {
        englishLabels: ["Mang", "Neong", "Byang", "Ma"],
        koreanLabels: ["???", "???", "???", "???"]
    }
];

const theory = [[task1TheoryPerson1, task2TheoryPerson1], [task1TheoryPerson2, task2TheoryPerson2]];


//questions
//taskQuestions = [task1Questions, task2Questions,...]
const task1Questions = [
    {
        englishLabels: ["Geo", "Da", "Meu", "Mi"],
        koreanLabels: ["???", "???", "???", "???", "???"],
        solution: "0341"
    },
    {
        englishLabels: ["Sa", "Tu", "Beu", "Lo"],
        koreanLabels: ["???", "???", "???", "???", "???"],
        solution: "1423"
    }
];

const task2Questions = [
    {
        englishLabels: ["Lyam", "Gyol", "Geol", "Lyal", "Lom"],
        koreanLabels: ["???", "???", "???", "???", "???"],
        solution: "20341"
    },
    {
        englishLabels: ["Ing", "Song", "Im", "Bing", "Am"],
        koreanLabels: ["???", "???", "???", "???", "???"],
        solution: "03241"
    }
];
const task3Questions = [
    {
        word: "Al-lam (Alarm)",
        koreanLabels: ["???", "??????", "???", "???", "???"],
        solution: "24"
    },
    {
        word: "Dong-mul (Animal)",
        koreanLabels: ["???", "???", "???", "???", "???"],
        solution: "13"
    },
    {
        word: "Sa-ram (Human)",
        koreanLabels: ["???", "???", "???", "???", "???"],
        solution: "24"
    }
];

const task4Questions = [
    {
        word: "Eum-sig (Food)",
        solution: "??????"
    },
    {
        word: "Mul (Water)",
        solution: "???"
    },
    {
        word: "An-nyeong (Hello)",
        solution: "??????"
    }    
];

const task5Questions = [
    {
        word: "lightning",
        solution: "??????"
    },
    {
        word: "Here",
        solution: "??????"
    },
    {
        word: "Love",
        solution: "??????"
    }    
];

const taskQuestions = [task1Questions, task2Questions, task3Questions, task4Questions, task5Questions];

module.exports = router;

