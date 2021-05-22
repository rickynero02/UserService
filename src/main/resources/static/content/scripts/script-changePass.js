document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setBgFromColorUI("logo-icon");
}

function recoverPasswd(){
    let uncheckedEmail = document.querySelector("#recoverP-email");
    if(uncheckedEmail.value === ""){
      unceckedEmail.setAttribute("style","border:solid red 2px")
      document.querySelector("#recoverP-error").innerHTML="Insert your email";
    }
    else {
      sendRequest("GET","http://79.35.53.166:8080/api/v1/changePassword?email="+uncheckedEmail.value,requirePassRecover)
    }
}

function requirePassRecover(resp){
  let recoverLog = document.querySelector("#recoverP-log")
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
  let newPass = document.querySelector("#changeP-passwd");
  let confNewPass = document.querySelector("#changeP-conf-passwd");
  let changePErr = document.querySelector("#ChangeP-error")
  if(newPass.value === confNewPass.value){
    let url = new URL(window.location);
    let p = url.searchParams.get("p");
    let stringToSend = {'oneTimePassword':p, 'passwd':CryptoJS.SHA512(newPass.value).toString()}
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
  let changePLog = document.querySelector("#ChangeP-log")
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
