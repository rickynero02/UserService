document.addEventListener("DOMContentLoaded",main)

function main() {
  initializeModeWithIconChange("dark-mode");
  setBgBody();
  setBgFromColorUI("md-nav-icon");
  window.addEventListener('keydown', function (e) {
    console.log(e.key)
      if(e.key === "ArrowDown"){
        showFileUploader()
      }
      else if(e.key==="ArrowUp"){
        hideFileUploader();
      }
  }, false);
}

function showFileUploader(){
  document.querySelector("#file-uploader").classList.add("animate__fadeInDown")
  document.querySelector("#file-uploader").classList.remove("animate__fadeOutUp")
  document.querySelector("#file-uploader").setAttribute("visible","")
  document.querySelector("#file-up-trigger").setAttribute("onclick","hideFileUploader()")
}
function hideFileUploader(){
    document.querySelector("#file-uploader").classList.remove("animate__fadeInDown")
    document.querySelector("#file-uploader").classList.add("animate__fadeOutUp")
    setTimeout(function (){document.querySelector("#file-uploader").setAttribute("visible","hidden")},800)
    document.querySelector("#file-up-trigger").setAttribute("onclick","showFileUploader()")
}
