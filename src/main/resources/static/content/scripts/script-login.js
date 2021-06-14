document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setBgFromColorUI("logo-icon");
}

//--FUNCTIONALITIES--
//Function used to take variables from login form inputs
function login(){
    let uncheckedEmail = $("#login-email").value;
    let uncheckedPasswd = $("#login-passwd").value;
    var err = false;
    if(uncheckedEmail == "")
    {
      err = true;
        $("#login-email").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedPasswd == "")
    {
      err = true;
        $("#login-passwd").setAttribute("style","border: solid red 2px");
    }

    if(err){
      $("#login-error").innerHTML = "Compile all fields"
    }
    else
    {
      let stringToSend = {username: uncheckedEmail, password: CryptoJS.SHA512(uncheckedPasswd).toString()}
      sendRequest("POST",requestPath+"signin",controlLogin,stringToSend)
    }
}

function resendEmail(){
  sendRequest("",requestPath+"resendEmail?email="+getCookie("email"));
}

function controlLogin(resp){
    console.log(resp)
    if(resp.response.result === "Login successfully"){
       window.location.href="wallet.html"
    }
    else
    {
        $("#login-error").innerHTML = "This account doesn't exists"
    }
}
