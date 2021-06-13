document.addEventListener("DOMContentLoaded",main)

let user;
let colorDictionary = {"0": "#00b7ff", "1": "#ff7700", "2": "#9500ff", "3": "#ffcc00", "4": "#fb7aff", "5":"#bdbdbd", "6":"#04db04", "7":"#d90804", "8": "#00e6ac", "9":"#525252", "10":"#ded4ab", "11":"#001be8", "12":"#57242e"}
let files = new Array();
let likeArray;
let commentsArray;

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
  constructor(name, surname, color, role, username, email, sessionId) {
    this.name = name;
    this.surname = surname;
    this.color = color
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
    user = new User(data.response.result.name,data.response.result.surname,data.response.result.color,data.response.result.role,data.response.result.username,data.response.result.email,data.response.sessionId)
    var userData = new Vue({
      el: '#user-data',
      data: {
        name: user.getName(),
        surname: user.getSurname()
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
    getAllFiles()
}

function setWalletColor(){
  setBgBody()
  setBgFromColorUI("md-nav-icon");
  setBgFromColorUI("uploader-icon");
  setBgFromColorUI("bin-icon");
  setBgFromColorUI("color-changer");
  setBgFromColorUI("user-image");
  setBgFromColorUI("user-image-in-details");
}

function showFileWallet(){
  $('#file-info').setAttribute("visible","hidden")
  $('#file-wallet').setAttribute("visible","")
  $('#file-bin').setAttribute("visible","hidden")
  $('#file-uploader').setAttribute("visible","hidden")
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
class File{
  constructor(file){
    this.file = file
  }

  getFileId(){
    return this.file.id;
  }
  getFileName(){
    return this.file.name;
  }
  getFileType(){
    let splittedFileName = this.file.name.split(".")
    return splittedFileName[splittedFileName.length-1]
  }
  getFileOwner(){
    return this.file.owner;
  }
  getFileState(){
    return this.file.private;
  }
  getFilePassword(){
    return this.file.password
  }
  getFileCategories(){
    let splittedFileCategories = new Array()
    for( x of this.file.categories){
      splittedFileCategories.push(x)
    }
    return splittedFileCategories
  }
  getFileTags(){
    let splittedFileTags = new Array()
    for( x of this.file.tags){
      splittedFileTags.push(x)
    }
    return splittedFileTags
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
  if(resp.response.result.length === 0)
  {
    $wr("#file-visualizer", "Your wallet is empty!")
    $("#file-visualizer-header").classList.add("hidden")
  }
  else
  {
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
      s += "                     <button onclick=\"showFileInfo('"+files[0].getFileId()+"')\" class='transparent w-80' style=\"max-width: 80%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\" flex>" +
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
}

function showFileInfo(fileId){
  let file = getFileById(fileId)
  $('#file-wallet').setAttribute("visible","hidden")
  $('#file-uploader').setAttribute("visible","hidden")
  $('#file-bin').setAttribute("visible","hidden")
  $('#file-info').removeAttribute("visible")
  $('#file-info-icon').setAttribute("src","content/images/icons/"+file.getFileType()+".png");
  $("#file-info-name").value = file.getFileName()
  $wr("#file-info-name", file.getFileName())
  $("#file-info-id").value = file.getFileId()
  $("#review-selector").value = "comments"
  $wr("#type-of-feed","comments")
  $("#categories-selector-hidden").innerHTML = ""
  $("#categories-selector-display").innerHTML = "<div class='bd-rad-5px bg-light-grey mg-5px text-1' style='padding: 3px'>No Categories Selected</div>"
  $("#tag-selector-hidden").innerHTML = ""
  $("#tag-selector-display").innerHTML = "<div class='bd-rad-5px bg-light-grey mg-5px text-1' style='padding: 3px'>No Tags Added</div>"
  $("#file-download").setAttribute("onclick","requestDownload('"+file.getFilePassword()+"')")
  if(file.getFileCategories().length !== 0)
  {
    let b = ""
    for(x of file.getFileCategories()){
      b += "<div class='mg-5px'>"+x+"</div>"
    }
    $wr("#file-info-categories",b+"</ol>")
  }
  if(file.getFileTags().length !== 0)
  {
    let b = ""
    for(x of file.getFileTags()){
      b += "<div class='bg-light-grey pd-5px bd-rad-5px mg-5px'>#"+x+"</div>"
    }
    $wr("#file-info-tags",b)
  }
  getComments()
}




// -- UPLOAD FILES--
function toggleFileUploader(){
  requestCategories()
  let fileUploader = $("#file-uploader")
  if(fileUploader.getAttribute("visible") === "hidden"){
    $("#file-uploader").classList.add("animate__fadeInDown")
    $("#file-uploader").classList.remove("animate__fadeOutUp")
    $("#file-uploader").setAttribute("visible","")
    $('#file-bin').setAttribute("visible","hidden")
    $("#state-selector").value = "true"
    $("#tag-selector-hidden").innerHTML=""
    $("#tag-selector-display").innerHTML="<div class='bd-rad-5px bg-light-grey mg-5px text-1' style='padding: 3px'>No Tags Added</div>"
    $("#categories-selector-hidden").innerHTML=""
    $("#categories-selector-display").innerHTML="<div class='bd-rad-5px bg-light-grey mg-5px text-1' style='padding: 3px'>No Categories Selected</div>"
    $("#file-passwd").setAttribute("disabled","")
  }
  else{
    $("#file-uploader").classList.remove("animate__fadeInDown")
    $("#file-uploader").classList.add("animate__fadeOutUp")
    setTimeout(function (){$("#file-uploader").setAttribute("visible","hidden")},500)
  }
}

function requestCategories(){
  sendRequest("GET", requestPathCategoriesService, completeCategories)
}

function completeCategories(resp){
  let categories = $("#category-selector")
  let s = ""
  s += "<option value=''>Select categories...</option>"
    for (x of resp){
      s += "<option value='"+x.name+"' title='"+x.description+"'>"+x.name+"</option>"
    }
  categories.innerHTML = s
}

function upload(){
  let file = document.getElementById("files-uploader").files[0];
  let formData = new FormData();
  formData.append("file", file);
  sendRequestFile("POST", requestPathFileService + "upload", updateFileInfo, user.getSessionId(), formData);
  let str = "<div class=\"spinner color-white\" style='width: 1rem; height: 1rem;'></div>"
  $wr("#up-button", str)
}

function toggleFileState(){
  let state = $("#state-selector").value
  console.log("God"+state)
  if (state === "true"){
    $("#file-passwd").setAttribute("disabled","")
  }
  else
  {
    $("#file-passwd").removeAttribute("disabled")
  }
}

function addCategories(){
  let s = $("#categories-selector-hidden").innerHTML
  let nt = $("#categories-selector-display").innerHTML
  let error = true
  let newCat = $("#category-selector").value
  if(s === "" && newCat != "")
  {
    s += newCat;
    nt = "";
    error = false
  }
  else if(newCat != "")
  {
    s += ";" + newCat;
    error = false
  }

  if(error === false){
      nt += "<div class='bd-rad-5px bg-light-grey mg-5px text-1 animate__animated animate__fadeIn' style='padding: 3px'>"+newCat+"</div>"
      $("#categories-selector-hidden").innerHTML = s
      $("#categories-selector-display").innerHTML = nt
  }
}

function addTags(){
  let s = $("#tag-selector-hidden").innerHTML
  let nt = $("#tag-selector-display").innerHTML
  let error = true
  console.log(nt)
  let newTag = $("#tag-selector").value
  if(s === "" && newTag != "")
  {
    s += newTag;
    nt = "";
    error = false

  }
  else if(newTag != "")
  {
    s += ";" + newTag;
    error = false
  }

  if(error === false){
    nt += "<div class='bd-rad-5px bg-light-grey mg-5px text-1 animate__animated animate__fadeIn' style='padding: 3px'>#"+newTag+"</div>"
    $("#tag-selector-hidden").innerHTML = s
    $("#tag-selector-display").innerHTML = nt
  }
}

function updateFileInfo(resp){
  console.log(resp)
    var nuovoFile = resp.response.result[0];
    nuovoFile.private = $("#state-selector").value
    if($("#file-passwd").value != "")
    {
      nuovoFile.password = CryptoJS.SHA512($("#file-passwd").value).toString()
    }
    else
    {
      nuovoFile.password = undefined
    }
    let fileTags = new Array()
    fileTags = $("#tag-selector-hidden").innerHTML.split(";")
    nuovoFile.tags = fileTags;
    let fileCat = new Array()
    fileCat = $("#categories-selector-hidden").innerHTML.split(";")
    nuovoFile.categories = fileCat;
    sendRequestUpdateFile("PUT", requestPathFileService + "updateInfo", manageUpdate , user.getSessionId(), nuovoFile);
}

function manageUpdate(resp){
  toggleFileUploader()
  $wr("#up-button", "Upload")
  getAllFiles()
}





// -- DOWNLOAD FILES --
function requestDownload(password){
  fileId = $("#file-info-id").value;
  filePassword = password;
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
  let fileBin = $("#file-bin");
  if(fileBin.getAttribute("visible") === "hidden"){
    $('#file-uploader').setAttribute("visible","hidden")
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
  toggleFileBin()
  getAllFiles()
  showFileWallet()
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
  constructor(id,reviewer,body,image,date,likes){
    this.id = id;
    this.reviewer = reviewer;
    this.body = body;
    this.image = image;
    this.date = date
    this.likes = likes
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
  likeArray = []
  for (x of data.response.result){
    likeArray[x.idComment] = x.idComment
  }
  completePrintComments()
}

function printComments(data)
{
  commentsArray = data;
  getLikesByUsername(user.getUsername())
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
    s += "</div><div class='mgt-20px w-70'>This index shows the average of votes (from 1 to 5 stars) that users of the platform have assigned to this file </div></div>"
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