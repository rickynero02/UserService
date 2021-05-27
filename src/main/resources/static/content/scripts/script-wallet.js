document.addEventListener("DOMContentLoaded",main)

let user;

function main() {
  sendRequest("GET",requestPath + "checkSession", checkSession)
}


//Classes
class User {
  constructor(name, surname, color, image, role, username, email) {
    this.name = name;
    this.surname = surname;
    this.color = color
    this.image = image
    this.role = role;
    this.username = username;
    this.email = email
  }
  getName(){
    return this.name;
  }
  getSurname(){
    return this.surname;
  }
  getColor(){
    return this.color;
  }
  getImage(){
    return this.image;
  }
  getRole(){
    return this.role;
  }
  getUsername(){
    return this.username;
  }
  getEmail(){
    return this.email;
  }
}

class Comment {
  constructor(id,reviewer,body,image,date){
    this.id = id;
    this.reviewer = reviewer;
    this.body = body;
    this.image = image;
    this.date = date
  }
  getBody(){
    return this.id
  }
  getReviewer(){
    return this.reviewer
  }
  getBody(){
    return this.body
  }
  getReviewerImage(){
    return this.image
  }
  getReviewDate(){
    return this.date
  }
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
    user = new User(data.response.result.name,data.response.result.surname,data.response.result.color,data.response.result.image,data.response.result.role,data.response.result.username,data.response.result.email)
    var userData = new Vue({
      el: '#user-data',
      data: {
        name: user.getName(),
        surname: user.getSurname(),
        image: user.getImage(),
      }
    })

    var userInfo = new Vue({
      el: '#user-details__content',
      data: {
        name: user.getName(),
        surname: user.getSurname(),
        image: user.getImage(),
        color: user.getColor(),
        role: user.getRole(),
        username: user.getUsername(),
        email: user.getEmail()
      }
    })

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
  $("#file-reviewer").classList.add("animate__fadeInDown")
  $("#file-reviewer").classList.remove("animate__fadeOutUp")
  $("#file-reviewer").setAttribute("visible","")
  $("#add-review").setAttribute("onclick","hideFileReviewer('')")
}
function hideFileReviewer(){
  $("#file-reviewer").classList.remove("animate__fadeInDown")
  $("#file-reviewer").classList.add("animate__fadeOutUp")
  setTimeout(function (){$("#file-uploader").setAttribute("visible","hidden")},800)
  $("#add-review").setAttribute("onclick","showFileReviewer('')")
}

function showUserDetails(){
  let userD = $("#user-details")
  console.log(userD)
  if(userD.getAttribute("visible") === "hidden")
  {
    userD.setAttribute("visible","");
    userD.classList.remove("animate__fadeOutUp")
    userD.classList.add("animate__fadeInDown")
  }
  else {
    userD.classList.remove("animate__fadeInDown")
    userD.classList.add("animate__fadeOutUp")
    setTimeout(function(){
      userD.setAttribute("visible","hidden");
    }, 800)
  }
}

function showFileInfo(fileName,id){
  $('#file-wallet').setAttribute("visible","hidden")
  $('#file-info').setAttribute("visible","")
  $wr("#file-name",fileName)
  $("#file-id").value = id
  getComments()
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

function addReview(){
  let uncheckedComment = $("#comment-input")
  if(uncheckedComment.value === ""){
    console.log("U pesc");
  }else{
    let param = {'idFile': 1, 'owner': user.getUsername(), 'imgOwner': user.getImage(), 'body': uncheckedComment.value}
    sendRequest("POST", requestPathReviewService + "comments/addComment", getComments, param)
  }
  hideFileReviewer()
}

function controlComments(resp){
  console.log(resp)
}


function getComments(){
  let id = $("#file-id").value;
  console.log(id)
  sendRequest("GET", requestPathReviewService + "comments/getAllComments/"+id, printComments)
}

function printComments(data){
  console.log(data.message)
  if(data.message === "Not found comments"){
    let s = "<div class='color-grey'>There aren't comments for this file</div>"
    $wr("#review-container",s)
  }
  else
  {
    let comments = new Array();
    for (x of data){
      comments.unshift( new Comment(x.id,x.owner,x.body,x.imgOwner,x.cratedAt.split("T")[0]))
    }
    let s = ""
    for (x of comments){
      s += "<div class='mgt-20px'>" +
          "<div><label class='bold'>"+ x.getReviewer() +"</label><label class='text-1 color-grey'> - "+x.getReviewDate()+ "</label></div>"+
          "<div class='mgt-5px'>"+ x.getBody() +"</div>"+
          "</div>"
    }
    $wr("#review-container",s)
  }

}

function logout(){
  sendRequest("GET", requestPath + "logout",manageLogout)
}

function manageLogout(resp){
  console.log(resp.response.result)
  redirect("login.html")
}

function redirect(route){
  window.location.href=route
}
