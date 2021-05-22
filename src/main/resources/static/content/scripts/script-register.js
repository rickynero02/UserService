document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setBgFromColorUI("logo-icon");
}

//--FUNCTIONALITIES--
function register(){
    let uncheckedName = document.querySelector("#register-name").value;
    let uncheckedSurname = document.querySelector("#register-surname").value;
    let uncheckedEmail = document.querySelector("#register-email").value;
    let uncheckedPasswd = document.querySelector("#register-passwd").value;
    let uncheckedConfPasswd = document.querySelector("#register-conf-passwd").value;
    let uncheckedUsername = document.querySelector("#register-username").value;
    var err = false;
    var samePass = true;

    if(uncheckedName === "")
    {
      err = true;
        document.querySelector("#register-name").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedSurname === "")
    {
      err = true;
        document.querySelector("#register-surname").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedEmail === "")
    {
      err = true;
        document.querySelector("#register-email").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedPasswd === "")
    {
      err = true;
      document.querySelector("#register-passwd").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedConfPasswd === "")
    {
      err = true;
      document.querySelector("#register-conf-passwd").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedUsername === "")
    {
      err = true;
        document.querySelector("#register-username").setAttribute("style","border: solid red 2px");
    }
    if (uncheckedPasswd !== uncheckedConfPasswd){
      samePass = false;
      document.querySelector("#login-error").innerHTML = "Passwords are not the same"
      document.querySelector("#register-passwd").setAttribute("style","border: solid red 2px");
      document.querySelector("#register-conf-passwd").setAttribute("style","border: solid red 2px");
    }

    if(err && samePass === false){
      document.querySelector("#login-error").innerHTML = "Compile all fields"
    }
    else
    {
      let stringToSend = {'name': uncheckedName, 'surname': uncheckedSurname, 'username': uncheckedUsername, 'email': uncheckedEmail, 'password': CryptoJS.SHA512(uncheckedPasswd).toString()}
      setCookie("email",uncheckedEmail);
      sendRequest("POST",requestPath+"signup",sendVerification,stringToSend);
    }
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
