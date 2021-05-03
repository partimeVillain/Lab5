// script.js


var imageLoader = document.getElementById('image-input');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('user-image');
var ctx = canvas.getContext('2d');
var reader = new FileReader();
var img = new Image();
function handleImage(e){
    //var reader = new FileReader();
    reader.onload = function(event){
        //var img = new Image();
        img.onload = function(){
            canvas.width = 400;
            canvas.height = 400;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img,0,50,400,300);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

document.getElementById('generate-meme').addEventListener("submit", generate);
function generate(event) {
  let x = getDimmensions();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img,0,50,400,300);
  let startx=x.startX + 30;
  let starty=x.starty + 30;
  let top = document.getElementById("text-top").value;
  let bottom = document.getElementById("text-bottom").value;
  ctx.font = "25px Verdana";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(top,200,30);
  ctx.fillText(bottom,200,375);
  event.preventDefault();
  var c = document.getElementById('button-group').querySelectorAll("button");
  c[0].disabled = false;
  c[1].disabled = false;
  //voices------------------------------------------
  let c2 = document.getElementById("voice-selection");
  c2.removeAttribute("disabled");
  
  var synth = window.speechSynthesis;
  var voices = [];
  c2.options.length=0;
  
  function populateVoiceList() {
    voices = synth.getVoices();


    for(let i = 0; i < voices.length ; i++) {
      var option = document.createElement('option');
      option.textContent =' (' + voices[i].lang + ')'+ voices[i].name;
  
      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }
  
      option.setAttribute('lang', voices[i].lang);
      option.setAttribute('name', voices[i].name);
      c2.appendChild(option);
    }
  }

  
  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
  }
}




var buttons = document.getElementById('button-group').querySelectorAll("button");
buttons[0].addEventListener("click", clear1);
function clear1(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  buttons[0].disabled = true;
  buttons[1].disabled = true;
  
  let c2 = document.getElementById("voice-selection");
  c2.setAttribute("disabled", "disabled");
}

//changing volume
var sound = document.getElementById('volume-group').querySelector("input");
var vol = sound.value;
sound.addEventListener("change", function(e) {
vol=sound.value/100;
});
//reading text
buttons[1].addEventListener("click", read);
function read(){
  let top = document.getElementById("text-top").value;
  let bottom = document.getElementById("text-bottom").value;
  let words = top +" " + bottom;
  var speech = new SpeechSynthesisUtterance(words);
  let e = document.getElementById("voice-selection");
  let h = e.options[e.selectedIndex].text;
  let str= h.substring(1, h.indexOf(")"));
  speech.volume=vol; 
  speech.lang = str;
  window.speechSynthesis.speak(speech);
} 

  
 



/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */


function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

