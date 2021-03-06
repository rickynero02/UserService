document.addEventListener("DOMContentLoaded",main)

let user;
let colorDictionary = {"0": "#00b7ff", "1": "#ff7700", "2": "#9500ff", "3": "#ffcc00", "4": "#fb7aff", "5":"#bdbdbd", "6":"#04db04", "7":"#d90804", "8": "#00e6ac", "9":"#525252", "10":"#ded4ab", "11":"#001be8", "12":"#57242e"}
let files = new Array()
let likeArray;
let commentsArray;

function main() {
  $("#search-bar").value=""
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
    return this.name.toUpperCase()[0]
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

  var userImage = new Vue(
      {
        el: "#user-image-nav",
        data: {
          image: user.getImage(),
        }
      }
  )

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
}

function setWalletColor(){
  setBgBody()
  setBgFromColorUI("md-nav-icon");
  setBgFromColorUI("add-comment-icon");
  setBgFromColorUI("add-feed-icon");
  setBgFromColorUI("color-changer");
  setBgFromColorUI("pass-icon");
  setBgFromColorUI("user-image");
  setBgFromColorUI("user-image-in-details");
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
  $("#color-id").value = id
  $("#color-changer").setAttribute("bg-texture",id)
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
class File {
  constructor(file) {
    this.file = file
  }

  getFileId() {
    return this.file.id;
  }

  getFileName() {
    return this.file.name;
  }

  getFileType() {
    let splittedFileName = this.file.name.split(".")
    return splittedFileName[splittedFileName.length - 1]
  }

  getFileOwner() {
    return this.file.owner;
  }

  getFileState() {
    return this.file.private;
  }

  getFilePassword() {
    return this.file.password
  }

  getFileCategories() {
    let splittedFileCategories = new Array()
    if (this.file.tags.categories === 0 || this.file.categories[0] === "") {
      splittedFileCategories = []
      return splittedFileCategories;
    } else {
      for (x of this.file.categories) {
        splittedFileCategories.push(x)
      }
      return splittedFileCategories
    }
  }

  getFileTags() {
    let splittedFileTags = new Array()
    if (this.file.tags.length === 0 || this.file.tags[0] === "") {
      splittedFileTags = []
      return splittedFileTags
    } else {
      for (x of this.file.tags) {
        splittedFileTags.push(x)
      }
      return splittedFileTags
    }
  }
  getFileLength(){
    return  this.file.length;
  }
}


function getFileById(id){
  for (x of files){
    if(x.getFileId() === id){
      return x
    }
  }
}

function getAllFiles(){
  sendRequestFile("GET", requestPathFileService + "getAll", setFiles, user.getSessionId())
}

function setFiles(resp){
  files = [];
  let s = ""
 if(resp.response.result != undefined){
     for(x of resp.response.result){
       files.unshift(new File(x))
       $("#file-visualizer-header").classList.remove("hidden")
       s += "<div class=\"w-100 of-x-hidden\" flex>"
       if(files[0].getFileState() === true){
         s+= "<ion-icon name=\"lock-closed\" class='text-4 translate-down-4px mgr-5px'></ion-icon>"
       }
       else
       {
         s+= "<ion-icon name=\"people\" class='text-4 translate-down-4px mgr-5px'></ion-icon>"
       }
       s += "                     <button onclick=\"toggleFilePassword('"+files[0].getFileId()+"')\" class='transparent w-80' style=\"max-width: 80%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\" flex>" +
           "                         <div class=\"mgb-10px\">" +
           "                             <img src=\"content/images/icons/" +  files[0].getFileType() + ".png" +
           "                             \" onerror=\"this.onerror=null; this.src='content/images/icons/generic-file.png'\" class=\"drop-shadow-3 mgr-10px\" style=\"width: 1.45rem;\">" +
           "                             <input id=\"file-id\" type=\"hidden\" value=\""+files[0].getFileId()+"\">" +
           "                             <input id=\"file-name\" type=\"hidden\" value=\""+files[0].getFileName()+"\">" +
           "                         </div>" +
           "                         <label class=\"transparent text-3 translate-right-5px color-blue--hov\"> "+files[0].getFileName()+"</label>" +
           "                     </button>" +
           "                     <div class='w-10 type-and-dim'>" + files[0].getFileType() + "</div>" +
           "                     <div class='w-10 type-and-dim'>" + files[0].getFileLength() + " byte</div>" +
           "                  </div>"
     }
     $wr("#file-visualizer", s)
 }
 else
 {
   $wr("#file-visualizer", "The search did not return any results")
   $("#file-visualizer-header").classList.add("hidden")
 }
}

function alternativeToggleFilePassword(){
  let filePass = $("#file-passwd");
  if(filePass.getAttribute("visible") === "hidden")
  {
    filePass.classList.add("animate__fadeInDown")
    filePass.classList.remove("animate__fadeOutUp")
    filePass.setAttribute("visible","")
    $("#file-passwd-input").value = ""
    $("#file-passwd-error").innerHTML= ""
    $('#check-pass-btn').setAttribute("onclick", "checkPassword('"+file.getFileId()+"')")
  }
  else{
    filePass.classList.remove("animate__fadeInDown")
    filePass.classList.add("animate__fadeOutUp")
    setTimeout(function (){$("#file-passwd").setAttribute("visible","hidden")},500)
  }
}

function toggleFilePassword(fileId){
  let file = getFileById(fileId)
  if(user.getUsername() === file.getFileOwner() || file.getFilePassword() === null){
    showFileInfo(file.getFileId())
  }
  else
  {
    let filePass = $("#file-passwd");
    if(filePass.getAttribute("visible") === "hidden")
    {
      filePass.classList.add("animate__fadeInDown")
      filePass.classList.remove("animate__fadeOutUp")
      filePass.setAttribute("visible","")
      $("#file-passwd-input").value = ""
      $("#file-passwd-error").innerHTML= ""
      $('#check-pass-btn').setAttribute("onclick", "checkPassword('"+file.getFileId()+"')")
    }
    else{
      filePass.classList.remove("animate__fadeInDown")
      filePass.classList.add("animate__fadeOutUp")
      setTimeout(function (){$("#file-passwd").setAttribute("visible","hidden")},500)
    }
  }
}

function checkPassword(fileId){
  let file = getFileById(fileId)
  let uncheckedPassword = $("#file-passwd-input").value
  if(CryptoJS.SHA512(uncheckedPassword).toString() === file.getFilePassword()){
    showFileInfo(fileId)
    toggleFilePassword(file.getFileId())
  }
  else
  {
    $("#file-passwd-error").innerHTML= "<label class='animate__animated animate__fadeIn'>Incorrect Password!</label> "
  }
}

function showFileInfo(fileId){
  let file = getFileById(fileId)
  console.log(file)
  $('#file-wallet').setAttribute("visible","hidden")
  $('#file-reviewer').setAttribute("visible","hidden")
  $('#file-feed').setAttribute("visible","hidden")
  $('#file-info').removeAttribute("visible")
  $('#file-info-icon').setAttribute("src","content/images/icons/"+file.getFileType()+".png");
  $("#file-info-name").value = file.getFileName()
  $("#file-info-id").value = file.getFileId()
  $wr("#file-info-name", file.getFileName())
  $("#review-selector").value = "comments"
  $wr("#type-of-feed","comments")
  $("#file-download").setAttribute("onclick","requestDownload('"+file.getFilePassword()+"')")
  console.log(file.getFileCategories())
  if(file.getFileCategories().length !== 0)
  {
    let b = ""
    for(x of file.getFileCategories()){
      b += "<div class='mg-5px'>"+x+"</div>"
    }
    $wr("#file-info-categories",b)
  }
  else
  {
    $wr("#file-info-categories","<label class='text-3 mgt-10px color-grey'>This file haven't got categories</label>")
  }
  if(file.getFileTags().length !== 0)
  {
    let b = ""
    for(x of file.getFileTags()){
      b += "<div class='bg-light-grey pd-5px bd-rad-5px mg-5px'>#"+x+"</div>"
    }
    $wr("#file-info-tags",b)
  }
  else
  {
    $wr("#file-info-tags","<label class='text-3 color-grey'>This file haven't got tags</label>")
  }
  getComments()
}





// -- RESEARCH FILES --
function setResearchType(id){
  let searchParam = $("#search-bar").value
  if(searchParam !== ""){
    let name = $("#search-by-name")
    let categories = $("#search-by-categories")
    let tags = $("#search-by-tags")
    name.removeAttribute("style")
    categories.removeAttribute("style")
    tags.removeAttribute("style")
    $("#"+id).setAttribute("style","background: whitesmoke;")
    $("#selected-research").value = $("#"+id).getAttribute("id").split("-")[2]
    searchFiles()
  }
}

function searchFiles(){
  let searchParam = $("#search-bar").value
  if(searchParam !== ""){
    let searchParams = []
    let searchBy = $("#selected-research").value
    searchParams.push(searchParam)
    if(searchBy === "categories")
      sendRequestSearchFile("POST",requestPathFileService + "categories", setFiles, user.getSessionId(), searchParams)
    else if(searchBy === "tags")
      sendRequestSearchFile("POST",requestPathFileService + "getByTags", setFiles, user.getSessionId(), searchParams)
    else
      sendRequestSearchFile("GET",requestPathFileService + "getByName/"+searchParam, setFiles, user.getSessionId())
  }
  else{
    $("#search-file").style = "border: solid red 2px; width: 18.7rem;"
  }


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





// -- DOWNLOAD FILES --
function requestDownload(password){
  fileId = $("#file-info-id").value;
  filePassword = password
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





// -- COMMENTS --
class Comment {
  constructor(id,reviewer,body,image,date,likes){
    this.id = id;
    this.reviewer = reviewer;
    this.body = body;
    this.image = image;
    this.date = date
    this.likes = likes;
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
  getReviewLikes(){
    return this.likes
  }
}

function toggleFileReviewer(){
  let fileReviewer = $("#file-reviewer");
  if(fileReviewer.getAttribute("visible") === "hidden")
  {
    fileReviewer.classList.add("animate__fadeInDown")
    fileReviewer.classList.remove("animate__fadeOutUp")
    fileReviewer.setAttribute("visible","")
  }
  else{
    fileReviewer.classList.remove("animate__fadeInDown")
    fileReviewer.classList.add("animate__fadeOutUp")
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

function getLikesByUsername(username){
  sendRequest("POST", requestPathReviewService + "likes/getArrayLikes", editLikeArray, {'username': username})
}

function checkUserLiked(comment){
  if(likeArray[comment] != null)
    return true
  else
    return false
}

function editLikeArray(data){
  if(data.response.result != undefined){
    likeArray = []
    for (x of data.response.result){
      likeArray[x.idComment] = x.idComment
    }
  }
  completePrintComments()
}

function printComments(data)
{
  if(data.length != 0){
    commentsArray = data;
    getLikesByUsername(user.getUsername())
  }
  else
  {
    $wr("#review-container","<label class='text-grey'>There aren't comments for this file</label>")
  }
}

function completePrintComments(){
  if(commentsArray.message === "Not found comments"){
    let s = "<div class='color-grey'>There aren't comments for this file</div>"
    $wr("#review-container",s)
  }
  else
  {
    let comments = new Array();
    for (x of commentsArray){
      comments.unshift( new Comment(x.id,x.owner,x.body,x.imgOwner,x.cratedAt.split("T")[0],x.likes))
    }
    let s = ""
    for (x of comments){
      s += "<div class='animate__animated animate__fadeIn'>" +
          "<div class='mgt-10px'><label class='bold'>"+ x.getReviewer() +"</label><label class='text-1 color-grey'> - "+x.getReviewDate()+ "</label></div>"+
          "<div class='mgt-5px'>"+ x.getBody() +"</div><div flex>"
      if(checkUserLiked(x.getId())){
        s += "<div id='like-container-"+x.getId()+"' class='translate-left-5px' flex><button onclick='removeLike(\""+x.getId()+"\",\""+user.getUsername()+"\")' class='transparent text-4 color-red'><ion-icon name='heart'></ion-icon></button><div id='like-number-"+
            x.getId()+"' class='text-2' style='transform: translateY(.25rem)'>"+x.getReviewLikes()+"</div></div>"
      }
      else
      {
        s += "<div id='like-container-"+x.getId()+"' class='translate-left-5px' flex><button onclick='addLike(\""+x.getId()+"\",\""+user.getUsername()+"\")' class='transparent text-4'><ion-icon name='heart'></ion-icon></button><div id='like-number-"+
            x.getId()+"' class='text-2' style='transform: translateY(.25rem)'>"+x.getReviewLikes()+"</div></div>"
      }
      if(x.getReviewer() === user.getUsername()){
        s += "<div><button onclick='removeComment(\""+x.getId()+"\")' class='transparent text-4 translate-left-5px color-grey--hov'><ion-icon name='trash'></ion-icon></button></div></div>"
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

function addLike(comment,username){
  sendRequestLike("POST", requestPathReviewService + "likes/addLike", checkLikeAdded, {'username': username, 'comment': comment}, comment, username)
}

function checkLikeAdded(resp,heart,username){
  if(resp.response.result === "success"){
    let newLikes = parseInt($('#like-number-'+heart).innerHTML)
    console.log(newLikes)
    newLikes = newLikes + 1
    $("#like-container-"+heart).innerHTML = "<button onclick='removeLike(\""+heart+"\",\""+username+"\")' class='transparent text-4 color-red'><ion-icon name='heart'></ion-icon></button><div id='like-number-"+heart+
        "' class='text-2' style='transform: translateY(.25rem)'>"+newLikes+"</div>"
  }
}

function removeLike(comment,username){
  sendRequestLike("POST", requestPathReviewService + "likes/removeLike", checkLikeRemoved, {'username': username, 'comment': comment}, comment, username)
}

function checkLikeRemoved(resp,heart,username){
  if(resp.response.result === "success"){
    let newLikes = parseInt($('#like-number-'+heart).innerHTML)
    console.log(newLikes)
    newLikes = newLikes - 1
    $("#like-container-"+heart).innerHTML = "<button onclick='addLike(\""+heart+"\",\""+username+"\")' class='transparent text-4'><ion-icon name='heart'></ion-icon></button><div id='like-number-"+heart+
        "' class='text-2' style='transform: translateY(.25rem)'>"+newLikes+"</div>"
  }
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
    console.log(id)
    sendRequest("POST",requestPathReviewService + "feedbacks/addFeedback", manageFeedbackResult ,{'owner':user.getUsername(), 'file':id, 'vote':vote})
  }
}

function manageFeedbackResult(data){
  toggleFileFeed()
  $("#review-selector").value = "feed"
  setRequestReview()
  getFeed()
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
    s += "<div flex><div class='col-3--md col-1--sm'><div class='color-grey'>Feedbacks Average</div><div flex>"
    for(var i=1; i<6; i++){
      if(i<=calculateFeedbacksAvg(feedbacks)){
        s += "<div class='color-royal-blue pd-5px'><ion-icon name='star'></ion-icon></div>"
      }
      else
        s += "<div class='pd-5px'><ion-icon name='star'></ion-icon></div>"
    }
    s += "</div><div class='mgt-20px w-70'>\n" +
        "\n" +
        "In this area, the average of the feedbacks (from 1 to 5 stars) released by the users of the platform to this file is shown.\n" +
        "While on the side, there is the graph that shows the approval rating of that file.</div></div>"
    s += "<div id='feed-chart-container' class='col-3--md col-1--sm'><div class='color-grey'>Statistics</div><div class='w-100'><canvas id='feed-chart'></canvas></div></div></div>"
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