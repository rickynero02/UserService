document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  printEmail()
  setIconRelatedBg("logo-icon");
}

function printEmail(){
  document.querySelector("#user-email").innerHTML = getCookie("email");
}

function resendEmail(){
  sendRequest("GET","http://79.35.53.166:8080/api/v1/resendEmail?email="+getCookie("email"));
  console.log("resended")
}
