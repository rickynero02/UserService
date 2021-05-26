document.addEventListener("DOMContentLoaded",main)

function main(){
  controlEmailVerification()
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  printEmail()
  setBgFromColorUI("logo-icon");
}

function printEmail(){
  $("#user-email").innerHTML = getCookie("email");
}

function resendEmail(){
  sendRequest("GET",requestPath+"resendEmail?email="+getCookie("email"));
  console.log("resended")
}

function controlEmailVerification() {
  let url = new URL(window.location);
  let token = url.searchParams.get("token");
  sendRequest("GET",requestPath+"confirmEmail?token="+token,editEmailVerification)
}

function editEmailVerification(resp){
  if (resp.response.result === "ok") {
    $("#creation-confirmed").setAttribute("visible", "")
    $("#creation-error").setAttribute("visible", "hidden")
    $("#error-message").innerHTML= "Your request has been done successfully!"
  } else {
    $("#creation-error").setAttribute("visible", "")
    $("#creation-confirmed").setAttribute("visible", "hidden")
    $("#error-message").classList.add("color-red")
    if(resp.response.result === "token expired"){
      $("#error-message").innerHTML= "Your time has run out"
      $("#require-mail").classList.remove("hidden")
    }
    else{
      $("#error-message").innerHTML= "An error has occurred"
      $("#require-mail").classList.remove("hidden")
    }
  }
}
