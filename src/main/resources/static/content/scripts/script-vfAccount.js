document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  printEmail()
  setBgFromColorUI("logo-icon");
}

function printEmail(){
  document.querySelector("#user-email").innerHTML = getCookie("email");
}

function resendEmail(){
  sendRequest("GET",requestPath+"resendEmail?email="+getCookie("email"));
  console.log("resended")
}
