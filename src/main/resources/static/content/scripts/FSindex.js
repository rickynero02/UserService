document.addEventListener("DOMContentLoaded",main)

function main() {
  initializeModeWithIconChange("dark-mode");
  setBg("landing")
  setIconRelatedBg("logo-icon");
  setIconRelatedBg("logo-icon-sm");
  setIconRelatedBg("info-container");
  setIconRelatedBg("sec-info-content");
  setIconRelatedBg("third-info-content");
  window.onscroll = function(){
    if(window.scrollY >= 100){
      if(getCookie("dark-mode")==="dark")
      {
        document.querySelector("#md-nav").classList.add("bg-antracite")
        document.querySelector("#md-nav").classList.add("color-white")
        document.querySelector("#md-nav").classList.add("mat-shadow")
        document.querySelector("#sm-nav").classList.add("bg-antracite")
        document.querySelector("#sm-nav").classList.add("color-white")
        document.querySelector("#sm-nav").classList.add("mat-shadow")
      }
      else
      {
        document.querySelector("#md-nav").classList.add("bg-white")
        document.querySelector("#md-nav").classList.add("color-black")
        document.querySelector("#md-nav").classList.add("mat-shadow")
        document.querySelector("#sm-nav").classList.add("bg-white")
        document.querySelector("#sm-nav").classList.add("color-black")
        document.querySelector("#sm-nav").classList.add("mat-shadow")
      }

    }
    else {

      if(getCookie("dark-mode")==="dark")
      {
        document.querySelector("#md-nav").classList.remove("bg-antracite")
        document.querySelector("#md-nav").classList.remove("color-white")
        document.querySelector("#md-nav").classList.remove("mat-shadow")
        document.querySelector("#sm-nav").classList.remove("bg-antracite")
        document.querySelector("#sm-nav").classList.remove("color-white")
        document.querySelector("#sm-nav").classList.remove("mat-shadow")
      }
      else
      {
        document.querySelector("#md-nav").classList.remove("bg-white")
        document.querySelector("#md-nav").classList.remove("color-black")
        document.querySelector("#md-nav").classList.remove("mat-shadow")
        document.querySelector("#sm-nav").classList.remove("bg-white")
        document.querySelector("#sm-nav").classList.remove("color-black")
        document.querySelector("#sm-nav").classList.remove("mat-shadow")
      }

    }
  }
}

function showSmartMenu(){
  document.querySelector("#sm-menu").setAttribute("visible","")
  document.querySelector("#hamburger").setAttribute("onclick","hideSmartMenu()")
  document.querySelector("#sm-nav").classList.add("color-black")
}

function hideSmartMenu(){
  document.querySelector("#sm-menu").setAttribute("visible","hidden")
  document.querySelector("#hamburger").setAttribute("onclick","showSmartMenu()")
  document.querySelector("#sm-nav").classList.remove("color-black")
}

function toggleText(requestedInfo){

      if(requestedInfo === "sharing"){
        document.querySelector("#info-switching-text").innerHTML="<div class='animate__animated animate__fadeIn'>"+
        "<label class='text-3 bold'><ion-icon name='arrow-redo-circle-outline'></ion-icon> Sharing</label><br>"+
        "<p class='mgt-5px'>Share a file is very simple, only one click, <br> drag and drop you file and click on the SHARE button,<br> and then , it's online!</p></div>"
      }
      else if(requestedInfo === "portable"){
        document.querySelector("#info-switching-text").innerHTML="<div class='animate__animated animate__fadeIn'>"+
        "<label class='text-3 bold'><ion-icon name='phone-portrait-outline'></ion-icon> Portability</label><br>"+
        "<p class='mgt-5px'>Take your iOS or iPadOS device and open the app,<br> search your file in your wallet on in our global library and<br> download everything you want!</p></div>"
      }
      else{
        document.querySelector("#info-switching-text").innerHTML="<div class='animate__animated animate__fadeIn'>"+
        "<label class='text-3 bold'><ion-icon name='lock-closed'></ion-icon> Privacy</label><br>"+
        "<p class='mgt-5px'>For us, your privacy is the most important thing.<br> Only you can see your password, <br> our systems saves only an encrypted version of your password</p></div>"
      }
}
