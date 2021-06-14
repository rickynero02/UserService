document.addEventListener("DOMContentLoaded",main)

function main() {
  initializeModeWithIconChange("dark-mode");
  setBg("landing")
  setBgFromColorUI("logo-icon");
  setBgFromColorUI("info-container");
  setBgFromColorUI("security-title");
  setLightBgFromColorUI("sec-info-content");
  setLightBgFromColorUI("third-info-content");
  setLightBgFromColorUI("info-security");
  setBgFromColorUI("port-title");
  setLightBgFromColorUI("port-icon");
  setSocialImageFromColorUI("social-image")
  setImagePortabilityFromColorUI()
  toggleNavColor()

  window.onscroll = function(){
      toggleNavColor()
  }
}

function toggleNavColor(){
  if(window.scrollY >= 100){
    if(getCookie("dark-mode")==="dark")
    {
      $("#md-nav").classList.add("bg-antracite")
      $("#md-nav").classList.add("color-white")
      $("#md-nav").classList.add("mat-shadow")
    }
    else
    {
      $("#md-nav").classList.add("bg-white")
      $("#md-nav").classList.add("color-black")
      $("#md-nav").classList.add("mat-shadow")
    }

  }
  else {
    if(getCookie("dark-mode")==="dark")
    {
      $("#md-nav").classList.remove("bg-antracite")
      $("#md-nav").classList.remove("color-white")
      $("#md-nav").classList.remove("mat-shadow")
    }
    else
    {
      $("#md-nav").classList.remove("bg-white")
      $("#md-nav").classList.remove("color-black")
      $("#md-nav").classList.remove("mat-shadow")
    }
  }
}

function setImagePortabilityFromColorUI(){
  $("#portability-image").src="content/images/index-images/portability/"+getCookie("background-id")+".png";
}

function toggleText(requestedInfo){

      if(requestedInfo === "sharing"){
        $("#info-switching-text").innerHTML="<div class='animate__animated animate__fadeIn'>"+
        "<label class='text-3 bold'><ion-icon name='arrow-redo-circle-outline'></ion-icon> Sharing</label><br>"+
        "<p class='mgt-5px'>Share a file is very simple, only one click, <br> drag and drop you file and click on the SHARE button,<br> and then , it's online!</p></div>"
      }
      else if(requestedInfo === "portable"){
        $("#info-switching-text").innerHTML="<div class='animate__animated animate__fadeIn'>"+
        "<label class='text-3 bold'><ion-icon name='phone-portrait-outline'></ion-icon> Portability</label><br>"+
        "<p class='mgt-5px'>Take your iOS or iPadOS device and open the app,<br> search your file in your wallet on in our global library and<br> download everything you want!</p></div>"
      }
      else{
        $("#info-switching-text").innerHTML="<div class='animate__animated animate__fadeIn'>"+
        "<label class='text-3 bold'><ion-icon name='lock-closed'></ion-icon> Privacy</label><br>"+
        "<p class='mgt-5px'>For us, your privacy is the most important thing.<br> Only you can see your password, <br> our systems saves only an encrypted version of your password</p></div>"
      }
}
