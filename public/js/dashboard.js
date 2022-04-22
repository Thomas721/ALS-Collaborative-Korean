
$(function () {

    $('.progressCircle').circleProgress({
        value: 0,
        fill: {
        gradient: ["white", "white"]
        }
    });

    //Resize to relative size
    $('.progressCircle').each(function () {

        var max_width = $(this).css("max-width");
        var width = $(this).parent().css("width");
        var max_height = $(this).css("max-height");
        var height = $(this).parent().css("height");

        max_width = max_width.substring(0, max_width.length-1);
        width = width.substring(0, width.length-2);
        max_height = max_height.substring(0, max_height.length-1);
        height = height.substring(0, height.length-2);
        var size = Math.min(max_width * width / 100, max_height * height / 100);

        $(this).circleProgress({
            size: size,
            thickness: size/8,
        })

        //create label underneath
        var id = $(this).attr("id");
        var labelName = id.substring(0, id.length-1);
        var left = $(this).css("left");
        var label = `<div class="circleName"  style = "left:  ${left};"> <b class="title"> ${labelName} </b></div>`
        $(this).parent().append(label);


        //set text inside progress donut with id: donutId + "Text"
        var progress = $(this).data('circle-progress').value;
        var progressText = `<div class = "progressText" style="left: ${left}"> <b id = "${id}Text" class = "title"> ${progress}% </b></div>`;
        $(this).parent().append(progressText);
    });

    //startTime is the start of the whole study
    //startTimeTask is the start time of the current task
    //start timer
    setInterval(function() {
        $('#time1Text').text(transformTime(new Date, startTimeTask));
    }, 1000);
    setInterval(function() {
        $('#time2Text').text(transformTime(new Date, startTime));
    }, 1000);

});


var totalExercises = 21;
var taskExercises = [6, 6, 3, 3, 3];
var taskNb = 0;
var totalExCompleted = 0;
var totalExCorrect = 0;
var taskExCompleted = 0;
var taskExCorrect = 0;
var taskStartTime = new Date;
function updateProgress(taskNumber, correct, value = 1) {
    totalExCompleted += value;
    if (correct){
        totalExCorrect += value;
    }
    if (taskNb == taskNumber){
        taskExCompleted += value;
        if (correct){
            taskExCorrect += value;
        }
    }
    else {
        taskNb = taskNumber;
        taskExCompleted = value;
        if (correct){
            taskExCorrect = value;
        }
    }

    var taskCompl = taskExCompleted/(taskExercises[taskNb-1]);
    var totalCompl = totalExCompleted/totalExercises;
    setProgress(taskCompl, taskExCorrect/taskExCompleted, totalCompl, totalExCorrect/totalExCompleted);
}


function transformTime(newDate, startTime){
    var interval = (newDate - startTime) / 1000;
    var minutes = Math.floor(interval/60);
    var seconds = Math.round(interval%60);
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    return "" + minutes + ":" + seconds;
}

function rotateSeesaw(ratio){
    var maxAngle = 20;
    var newAngle = -maxAngle + ratio * maxAngle;    
    $("#seesawPlank").css("transform", ` translate(-50%, 0%) rotate(${newAngle}deg)`);
}


var currentTask = 0;
var currentExercise = 0;
var taskProgress = 0;
var totaltasks = 5;
var totalExercises = [2, 2, 3, 3, 3];


function setProgress(taskAcc, totalAcc){
    updateProgressCircle("accuracy1", taskAcc * 100);
    updateProgressCircle("accuracy2", totalAcc * 100);
}


var minTreeHeight = 30;
var maxTreeHeight = 75;

function setTaskProgress(progress){
    taskProgress = progress;
    updateProgressCircle("completion1", progress);
    var newTotalProgress = Math.max(currentTask-1, 0)/totaltasks + 1/totaltasks * progress/100;
    console.log(newTotalProgress, currentTask);
    updateProgressCircle("completion2",newTotalProgress * 100);

    var newTreeHeight = minTreeHeight + (maxTreeHeight-minTreeHeight) * newTotalProgress;
    $("#tree").css("height", `${newTreeHeight}vh`)
      
}

function updateProgressCircle(name, value){
    //get previous value
    var prevValue = $(`#${name}Text`).text();
    prevValue = parseInt(prevValue.substring(0,prevValue.length-1))/100
    $(`#${name}Text`).text("" + Math.round(value) + "%");
    $(`#${name}`).circleProgress({
        value: value/100,
        animationStartValue: prevValue
    });
}




//Make the seesaw work
var person1Weight = 1000;
var person2Weight = 1000;
var totalTimeTalking = 0;
document.onkeydown = function(e) {
    switch(e.key) {        
        
        case 'ArrowLeft': {
            person1Weight-=1;
            person2Weight+=1;
            break;
        }
        case 'ArrowRight': {
            person1Weight++;
            person2Weight--;
            break;
        }
    }
    totalTimeTalking++;
    rotateSeesaw(person1Weight/person2Weight);
};


//Keeps the information of the score of the previous tasks
//[{
//     task: taskNb,
//     exercise: wxerciseNb,
//     score:score,
//     total: maxScore
//     weight: weight of the task
// }]
var taskHistory = [];




function refreshProgress(){
    var taskScore = 0;
    var taskPossibleScore = 0;
    var totalScore = 0;
    var totalPossibleScore = 0;

    console.log("taskHistory: ", taskHistory);

    taskHistory.forEach(element => {
        
        totalScore += element.score/element.total * element.weight;
        totalPossibleScore += element.weight;

        if (currentTask == element.task){
            taskScore += element.score/element.total * element.weight;
            taskPossibleScore += element.weight;
        }

    });

    
    console.log("Score: ", taskScore, taskPossibleScore, totalScore, totalPossibleScore);
    setProgress(taskScore/taskPossibleScore, totalScore/totalPossibleScore);
}

function addNewTaskInfo(task, exercise, score, possibleScore, weight){
    if (currentTask < task){
        currentTask = task;
        currentExercise = exercise;
    }
    else if (currentTask == task && currentExercise < exercise){
        currentExercise = exercise;
    }
    else{
        return; //No new information gained -- first answer counts
    }
    taskHistory.push({
        score: score,
        total: possibleScore, 
        task: task,
        exercise: exercise,
        weight: weight
    })
    refreshProgress();
}



function addApple(){
    //TODO
    console.log("Apple Added");
    var x = Math.random();
    var y = Math.random();
    var leftMin = 30;
    var leftMax = 60;
    var left = leftMin + (leftMax-leftMin)*x;
    
    var topMin = 10;
    var topMax = 50;
    var top = topMin + (topMax-topMin)*y;
    $("#treeDiv").append(`<img src="/images/apple.png" style="position: absolute; height: 2vh; left: ${left}%; top: ${top}%">`);
}
