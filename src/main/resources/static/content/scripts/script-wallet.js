document.addEventListener("DOMContentLoaded",main)

let user;
let colorDictionary = {"0": "#00b7ff", "1": "#ff7700", "2": "#9500ff", "3": "#ffcc00", "4": "#fb7aff", "5":"#bdbdbd", "6":"#04db04", "7":"#d90804", "8": "#00e6ac", "9":"#525252", "10":"#ded4ab", "11":"#001be8", "12":"#57242e"}

function main() {
  sendRequest("GET",requestPath + "checkSession", checkSession)
}






// -- SESSION CONTROL --
function checkSession(resp){
  if(resp.response.result !== "ok"){
    window.location.href="login.html"
  }
  else
  {
    sendRequest("GET",requestPath + "getSessionParams", setUpWallet)
  }
}






// -- WALLET SETUP & USER CONTROLLER--
class User {
  constructor(name, surname, color, image, role, username, email, sessionId) {
    this.name = name;
    this.surname = surname;
    this.color = color
    this.image = image
    this.role = role;
    this.username = username;
    this.email = email;
    this.sessionId = sessionId;
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
  getSessionId(){
    return this.sessionId
  }
}

function setUpWallet(data){
    user = new User(data.response.result.name,data.response.result.surname,data.response.result.color,data.response.result.image,data.response.result.role,data.response.result.username,data.response.result.email,data.response.sessionId)
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
    setWalletColor()
    $("#review-selector").value = "comments"
    getAllFiles()
}

function setWalletColor(){
  setBgBody()
  setBgFromColorUI("md-nav-icon");
  setBgFromColorUI("uploader-icon");
  setBgFromColorUI("add-comment-icon");
  setBgFromColorUI("add-feed-icon");
  setBgFromColorUI("bin-icon");
}

function showFileWallet(){
  $('#file-info').setAttribute("visible","hidden")
  $('#file-wallet').setAttribute("visible","")
  $('#file-reviewer').setAttribute("visible","hidden")
  $('#file-feed').setAttribute("visible","hidden")
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

function setHiddenValue(id){
  console.log()
  $("#color-id").value = id
  $("#color-selector").setAttribute("bg-texture",id)
  changeColor()
}

function changeColor(){
  let params = {'username': user.getUsername(), 'color': $("#color-id").value}
  sendRequest("POST",requestPath + "changeColor", confirmColorChange, params)
  setCookie("background-id", $("#color-id").value)
  setWalletColor()
}

function confirmColorChange(resp){
  console.log(resp)
}

function logout(){
  sendRequest("GET", requestPath + "logout",manageLogout)
}

function manageLogout(resp){
  redirect("login.html")
}







// -- FILE MANAGEMENT --
function getAllFiles(){
  sendRequestFile("GET", requestPathFileService + "getAll", setFiles, user.getSessionId())
}

function setFiles(resp){
  let s = ""
  let nameExtArr = new Array()
  if(resp.response.result.length === 0)
  {
    $wr("#file-visualizer", "Your wallet is empty!")
  }
  else
  {
    s +=  "<div class=\"w-100 of-x-hidden mgb-20px\" flex><div class='w-80 bold'>Resource Name</div><div class='w-10 bold'>Type</div><div class='w-10 bold'>Dimension</div></div>"
    for(x of resp.response.result){
      nameExtArr = x.name.split(".")
      s += "<div class=\"w-100 of-x-hidden\" flex>" +
          "                     <button onclick=\"showFileInfo('"+x.name+"','"+x.id+"')\" class='transparent w-80' style=\"max-width: 80%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\" flex>" +
          "                         <div class=\"mgb-10px\">" +
          "                             <ion-icon name=\"document\" class=\"translate-up-2px text-6 color-black\"></ion-icon>" +
          "                             <input id=\"file-id\" type=\"hidden\" value=\""+x.id+"\">" +
          "                             <input id=\"file-name\" type=\"hidden\" value=\""+x.name+"\">" +
          "                         </div>" +
          "                         <label class=\"transparent text-3 translate-right-5px\"> "+x.name+"</label>" +
          "                     </button>" +
          "                     <div class='w-10'>" + nameExtArr[nameExtArr.length - 1] + "</div>" +
          "                     <div class='w-10'>" + x.length + " byte</div>" +
          "                  </div>"
    }
    $wr("#file-visualizer", s)
  }
}
function showFileInfo(fileName,id){
  $('#file-wallet').setAttribute("visible","hidden")
  $('#file-info').removeAttribute("visible")
  console.log(fileName)
  $("#file-info-name").value = fileName
  $wr("#file-info-name", fileName)
  console.log(id)
  $("#file-info-id").value = id
  $("#review-selector").value = "comments"
  $wr("#type-of-feed","comments")
  getComments()
}




// -- UPLOAD FILES--
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

function upload(){
  let file = document.getElementById("files-uploader").files[0];
  let formData = new FormData();
  formData.append("file", file);
  sendRequestFile("POST", requestPathFileService + "upload", controlUpload, user.getSessionId(), formData);
  let str = "<div class=\"spinner color-white\" style='width: 1rem; height: 1rem;'></div>"
  $wr("#up-button", str)
}

function controlUpload(resp){
      toggleFileUploader()
      $wr("#up-button", "Upload")
      getAllFiles()
}






// -- DOWNLOAD FILES --
function requestDownload(){
  fileId = $("#file-info-id").value;
  filePassword = ""
  let spinner = "<div class=\"spinner color-white color-grey--hov\" style='width: 1.125rem; height: 1.125rem;'></div>"
  $wr("#file-download", spinner)
  sendRequestFileDownload("GET", requestPathFileService + "download?id="+fileId+"&password="+filePassword, startDownload, user.getSessionId())
}

function startDownload(resp){
  const data = resp;
  fileName = $("#file-info-name").value
  download(fileName, data);
}

function download(filename, text) {
  let spinner = "<ion-icon name=\"cloud-download-outline\" class=\"text-4 translate-down-3px\"></ion-icon>"
  $wr("#file-download", spinner)
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/octet-stream' + text);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}







// -- DELETE FILES --
function toggleFileBin(){
  let fileBin = $("#file-bin")
  if(fileBin.getAttribute("visible") === "hidden"){
    fileBin.classList.add("animate__fadeInDown")
    fileBin.classList.remove("animate__fadeOutUp")
    fileBin.setAttribute("visible","")
  }
  else{
    fileBin.classList.remove("animate__fadeInDown")
    fileBin.classList.add("animate__fadeOutUp")
    setTimeout(function (){fileBin.setAttribute("visible","hidden")},500)
  }
}

function deleteFile(){
  let fileId = $('#file-info-id').value
  sendRequestFile("DELETE", requestPathFileService + "delete/"+fileId, controlDelete, user.getSessionId())
}

function controlDelete(resp){
  console.log(resp)
  toggleFileBin()
  getAllFiles()
  showFileWallet()
}







// -- RESEARCH FILES --
function searchFiles(){
  let searchParam = $("#search-bar").value
  let searchParams = new Array()
  if(searchParam === ""){
    $("#search-file").setAttribute("style","padding: 3px; border: solid red 2px")
  }
  else
  {
    if(searchParam[0] === "#" && searchParam[1] != "")
    {
      searchParam = searchParam.substring(1)
      searchParams.push(searchParam)
      sendRequestFile("POST",requestPathFileService + "getByTags", printSearchedFiles, user.getSessionId(), searchParams)
      $("#search-file").setAttribute("style","padding: 3px;")
    }
    else
    {
      $("#search-file").setAttribute("style","padding: 3px; border: solid red 2px")
    }
  }
}

function printSearchedFiles(resp){
  console.log(resp)
}






// -- REVIEW (COMMENTS & FEEDBACKS) --
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






// -- COMMENTS --
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

function addReview(){
  let uncheckedComment = $("#comment-input")
  let id = $("#file-info-id").value
  if(uncheckedComment.value === ""){
    console.log("U pesc");
  }else{
    let param = {'idFile': id, 'owner': user.getUsername(), 'imgOwner': user.getImage(), 'body': uncheckedComment.value}
    sendRequest("POST", requestPathReviewService + "comments/addComment", getComments, param)
  }
  toggleFileReviewer()
  $("#review-selector").value = "comments"
  setRequestReview()
}

function getComments(){
  let id = $("#file-info-id").value;
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
          "<div class='translate-left-5px'><button onclick='addLike()' class='transparent text-4 mgt-5px color-red--hov'><ion-icon name='heart'></ion-icon></button>"
      if(x.getReviewer() === user.getUsername()){
        s += "<button onclick='removeComment(\""+x.getId()+"\")' class='transparent text-4 translate-left-5px color-grey--hov'><ion-icon name='trash'></ion-icon></button>"
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








// -- FEEDBACKS --
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
  let id = $("#file-info-id").value
  if(vote === undefined)
  {
    console.log("non hai inserito un voto coglione")
  }
  else
  {
    sendRequest("POST",requestPathReviewService + "feedbacks/addFeedback", manageFeedbackResult ,{'owner':user.getUsername(), 'file':id, 'vote':vote})
    toggleFileFeed()
    getFeed()
    $("#review-selector").value = "feed"
    setRequestReview()
  }
}

function getFeed(){
  let id = $("#file-info-id").value
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
    s += "<div class='w-30 mgt-20px'><canvas id='feed-chart'></canvas></div>"
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