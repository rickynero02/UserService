var regParam = {};

document.addEventListener("DOMContentLoaded",main)

function main(){
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setBgFromColorUI("logo-icon");
  setBgFromColorUI("customization-logo-icon");
  setBgFromColorUI("utype-logo-icon");
    setBgFromColorUI("upay-logo-icon");
}



//--FUNCTIONALITIES--
function showCustomizationTab(){
  $("#register-form").setAttribute("visible","hidden")
  $("#user-personalization").setAttribute("visible","")
  regParam.color = "5";
}

function showUserRoleSelection(){
    $("#user-personalization").setAttribute("visible","hidden")
    $("#utype-customization").setAttribute("visible","")
    regParam.role = "STANDARD"
}

function showPaymentForm(){
    $("#utype-customization").setAttribute("visible","hidden")
    $("#u-payment-form").setAttribute("visible","")
    regParam.role = "PREMIUM"
}

function addUserWithPayment(){
    let err = false
    let uncheckedOwnerName = $("#owner-name");
    let uncheckedOwnerSurname = $("#owner-surname");
    let uncheckedCardNumber = $("#card-number");
    let uncheckedCvv = $("#cvv");
    let uncheckedExpires = $("#expires");
    if(uncheckedOwnerName.value === ""){
            uncheckedOwnerName.setAttribute("style","border: solid red 2px");
            err = true;
    }
    else if (uncheckedOwnerSurname.value === ""){
        uncheckedOwnerSurname.setAttribute("style","border: solid red 2px");
        err = true;
    }
    else if (uncheckedCardNumber.value === ""){
        uncheckedCardNumber.setAttribute("style","border: solid red 2px");
        err = true;
    }
    else if(uncheckedCvv.value === ""){
        uncheckedCvv.setAttribute("style","border: solid red 2px");
        err = true;
    }
    else if(uncheckedExpires.value === ""){
        uncheckedExpires.setAttribute("style","border: solid red 2px");
        err = true;
    }

    if(err === true){
        $("#invalid-payment").innerHTML="Compile all fields"
    }
    else
    {
        regParam.payment = {'cardNumber': CryptoJS.SHA512(uncheckedCardNumber.value).toString(), 'ownerName': CryptoJS.SHA512(uncheckedOwnerName.value).toString(), 'ownerSurname': uncheckedOwnerSurname.value, 'cvv': CryptoJS.SHA512(uncheckedCvv.value).toString(), 'dateExpire': uncheckedExpires.value}
        register()
    }
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
      console.log(uncheckedPasswd)
      samePass = false;
      err = false;
      $("#register-passwd").setAttribute("style","border: solid red 2px");
      $("#register-conf-passwd").setAttribute("style","border: solid red 2px");
    }

    if(err === true || samePass === false){
      if(err === true){
        $("#login-error").innerHTML = "Compile all fields"
      }
      else {
        $("#login-error").innerHTML = "Passwords ar not the same"
      }

    }
    else
    {
      console.log(err)
      regParam = {'name': uncheckedName, 'surname': uncheckedSurname, 'username': uncheckedUsername, 'email': uncheckedEmail, 'password': CryptoJS.SHA512(uncheckedPasswd).toString()}
      setCookie("email",uncheckedEmail);
      showCustomizationTab();
    }
}

function register()
{
  sendRequest("POST",requestPath+"signup",sendVerification,regParam);
  let spinner = "<div class=\"spinner color-white color-grey--hov animate__animated animate__fadeIn\" style='width: 1.5rem; height: 1.5rem;'></div>"
    $wr(getBtnIdfromRole(),spinner)
}

function sendVerification(resp){
    console.log(resp);
  if(resp.response.result === "success"){
      let spinner = "Sign Up"
      $wr(getBtnIdfromRole(),spinner)
      window.location.href = "verAccount.html";
  }
  else if(resp.response.result === undefined)
  {
    window.location.href = "regError.html";
  }
  else
  {
      $("#invalid-payment").innerHTML = "An error has occurred while the creation of your account"
      let spinner = "Sign Up"
      $wr(getBtnIdfromRole(),spinner)
  }
}

function getBtnIdfromRole(){
    if(regParam.role === "STANDARD"){
        return "#sign-up-btn-1"
    }
    else
    {
        return "#payment-button"
    }
}
