document.addEventListener("DOMContentLoaded",main)

function main(){
  controlEmailVerification()
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

function controlEmailVerification() {
  let url = new URL(window.location);
  let token = url.searchParams.get("token");
  sendRequest("GET",requestPath+"confirmEmail?token="+token,editEmailVerification)
}

function editEmailVerification(resp){
  console.log(resp)
  var res = resp.json()
  if (res.result = "ok") {
    document.querySelector("#creation-confirmed").setAttribute("visible", "")
    document.querySelector("#creation-error").setAttribute("visible", "hidden")
  } else {
    document.querySelector("#creation-error").setAttribute("visible", "")
    document.querySelector("#creation-confirmed").setAttribute("visible", "hidden")
  }
}
