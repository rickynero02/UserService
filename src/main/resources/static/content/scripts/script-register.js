var regParam = {};

document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setBgFromColorUI("logo-icon");
  setBgFromColorUI("customization-logo-icon");
  //setBgFromColorUI("utype-logo-icon");
}



//--FUNCTIONALITIES--
function showCustomizationTab(){
  $("#register-form").setAttribute("visible","hidden")
  $("#user-personalization").setAttribute("visible","")
  regParam.color = "5";
}

function setHiddenValue(id){
  console.log()
  $("#color-id").value = id
  $("#color-selector").setAttribute("bg-texture",id)
  regParam.color = $("#color-id").value;
  console.log(regParam)
}

function nextRegister(){
    let uncheckedName = $("#register-name").value;
    let uncheckedSurname = $("#register-surname").value;
    let uncheckedEmail = $("#register-email").value;
    let uncheckedPasswd = $("#register-passwd").value;
    let uncheckedConfPasswd = $("#register-conf-passwd").value;
    let uncheckedUsername = $("#register-username").value;
    var err = false;
    var samePass = true;

    if(uncheckedName === "")
    {
      err = true;
        $("#register-name").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedSurname === "")
    {
      err = true;
        $("#register-surname").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedEmail === "")
    {
      err = true;
        $("#register-email").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedPasswd === "")
    {
      err = true;
      $("#register-passwd").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedConfPasswd === "")
    {
      err = true;
      $("#register-conf-passwd").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedUsername === "")
    {
      err = true;
        $("#register-username").setAttribute("style","border: solid red 2px");
    }
    if (uncheckedPasswd !== uncheckedConfPasswd){
      samePass = false;
      $("#login-error").innerHTML = "Passwords are not the same"
      $("#register-passwd").setAttribute("style","border: solid red 2px");
      $("#register-conf-passwd").setAttribute("style","border: solid red 2px");
    }

    if(err && samePass === false){
      $("#login-error").innerHTML = "Compile all fields"
    }
    else
    {
      regParam = {'name': uncheckedName, 'surname': uncheckedSurname, 'username': uncheckedUsername, 'email': uncheckedEmail, 'password': CryptoJS.SHA512(uncheckedPasswd).toString(), 'role': "STANDARD" }
      setCookie("email",uncheckedEmail);
      showCustomizationTab();
    }
}

function register()
{
  sendRequest("POST",requestPath+"signup",sendVerification,regParam);
}

function sendVerification(resp){
  if(resp.status === 200){
    window.location.href = "verAccount.html";
  }
  else
  {
    //window.location.href = "regError.html";
    console.log("Errore")
  }
}
