
$(function() {
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

function check(){
    var correct = true;
    var input = $("input").val();
    console.log("input: ", input);
    correct = (input == solution);
    if (correct) {
            console.log("correct");
        }
    // window.location.replace("/apple/1/<%=exercise%>");
}
