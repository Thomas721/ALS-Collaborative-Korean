
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

    var start = new Date;
    //start timer
    setInterval(function() {
        $('#time1Text').text(transformTime(new Date, taskStartTime));
    }, 1000);
    setInterval(function() {
        $('#time2Text').text(transformTime(new Date, start));
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

function setProgress(taskCompl, taskAcc, totalCompl, totalAcc){
    
    $("#completion1Text").text("" + Math.round(taskCompl*100) + "%");
    $("#completion2Text").text("" + Math.round(totalCompl*100) + "%");
    $("#accuracy1Text").text("" + Math.round(taskAcc*100) + "%");
    $("#accuracy2Text").text("" + Math.round(totalAcc*100) + "%");
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

