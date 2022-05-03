
$(function() {

    $("#continue").hide();
    $("#correction").hide();

    $(".taskLabel").on("click", 
    function onClick(event) {
        console.log("click");
        var label = $(event.target);
        if (label.attr("class") == "taskLabelText"){
            label = label.parent();
        }
        var audioname = label.children().text();
        var strArr = audioname.split(' ');
        audioname = strArr[0];
        var audio = new Audio("/audio/" + audioname + ".m4a");
        audio.play();
    })
          

});

var score = 0;
var possibleScore = 0;
function check(){
    var input = $("input").val();
    var wrong = [];
    possibleScore = solution.length;
    for (i = 0; i < input.length; i++){
        if (input.charAt(i) == solution.charAt(i)){
            score++;
        }
        else {
            wrong.push(i);
        };
    }
    console.log(possibleScore, score, solution);
    if (possibleScore == score) {
            window.location.replace(`/completeExercise/${score}/${possibleScore}/2`);
    }
    else{
        $("#check").hide();
        $("#correction").show();
        $("#correctionText").html(`Incorrect! <br> The correct answer was: <br> ${solution}`);
        $("#continue").show();

    }
    
}

function nextEx(){
    window.location.replace(`/completeExercise/${score}/${possibleScore}/2`);
}