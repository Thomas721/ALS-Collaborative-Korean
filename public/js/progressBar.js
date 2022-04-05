class ProgressBar extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        var progress = this.getAttribute("progress")
        var title = this.getAttribute("title");
        this.innerHTML = `
        <style>
        .progressBar {
            height: 6vw;
            width: 100vw;
            margin: 0;
            background-color: #6F86A9;
            position: absolute;
            top: 0;
            left: 0;
            text-align: center;
          }
          .progress {
            background-color: #3A69AF;
          }
          .progressText {
            position: relative;
            top: 50%;
            transform: translate(0, -50%);
            font-size: 5vw;
            color: white;
            margin: 0;
          }
        </style>
        <div class="progressBar">
                <div class="progressBar progress" id="progress" style="width: ${progress}vw;"> </div>
        </div>
        <!--Make title appear above progressbar-->
        <div class = "progressBar" style="background-color: transparent;">
                <h1 class="progressText" id = "progressText"> ${title} </h1>
        </div>
        `;
        
    }

    
}
window.customElements.define('progress-bar', ProgressBar);

