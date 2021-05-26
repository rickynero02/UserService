document.addEventListener("DOMContentLoaded",main)

function main() {
  setBgBody();
  setBgFromColorUI("md-nav-icon");
  setBgFromColorUI("uploader-icon");
}

function showFileUploader(){
  $("#file-uploader").classList.add("animate__fadeInDown")
  $("#file-uploader").classList.remove("animate__fadeOutUp")
  $("#file-uploader").setAttribute("visible","")
  $("#file-up-trigger").setAttribute("onclick","hideFileUploader()")
}
function hideFileUploader(){
    $("#file-uploader").classList.remove("animate__fadeInDown")
    $("#file-uploader").classList.add("animate__fadeOutUp")
    setTimeout(function (){$("#file-uploader").setAttribute("visible","hidden")},800)
    $("#file-up-trigger").setAttribute("onclick","showFileUploader()")
}


function setClock(){
  var span = $("#clock");
  var d = new Date();
  var m = d.getMinutes();
  var h = d.getHours();
  span.textContent = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
  setInterval(setClock, 1000);
}

function showUserDetails(){
  var userDetails = $("#user-details")
  if(userDetails.getAttribute("visible") === "hidden")
  {
    userDetails.setAttribute("visible","");
    userDetails.classList.remove("animate__fadeOutUp")
    userDetails.classList.add("animate__fadeInDown")
  }
  else {
    userDetails.classList.remove("animate__fadeInDown")
    userDetails.classList.add("animate__fadeOutUp")
    setTimeout(function(){
      userDetails.setAttribute("visible","hidden");
    }, 800)
  }
}

function showFileInfo(fileName){
  $('#file-wallet').setAttribute("visible","hidden")
  $('#file-info').setAttribute("visible","")
  $wr("#file-name",fileName)
}

function showFileWallet(){
  $('#file-info').setAttribute("visible","hidden")
  $('#file-wallet').setAttribute("visible","")
}

function setRequestReview(){
  let selected = $("#review-selector").value
  if(selected === "feed"){
    $wr("#type-of-feed","feedbacks")
  }
  else {
    $wr("#type-of-feed","comments")
  }
}
