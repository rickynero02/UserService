document.addEventListener("DOMContentLoaded",main)

function main(){
  //Configuring Dark Mode
  configureMode("dark-mode","light");
  controlKeyPress()
  if(getCookie("background-id")===""){
    setCookie("background-id","0")
  }
}

var requestPath="http://localhost:8080/api/v1/users/"
//var requestPath="http://79.35.53.166:8080/api/v1/users/"

//Controller
function controlKeyPress(){

  //Plus for changing dark-mode
  window.addEventListener('keydown', function (e) {
      if(e.key === "+"){
        toggleDarkModeWithIconChange("dark-mode");
      }
  }, false);

}

//--USER EXPERIENCE--
//BODY
//Generating Body Random Background
function generateRandomBg(){
  bgId = parseInt(Math.random()*13);
  setCookie("background-id",bgId);
}

function setBgBody(){
  let cookie = getCookie('background-id');
  document.body.setAttribute("style","background: url(content/images/login-wallpapers/"+cookie+".jpg)");
}

function setBg(id){
  let cookie = getCookie('background-id');
  document.querySelector('#'+id).setAttribute("style","background: url(content/images/login-wallpapers/"+cookie+".jpg)");
}

function setBgFromColorUI(id){
  document.querySelector("#"+id).setAttribute("bg-texture",getCookie("background-id"));
}

function setLightBgFromColorUI(id){
  document.querySelector("#"+id).setAttribute("bg-texture",getCookie("background-id")+"--light");
}

function toggleBg(){
  generateRandomBg()
  setBgBody()
  setIconRelatedBg();
}

//Send login parameters to the server
function sendRequest(method,url,callback,stringToSend){
  fetch(url,
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      mode: 'cors',
      method: method,
      body: JSON.stringify(stringToSend)
  })
  .then(function(res){ console.log(res); callback(res);})
}
