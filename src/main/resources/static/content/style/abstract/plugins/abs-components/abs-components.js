document.addEventListener('DOMContentLoaded', main)

function main(){
  console.log("[ABS-COMPONENTS-LOG]: All components loaded succesfully")
  setBars()
  setBadges();
}

//Progress Bars
function setBars(){
  var x = document.getElementsByTagName("abs-progress-bar")
  for(var i=0; i<x.length; i++)
  {
      text = x[i].getAttribute("abs-pb-value");
        if(text == null){
          text = x[i].getAttribute("abs-progress-bar-value");
        }
        if(text == null){
          console.error('[ABS-COMPONENTS-ERROR]: Could not find a value for the progress bar')
        }
      x[i].innerHTML = text
  }
}

function setBarValue(id,value){
  var pb = document.getElementById(id,value)
  pb.setAttribute("abs-pb-value",value)
  setBars()
}

function setBadges(){
  let badges = document.querySelectorAll(".badge")
      for(let i=0;i<badges.length;i++){
        badges[i].innerHTML = "<label>"+badges[i].getAttribute("abs-value")+"</label>";
    }
}
function setBadgeValue(badgeId,value){
  document.querySelector("#"+badgeId).setAttribute("abs-value",value);
  setBadges;
}
