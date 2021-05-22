document.addEventListener("DOMContentLoaded",main)

function main(){
  getUserInfo();
  initializeModeWithIconChange("dark-mode");
  setBgBody()
  setBgFromColorUI("md-nav-icon");
}

function getUserInfo(){
  var userInfo = new Vue({
    el: '#userDiv',
    data: {
      title: 'User Informations'
    }
  })
}
