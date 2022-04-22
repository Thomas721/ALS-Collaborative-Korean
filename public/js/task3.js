var spacing = 6;
var spacingKor = 3;
var width = 16;
var engLabelTop = 20;
var emptyTop = 40;
var korLabelTop = 75;

var left = (100 - 2*width - 1*spacing)/2;
var leftKor = (100 - 5*width - 4*spacingKor)/2;
var step = spacing + width;
var stepKor = spacingKor + width;

var sequence = [-1,-1];

$(function() {
    for (var i = 0; i < 2; i++){
        $(`#e${i}`).css({top: `${emptyTop}%`, left: `${left + i * step}%`, width: `${width}%`});
    }
    for (var i = 0; i < 5; i++){
        $(`#k${i}`).css({top: `${korLabelTop}%`, left: `${leftKor + i * stepKor}%`, width: `${width}%`});
        $(`#k${i}`).attr("spot", -1);
    }

    $("#check").hide();
    $("#score").hide();
    $("#continue").hide();

    $(".koreanLabel").draggable({
        revert : "invalid"
    });

    $(".emptyLabel").droppable({
        drop: function drop(ev, ui) {
            var kLabel = $(ui.draggable);
            var id = kLabel.attr('id');
            var spot = ev.target.id.charAt(1);

            //Check if already one present
            if (sequence[spot] != -1){
                var occupiedSpot = sequence[spot];
                reset($("#k"+occupiedSpot));
            }
            sequence[spot] = id.charAt(1);
            kLabel.attr("spot", spot);
            console.log(sequence);
            console.log(solution);
            var eLabel = ev.target;
            kLabel.css("top", eLabel.style.top);
            kLabel.css("left", eLabel.style.left);
        
            var filled = true;
            sequence.forEach(element => {
                if(element == -1){
                    filled = false;
                }
            });
            if (filled){
                $("#check").show();
            }
        
        }
      });
    $(".koreanLabel").on("click", 
    function onClick(event) {
        console.log("click");
        var label = $(event.target);
        if (label.attr("class") == "labelText"){
            label = label.parent();
        }
        // var audioname = label.children().text();
        if (label.attr("spot") != -1){
            reset(label);
        }
        // else{
        //     var audio = new Audio("/audio/" + audioname + ".m4a");
        //     audio.play();
        // }
    })
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

function reset(label){
    console.log("reset");
    var pos = label.attr("id").charAt(1);
    var spot = label.attr("spot");
    sequence[spot] = -1;
    label.attr("spot", -1);
    console.log("spot after reset: ", label.attr("spot"));
    var left = leftKor + pos * stepKor;
    label.animate({top: `${korLabelTop}%`, left: `${left}%`});

    //hide check after reset
    $("#check").hide();
}

var score = 0;
var total = 0;
function check(){
    var wrongAnswers = [];
    score = 0;
    total = 0;
    for(var i = 0; i < solution.length; i++){
        if (solution[i] == sequence[i]){
            score++;
        }
        else wrongAnswers.push(i);
        total++;
    }
    if (score == total){
        window.location.replace(`/completeExercise/${score}/${total}/1`);
    }
    else {
        showMistakes(wrongAnswers);
    }
}

function showMistakes(wrongAnswers){
    wrongAnswers.forEach(wrongAnswer => {
        var wrongLabel = "#k" + sequence[wrongAnswer];
        $(wrongLabel).css("background-color", "red");
        $(wrongLabel).css("border-color", "red");
        console.log(wrongLabel);
    });
    
    $(".koreanLabel").draggable({
        disabled: true
    });

    
    $(".koreanLabel").each(function(index){
        console.log($(this));
        if ($(this).attr("spot") == -1){
            $(this).hide()
        }
    });
    
    $("#check").hide();
    $("#scoreText").text(`Score: ${score}/${total}`);
    $("#score").show();
    $('#continue').show();
}

function nextEx(){
    window.location.replace(`/completeExercise/${score}/${total}/1`);
}