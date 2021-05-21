document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setIconRelatedBg("logo-icon");
}

//--FUNCTIONALITIES--
//Function used to take variables from login form inputs
function login(){
    let uncheckedEmail = document.querySelector("#login-email").value;
    let uncheckedPasswd = document.querySelector("#login-passwd").value;
    var err = false;
    if(uncheckedEmail == "")
    {
      err = true;
        document.querySelector("#login-email").setAttribute("style","border: solid red 2px");
    }
    if(uncheckedPasswd == "")
    {
      err = true;
        document.querySelector("#login-passwd").setAttribute("style","border: solid red 2px");
    }

    if(err){
      document.querySelector("#login-error").innerHTML = "Compile all fields"
    }
    else
    {
      let stringToSend = {username: uncheckedEmail, password: CryptoJS.SHA512(uncheckedPasswd).toString()}
      sendRequest("POST","http://79.35.53.166:8080/api/v1/signin",showState,stringToSend)
    }

}

function resendEmail(){
  sendRequest("","http://79.35.53.166:8080/api/v1/resendEmail?email="+getCookie("email"));
}


function showState(resp){
  console.log(resp.state)
}
