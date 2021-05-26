document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setBgFromColorUI("logo-icon");
}

function recoverPasswd(){
    let uncheckedEmail = $("#recoverP-email");
    if(uncheckedEmail.value === ""){
      unceckedEmail.setAttribute("style","border:solid red 2px")
      $("#recoverP-error").innerHTML="Insert your email";
    }
    else {
      sendRequest("GET",requestPath+"changePassword?email="+uncheckedEmail.value,requirePassRecover)
    }
}

function requirePassRecover(resp){
  let recoverLog = $("#recoverP-log")
  if(resp.status === 200){
    recoverPLog.classList.remove("color-red")
    recoverPLog.innerHTML = "Your email was sent"
  }
  else{
    recoverPLog.classList.add("color-red")
    recoverPLog.innerHTML = "There was a problem with your email, please check if your address is correct"
  }
}

function changePass(){
  let newPass = $("#changeP-passwd");
  let confNewPass = $("#changeP-conf-passwd");
  let changePErr = $("#ChangeP-error")
  if(newPass.value === confNewPass.value){
    let url = new URL(window.location);
    let p = url.searchParams.get("p");
    let stringToSend = {'param':p, 'passwd':CryptoJS.SHA512(newPass.value).toString()}
    sendRequest("POST",requestPath+"sendNewPassword",verifyPasswdModification,stringToSend)
  }
  else
  {
    newPass.setAttribute("style","border:solid red 2px")
    confNewPass.setAttribute("style","border:solid red 2px")
    changePErr.innerHTML = "Password are not the same";
  }
}

function verifyPasswdModification(resp){
  let changePLog = $("#ChangeP-log")
  if(resp.status === 200){
    changePLog.classList.remove("color-red")
    changePLog.innerHTML = "Your password has been changed. <a class='color-royal-blue underlined--hov'>Click here to login</a>"
  }
  else
  {
    changePLog.classList.add("color-red")
    changePLog.innerHTML = "Something was wrong. <a class='color-royal-blue underlined--hov'>Retry</a>"
  }
}
