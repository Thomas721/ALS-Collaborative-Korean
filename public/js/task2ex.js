var spacing = 3;
var spacingKor = 3;
var width = 16;
var engLabelTop = 20;
var emptyTop = 40;
var korLabelTop = 70;

var left = (100 - 5*width - 4*spacing)/2;
var leftKor = (100 - 5*width - 4*spacingKor)/2;
var step = spacing + width;
var stepKor = spacingKor + width;

var sequence = [-1,-1,-1,-1, -1];

$(function() {
    for (var i = 0; i < 5; i++){
        $(`#e${i}`).css({top: `${emptyTop}%`, left: `${left + i * step}%`, width: `${width}%`});
        $(`#el${i}`).css({top: `${engLabelTop}%`, left: `${left + i * step}%`, width: `${width}%`});
    }
    for (var i = 0; i < 5; i++){
        $(`#k${i}`).css({top: `${korLabelTop}%`, left: `${leftKor + i * stepKor}%`, width: `${width}%`});
        $(`#k${i}`).attr("spot", -1);
    }

    $("#check").hide();

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
            console.log($(kLabel).attr("spot"));
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
                console.log("filled in");
                console.log($("#check"));
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
            console.log(label);
            console.log(label.attr("spot"));
            var audioname = label.children().text();
            if (label.attr("spot") != -1){
                reset(label);
            }
            else{
                var audio = new Audio("/audio/" + audioname + ".m4a");
                audio.play();
            }
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

function check(){
    var correct = true;
    for(var i = 0; i < solution.length; i++){
        if (solution[i] != sequence[i]){
            correct = false;
            console.log("false");
            break;
        }

    }
    if (correct) {
            console.log("correct");
        }
    // window.location.replace("/apple/1/<%=exercise%>");
}
