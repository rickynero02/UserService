document.addEventListener("DOMContentLoaded", main());
function main(){

}



function toggleSmartNav(){
    let smMenu = $("#sm-links-menu");
    smMenu.classList.toggle("hidden");
}

window.addEventListener('resize', hideMenuOnResize)

function hideMenuOnResize(){
  if(window.innerWidth > 768){
    let smMenu = $("#sm-links-menu");
    smMenu.classList.add("hidden");
  }
}
