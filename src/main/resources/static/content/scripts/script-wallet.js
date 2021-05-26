document.addEventListener("DOMContentLoaded",main)

function main() {
  sendRequest("GET",requestPath + "checkSession", checkSession)
}

function checkSession(resp){
  if(resp.response.result !== "ok"){
    window.location.href="login.html"
  }
  else
  {
    sendRequest("GET",requestPath + "getSessionParams", setUpWallet)
  }
}

function setUpWallet(data){
  console.log(data)
  setCookie("background-id",data.response.result.color)
  setBgBody()
  setBgFromColorUI("md-nav-icon");
  setBgFromColorUI("uploader-icon");
  setBgFromColorUI("add-comment-icon");
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
    $("#add-review").setAttribute("onclick","showFileUploader()")
}

function showFileReviewer(){
  $("#file-uploader").classList.add("animate__fadeInDown")
  $("#file-uploader").classList.remove("animate__fadeOutUp")
  $("#file-uploader").setAttribute("visible","")
  $("#add-review").setAttribute("onclick","hideFileReviewer()")
}
function hideFileReviewer(){
  $("#file-uploader").classList.remove("animate__fadeInDown")
  $("#file-uploader").classList.add("animate__fadeOutUp")
  setTimeout(function (){$("#file-uploader").setAttribute("visible","hidden")},800)
  $("#file-up-trigger").setAttribute("onclick","showFileReviewer()")
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

function sendFile(){

}

function addReview(){
  console.log("Added");
}
