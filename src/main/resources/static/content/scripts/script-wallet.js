document.addEventListener("DOMContentLoaded",main)

let user;
let colorDictionary = {"0": "#00b7ff", "1": "#ff7700", "2": "#9500ff", "3": "#ffcc00", "4": "#fb7aff", "5":"#bdbdbd", "6":"#04db04", "7":"#d90804", "8": "#00e6ac", "9":"#525252", "10":"#ded4ab", "11":"#001be8", "12":"#57242e"}

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
  getId(){
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

class Feedback{
  constructor(feedId, vote, feedOwner){
    this.vote = vote
    this.feedId = feedId
    this.feedOwner = feedOwner
  }
  getFeedbackId(){
    return this.feedId
  }
  getVote(){
      return this.vote;
  }
  getFeedbackOwner(){
    return this.feedOwner
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
    setBgFromColorUI("add-feed-icon");
    $("#review-selector").value = "comments"
}

function toggleFileUploader(){
  let fileUploader = $("#file-uploader")
  if(fileUploader.getAttribute("visible") === "hidden"){
    $("#file-uploader").classList.add("animate__fadeInDown")
    $("#file-uploader").classList.remove("animate__fadeOutUp")
    $("#file-uploader").setAttribute("visible","")
  }
  else{
    $("#file-uploader").classList.remove("animate__fadeInDown")
    $("#file-uploader").classList.add("animate__fadeOutUp")
    setTimeout(function (){$("#file-uploader").setAttribute("visible","hidden")},500)
  }

}

function toggleFileReviewer(){
  let fileReviewer = $("#file-reviewer")
  if(fileReviewer.getAttribute("visible") === "hidden")
  {
    fileReviewer.classList.add("animate__fadeInDown")
    fileReviewer.classList.remove("animate__fadeOutUp")
    fileReviewer.setAttribute("visible","")
  }
  else{
    $("#file-reviewer").classList.remove("animate__fadeInDown")
    $("#file-reviewer").classList.add("animate__fadeOutUp")
    setTimeout(function (){$("#file-reviewer").setAttribute("visible","hidden")},500)
  }
}

function toggleFileFeed(){
  let fileFeeder = $("#file-feed")
  for(var i=1; i<6;i++){
    $("#feed-btn-"+i).setAttribute("style","color:grey")
  }
  $("#vote-cell").value = undefined;
  if(fileFeeder.getAttribute("visible") === "hidden")
  {
    fileFeeder.classList.add("animate__fadeInDown")
    fileFeeder.classList.remove("animate__fadeOutUp")
    fileFeeder.setAttribute("visible","")
  }else{
    fileFeeder.classList.remove("animate__fadeInDown")
    fileFeeder.classList.add("animate__fadeOutUp")
    setTimeout(function (){fileFeeder.setAttribute("visible","hidden")},500)
  }
}



function showUserDetails(){
  let userD = $("#user-details")
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
  $("#review-selector").value = "comments"
  $wr("#type-of-feed","comments")
  getComments()
}

function showFileWallet(){
  $('#file-info').setAttribute("visible","hidden")
  $('#file-wallet').setAttribute("visible","")
  $('#file-reviewer').setAttribute("visible","hidden")
  $('#file-feed').setAttribute("visible","hidden")
}

function setRequestReview(){
  let selected = $("#review-selector").value
  if(selected === "feed"){
    $wr("#type-of-feed","feedbacks")
    getFeed()
  }
  else {
    $wr("#type-of-feed","comments")
    getComments()
  }
}

function addReview(){
  let uncheckedComment = $("#comment-input")
  let id = $("#file-id").value
  if(uncheckedComment.value === ""){
    console.log("U pesc");
  }else{
    let param = {'idFile': id, 'owner': user.getUsername(), 'imgOwner': user.getImage(), 'body': uncheckedComment.value}
    sendRequest("POST", requestPathReviewService + "comments/addComment", getComments, param)
  }
  toggleFileReviewer()
}

function getComments(){
  let id = $("#file-id").value;
  sendRequest("GET", requestPathReviewService + "comments/getAllComments/"+id, printComments)
}

function printComments(data){
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
      s += "<div class='mgt-20px animate__animated animate__fadeIn'>" +
          "<div><label class='bold'>"+ x.getReviewer() +"</label><label class='text-1 color-grey'> - "+x.getReviewDate()+ "</label></div>"+
          "<div class='mgt-5px'>"+ x.getBody() +"</div>"+
          "<div class='translate-left-10px'><button onclick='addLike()' class='transparent text-4 mgt-5px color-red--hov'><ion-icon name='heart'></ion-icon></button>"
          if(x.getReviewer() === user.getUsername()){
            s += "<button onclick='removeComment(\""+x.getId()+"\")' class='transparent text-4 translate-left-10px color-grey--hov'><ion-icon name='trash'></ion-icon></button>"
          }
          s += "</div></div>"

    }
    $wr("#review-container",s)
  }

}

function removeComment(id){
  sendRequest("POST",requestPathReviewService + "comments/removeComment", manageRemoveComment, {'id':id})
}

function manageRemoveComment(resp){
  getComments()
}

function setFeedback(id){
  for(let i=1 ; i<6; i++){
    $("#feed-btn-"+i).setAttribute("style","color: grey;")
  }
  for(let j = id; j>0; j--){
    $("#feed-btn-"+j).setAttribute("style","color: var(--royal-blue);")
  }
  $("#vote-cell").value=id
}

function addFeed(){
  let vote = $("#vote-cell").value
  let id = $("#file-id").value
  if(vote === undefined)
  {
    console.log("non hai inserito un voto coglione")
  }
  else
  {
    sendRequest("POST",requestPathReviewService + "feedbacks/addFeedback", manageFeedbackResult ,{'owner':user.getUsername(), 'file':id, 'vote':vote})
    toggleFileFeed()
  }
}

function getFeed(){
  let id = $("#file-id").value
  sendRequest("POST", requestPathReviewService + "feedbacks/getFeedbacksFile", printFeed, {'file': id})
}

function printFeed(data){
  let feedbacks = new Array();
  let feedbackValues = new Array();
  if(data.message === "File dont have feedbacks"){
    $wr("#review-container","<div class='color-grey'>This file haven't got feedbacks</div>")
  }
  else{
    let s = ""
    for(x of data){
      feedbacks.unshift(new Feedback(x.id, x.vote, x.owner))
      feedbackValues.push(x.vote)
    }
    s += "<div class='color-grey'>Feedbacks Average</div><div flex>"
    for(var i=1; i<6; i++){
      if(i<=calculateFeedbacksAvg(feedbacks)){
        s += "<div class='color-royal-blue pd-5px'><ion-icon name='star'></ion-icon></div>"
      }
      else
        s += "<div class='pd-5px'><ion-icon name='star'></ion-icon></div>"
    }
    s += "</div>"
    s += "<div class='w-30'><canvas id='feed-chart'></canvas></div>"
    $wr("#review-container", s);
    setGraph(feedbackValues)
  }
}

function calculateFeedbacksAvg(feeds){
  let avg = 0;
  for(x in feeds){
    avg = avg +  feeds[x].getVote()
  }
  return avg / feeds.length
}

function manageFeedbackResult(resp){
  console.log(resp)
}

function logout(){
  sendRequest("GET", requestPath + "logout",manageLogout)
}

function manageLogout(resp){
  redirect("login.html")
}

function redirect(route){
  window.location.href=route
}

function setGraph(feedbacks){
  const numberOfFeedbacks = feedbacks => {
    const counts = {};
    for (var i = 0; i < feedbacks.length; i++) {
      counts[feedbacks[i]] = 1 + (counts[feedbacks[i]] || 0);
    };
    return counts;
  };
  let feedbackTotal = new Array()
  for( var i=1; i<6; i++){
    if(numberOfFeedbacks(feedbacks)[i] === undefined)
    {
      feedbackTotal.push(0)
    }
    else
    {
      feedbackTotal.push(numberOfFeedbacks(feedbacks)[i])
    }
  }

  var ctx = document.getElementById('feed-chart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [1,2,3,4,5],
      datasets: [{
        label: 'Number of Feedbacks',
        data: feedbackTotal,
        borderWidth: 1,
        backgroundColor: colorDictionary[getCookie("background-id")]
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}