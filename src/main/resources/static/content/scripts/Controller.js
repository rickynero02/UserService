document.addEventListener("DOMContentLoaded",main)

function main(){
    configureMode("dark-mode","light");   //Configuring Dark Mode
    if(getCookie("background-id")===""){ //Setting Default Background
        setCookie("background-id","0")
    }
}



// -- GET ELEMENTS --
//imported jQuery function to get elements from HTML
function $(param){
  return document.querySelector(param);
}

function $wr(selector,param){
  $(selector).innerHTML = param;
}



// -- REQUESTS --
//setting default request path
//var requestPath="http://79.35.53.166:8080/api/v1/users/"
var requestPath="http://localhost:8080/api/v1/users/"
var requestPathReviewService = "http://localhost:9090/api/v1/"
var requestPathFileService = "http://localhost:7070/api/v1/files/"

//Generic request function
function sendRequest(method,url,callback,stringToSend){
    fetch(url,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            method: method,
            body: JSON.stringify(stringToSend)
        })
        .then(response => response.json())
        .then(data => callback(data));
}

function sendRequestFile(method,url,callback,sessionId,param){
    fetch(url,
        {
            headers: {
                'Accept' : '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'SESSION': sessionId
            },
            method: method,
            body: param
        })
        .then(response => response.json())
        .then(data => callback(data));
}

function sendRequestFileDownload(method,url,callback,sessionId,param){
    fetch(url, {
        method: method,
        headers: {
            "SESSION" : sessionId
        }
    }).then( response => response.blob() )
        .then( blob =>{
            var reader = new FileReader() ;
            reader.onload = function(){ callback(this.result)} ; // <--- `this.result` contains a base64 data URI
            reader.readAsDataURL(blob);
        }) ;
}



//-- COOKIES MANAGEMENT --
//Function necessary to set a cookie from JavaScript
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

//Function that control if a cookie exists and return a boolean value (true if cookie exists)
function checkCookie(cookie) {
    var cookieToCheck = getCookie(cookie);
    if (cookieToCheck != "") {
        return true;
    } else {
        return false;
    }
}

function getSessionId(){
    var jsId = document.cookie.match(/SESSION=[^;]+/);
    if(jsId != null) {
        if (jsId instanceof Array)
            jsId = jsId[0].substring(11);
        else
            jsId = jsId.substring(11);
    }
    return jsId;
}




// -- RANDOM BACKGROUNDS --
//Generating Random Background Id
function generateRandomBg(){
    bgId = parseInt(Math.random()*13);
    setCookie("background-id",bgId);
}

//Setting Body Background getting the id from a cookie
function setBgBody(){
    let cookie = getCookie('background-id');
    document.body.setAttribute("style","background: url(content/images/wallpapers/"+cookie+".jpg)");
}

//Setting Element Background getting the id from a cookie
function setBg(id){
    let cookie = getCookie('background-id');
    document.querySelector('#'+id).setAttribute("style","background: url(content/images/wallpapers/"+cookie+".jpg)");
}

//Setting Background getting the id from a cookie and getting color gradient from ColorUI.sass
function setBgFromColorUI(id){
    document.querySelector("#"+id).setAttribute("bg-texture",getCookie("background-id"));
}

//Setting Light Background getting the id from a cookie and getting color gradient from ColorUI.sass
function setLightBgFromColorUI(id){
    document.querySelector("#"+id).setAttribute("bg-texture",getCookie("background-id")+"--light");
}





// -- DARK MODE --
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

//function used to change trigger icon
function toggleDarkModeIcon(){
    document.querySelector("#dark-toggle-sun").classList.toggle("hidden")
    document.querySelector("#dark-toggle-moon").classList.toggle("hidden")
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

//function necessary for the dark mode functionality, swap dark-classes with classes
function swapClasses(elementsToObscure){
    for(let x=0; x<elementsToObscure.length; x++){
        let tmp = elementsToObscure[x].getAttribute("class");
        elementsToObscure[x].setAttribute("class",elementsToObscure[x].getAttribute("dark-class"));
        elementsToObscure[x].setAttribute("dark-class",tmp);
    }
}
