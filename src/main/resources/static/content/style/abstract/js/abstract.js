//---DARK MODE---
//Function used to create cookie necessary for a persistent dark mode, and to set default mode
function configureMode(cookieName,defaultMode){
    if(checkCookie(cookieName) === false){
      setCookie(cookieName,defaultMode);
    }
}

//Function necessary to toggle the correct mode at page loading
function initializeMode(cookieName){
  let elements = document.querySelectorAll("[dark-class]");
  if(getCookie(cookieName) === "dark"){
   swapClasses(elements);
  }
}

//Function necessary to toggle the correct mode and the correct trigger icon at page loading (exclusive for File Sharing)
function initializeModeWithIconChange(cookieName){
  let elements = document.querySelectorAll("[dark-class]");
  if(getCookie(cookieName) === "dark"){
   swapClasses(elements);
   toggleDarkModeIcon()
  }
}

//Function used to change mode by a button
function toggleDarkMode(cookieName){
  document.body.setAttribute("transition","dark-mode");
  let elementsWithDarkMode = document.querySelectorAll("[dark-class]");
  if(getCookie(cookieName) === "dark"){
    setCookie(cookieName,"light")
  }
  else
  {
    setCookie(cookieName,"dark")
  }
  swapClasses(elementsWithDarkMode);
}

//Function used to change mode and trigger icon by a button
function toggleDarkModeWithIconChange(cookieName){
  document.body.setAttribute("transition","dark-mode");
  let elementsWithDarkMode = document.querySelectorAll("[dark-class]");
  if(getCookie(cookieName) === "dark"){
    setCookie(cookieName,"light")
  }
  else
  {
    setCookie(cookieName,"dark")
  }
  toggleDarkModeIcon()
  swapClasses(elementsWithDarkMode);

}

//function used to change trigger icon
function toggleDarkModeIcon(){
  document.querySelector("#dark-toggle-sun").classList.toggle("hidden")
  document.querySelector("#dark-toggle-moon").classList.toggle("hidden")
}

//function necessary for the dark mode functionality, swap dark-classes with classes
function swapClasses(elementsToObscure){
  for(let x=0; x<elementsToObscure.length; x++){
    let tmp = elementsToObscure[x].getAttribute("class");
    elementsToObscure[x].setAttribute("class",elementsToObscure[x].getAttribute("dark-class"));
    elementsToObscure[x].setAttribute("dark-class",tmp);
  }
}

//---COOKIE MANAGEMENT---
//Function necessary to set a cookie from Javascript
function setCookie(cookieName, cookieValue, expires) {
  var d = new Date();
  d.setTime(d.getTime() + (expires*24*60*60*1000));
  var expiress = "expires="+ d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

//Function necessary to delete a cookie from JavaScript
function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

//Function necessary to get cookies values using JavaScript
function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Function that control if a cookie exists and return a boolean value
function checkCookie(cookie) {
  var cookieToCheck = getCookie(cookie);
  if (cookieToCheck != "") {
   return true;
  } else {
    return false;
  }
}
