const template = document.createElement('template');


var width = 30;
var height = 20;

var marginHorizontal = 15;
var marginVertical = 15;
var upperOffset = 15;

template.innerHTML = `
        <style>
            .labelBG {
                position: absolute;
                left: 15%;
                top: 25%;
                width: ${width}%;
                height: ${height}%;
                background-color: #0A4A6D;
                border-radius: 4vw;
                padding: 0;
            }
            
            .labelFront{
                /* width: 15vw; */
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(0, -50%);
                width: 50%;
                height: 100%;
                background-color: #6F86A9;
            }
            
            .labelText {
                position: absolute;
                top: 50%;
                font-size: 5vw;
                color: white;
                margin: 0;
            }
        </style>
        <div  id = "label" class = "labelBG">
            <div class = "labelBG labelFront">
            </div>
        </div>
        <div id = "textLabel" class = "labelBG">
            <h1 id="korean" class = "labelText" style="left: 25%; transform: translate(-50%, -50%);"> korean </h1>
            <h1 id = "english" class = "labelText" style="left: 75%; transform: translate(-50%, -50%);"> english </h1>
        </div>
        `;

class EnglishKoreanLabel extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(){
        var english = this.getAttribute("english")
        var korean = this.getAttribute("korean");
        var pos = this.getAttribute("pos");

        this.shadowRoot.getElementById("korean").innerText = korean;
        this.shadowRoot.getElementById("english").innerText = english;
        var left = `${marginHorizontal}`;
        var top = `${marginVertical + upperOffset}`;
        switch (pos) {
            case "topright":
                left = `${100 -marginHorizontal - width}`
                break;
            case "downleft":
                top = `${100 - marginVertical - height}`;
                break;
            case "downright":
                left = `${100 -marginHorizontal - width}`
                top = `${100 - marginVertical - height}`;                
                break;
            default:
                break;
        }
        
        
        this.shadowRoot.getElementById("label").style= `left: ${left}%; top: ${top}%;`;
        this.shadowRoot.getElementById("textLabel").style= `left: ${left}%; top: ${top}%; background-color: transparent;`;
        console.log(left, top, `${left}`);
        console.log(template.innerHTML);
        
        
    }

    
}
window.customElements.define('eng-kor-label', EnglishKoreanLabel);

