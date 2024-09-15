import { SceneManager } from './SceneManager.js'

const sceneManager = new SceneManager();
const wrapper = document.getElementById("wrapper")
const renderElement = sceneManager.renderer.domElement;
renderElement.classList.add("in-wrapper");
wrapper.appendChild( renderElement );
window.addEventListener( 'resize', sceneManager.onWindowResize.bind(sceneManager), false );


const loadScreen = document.getElementById("loadscreen");
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {loadScreen.classList.add("fadeout")})
loadScreen.addEventListener("transitionend", (e) => {e.target.remove()})



const imageSources = {
    modeIcon: ["/images/darkicon.png", "/images/lighticon.png"],
    musicIcon: ["/images/volumeicon.png", "/images/muteicon.png"]
}


const textElement = document.getElementById("voyage-text");
//SCENE BUTTONS
const modeButton = document.getElementById("mode-button");
modeButton.addEventListener('click', () => {
    sceneManager.toggleMode();
    modeButton.children[0].src = imageSources.modeIcon[sceneManager.mode]
    if (sceneManager.mode == 1) {
        textElement.style.color = "rgb(221,221,221)";
    }
    else {
        textElement.style.color = "rgb(35,35,35)"
    }
    
})

const musicButton = document.getElementById("music-button");
musicButton.addEventListener('click', () => {
    sceneManager.toggleSound();
    musicButton.children[0].src = imageSources.musicIcon[sceneManager.mute]
    
})

const text = [
    "GAVYN'S VOYAGE", 
    "I’m Gavyn.\nI’m a software engineer who was born and raised on the beautiful island of Oahu, Hawaii.\nI love the beach, playing the piano, and video games.",
    "I traveled to California to complete a bachelor’s degree in Computer Science.\nI attended the University of California – San Diego,\nand participated in clubs like ACM, Triton Gaming, and VGDC.",
    "I gained experience writing backend software through projects and internships.\nI also have a second interest in computer graphics and games!",
    `Thanks for cruising!<br>Want to connect or learn more about me?`
]


let opac;
let x;
setInterval(() => {
    x = sceneManager.boatX;
    textElement.style.fontSize = "1.6vmax"
    textElement.style.top = "15vh"
    // projectButton.style.zIndex = "0";
    // linkedinButton.style.zIndex = "0";
    // resumeButton.style.zIndex = "0";
    switch (true) {
        //TITLE
        case x >= -20 && x < -10.48:
            textElement.style.fontSize = "9vmax"
            textElement.style.top = "28vh"
            textElement.style.opacity = (-10.48 - x) / (9.52)
            textElement.innerText = text[0]
            break;
        //ISLAND 1
        case x >= -10.48 && x < -0.967:
            textElement.style.opacity = (x -(-10.49)) / (9.51)
            textElement.innerText = text[1]
            break;
        case x >= -0.967 && x < 5.8:
            textElement.style.opacity = (5.8-x) / (6.76)
            textElement.innerText = text[1]
            break;
        //CALIFORNIA
        case x >= 5.8 && x < 11.13:
            textElement.style.opacity = (x-5.8) / (5.33)
            textElement.innerText = text[2]
            break;
        case x >= 11.13 && x < 16.475:
            textElement.style.opacity = (16.475-x) / (5.34)
            textElement.innerText = text[2]
            break;
        //OILRIG
        case x >= 16.475 && x < 22.51:
            opac = (x-16.475) / (6.035)
            textElement.style.opacity = opac
            // projectButton.style.opacity = opac
            // projectButton.style.zIndex = "10"
            textElement.innerText = text[3]
            break;
        case x >= 22.51 && x < 30.8:
            opac = (30.8-x) / (8.29);
            textElement.style.opacity = opac
            // projectButton.style.opacity = opac
            // projectButton.style.zIndex = "10"
            textElement.innerText = text[3]
            break;
        default:
            opac = (x-30.8) / (8.7)
            textElement.style.opacity = opac
            // linkedinButton.style.opacity = opac
            // linkedinButton.style.zIndex = "10"
            // resumeButton.style.opacity = opac
            // resumeButton.style.zIndex = "10"
            textElement.innerHTML= text[4]
            break;
        
        }
}, 40); // Wait 1000ms before running again





//MOVEMENT
var inDragState = false;
var timestamp = null;
var lastMouseX = null;
var velocity;
renderElement.addEventListener("pointerdown", (e)=> {
    inDragState = true;
    renderElement.style.cursor = "grabbing";
})

renderElement.addEventListener("pointerup", (e)=> {``
    inDragState = false;
    timestamp = null;
    lastMouseX = null;
    renderElement.style.cursor = "grab";
})

renderElement.addEventListener("pointerleave", (e)=> {``
    inDragState = false;
    timestamp = null;
    lastMouseX = null;
    renderElement.style.cursor = "grab";
})

renderElement.addEventListener("pointermove", (e) => {
   
    if (timestamp === null) {
        timestamp = Date.now();
        lastMouseX = e.screenX;
        return;
    }

    var now = Date.now();
    var dt =  now - timestamp;
    var dx = e.screenX - lastMouseX;
    velocity = Math.min(20, Math.max(-20, Math.round((dx / dt) * 100) * 0.08));

    if (inDragState) {
        sceneManager.giveVelocity(-velocity);
    }
    timestamp = now;
    lastMouseX = e.screenX;
})

window.addEventListener( "keydown", (event) => {
	if (event.key == "d" && !inDragState)
	{
		sceneManager.forwardKeyPressed = true;
	}
	else if (event.key == "a" && !inDragState)
	{
		sceneManager.backKeyPressed = true;
	}}, false,
  );

window.addEventListener( "keyup", (event) => {
if (event.key == "d" && !inDragState)
{
    sceneManager.forwardKeyPressed = false;
}
else if (event.key == "a" && !inDragState)
{
    sceneManager.backKeyPressed = false;
}}, false,
);