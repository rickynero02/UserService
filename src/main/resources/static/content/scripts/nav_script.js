document.addEventListener("DOMContentLoaded", main());
function main(){

}



function toggleSmartNav(){
    let smMenu = document.querySelector("#sm-links-menu");
    smMenu.classList.toggle("hidden");
}

window.addEventListener('resize', hideMenuOnResize)

function hideMenuOnResize(){
  if(window.innerWidth > 768){
    let smMenu = document.querySelector("#sm-links-menu");
    smMenu.classList.add("hidden");
  }
}
