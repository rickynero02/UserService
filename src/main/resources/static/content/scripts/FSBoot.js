document.addEventListener("DOMContentLoaded",main)

function main(){
  configureMode("dark-mode","light");

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
  bgId = parseInt(Math.random()*10);
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

function setIconRelatedBg(id){
  document.querySelector("#"+id).setAttribute("bg-icon",getCookie("background-id"));
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

//--SECURITY--
//Encrypt XOR function
function encrypt(key, value) {
  var result="";
  for(i=0;i<value.length;++i)
  {
    result+=String.fromCharCode(key[i % key.length]^value.charCodeAt(i));
  }
  return result;
}