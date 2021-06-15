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
      let spinner = "<div class=\"spinner color-white color-grey--hov animate__animated animate__fadeIn\" style='width: 1.5rem; height: 1.5rem;'></div>"
      $wr("#recovery-pass-btn",spinner)
    }
}

function requirePassRecover(resp){
  let recoverPLog = $("#recoverP-log")
  if(resp.response.result === "Sent email"){
    $("#recovery-pass-btn").setAttribute("visible","hidden")
    recoverPLog.classList.remove("color-red")
    recoverPLog.innerHTML = "<label class='text-3'> Your email was sent </label>"
  }
  else{
    recoverPLog.classList.add("color-red")
    $wr("#recovery-pass-btn","Change Password")
    recoverPLog.innerHTML = "There was a problem with your email, please check if your address is correct"
  }
}

function changePass(){
  let newPass = $("#changeP-passwd");
  let confNewPass = $("#changeP-conf-passwd");
  let changePErr = $("#changeP-error")
  if(newPass.value === confNewPass.value){
    let url = new URL(window.location);
    let p = url.searchParams.get("p");
    let stringToSend = {'param':p, 'passwd': CryptoJS.SHA512(newPass.value).toString()}
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
  let changePLog = $("#changeP-log")
  if(resp.response.password === "changed"){
    changePLog.classList.remove("color-red")
    changePLog.innerHTML = "Your password has been changed. <a href='login.html' class='color-royal-blue underlined--hov'>Click here to login</a>"
  }
  else
  {
    changePLog.classList.add("color-red")
    changePLog.innerHTML = "Something was wrong. <a href='recoveryPass.html' class='color-royal-blue underlined--hov'>Retry</a>"
  }
}
