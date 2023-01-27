// ************* dark-light mode ***************//
var colorPage = document.getElementById('color-page');
var darkMode = document.getElementById('dark-mode');
var lightMode = document.getElementById('light-mode');
var lightLogo = document.getElementById('light-logo');
var darkLogo = document.getElementById('dark-logo');
var trade_input = document.getElementById('trade-code');

colorPage.addEventListener('click', function(){
   lightMode.classList.toggle('show');
   darkMode.classList.toggle('hidden');
   lightLogo.classList.toggle('hidden');
   darkLogo.classList.toggle('show');
   if(trade_input != undefined)
      trade_input.classList.toggle('input_trade');
   document.body.classList.toggle('light');

 });


// ************* mobile menu ***************//

let closebtn = document.getElementById('close-btn-nav');
let openbtn = document.getElementById('open-btn-nav');
let mobileMenu = document.getElementById('nav-menu');


bars.addEventListener('click', function(){
  mobileMenu.classList.toggle('show');
  closebtn.classList.toggle('show');
  openbtn.classList.toggle('hidden');
});



// ************* modal ***************//

var btn = document.querySelectorAll(".modal-button");

var modals = document.querySelectorAll('.modal');

var close_btn = document.getElementsByClassName("close-btn");

var cancel_btn = document.getElementsByClassName("cancel-btn");

var body = document.body;

for (var i = 0; i < btn.length; i++) {
 btn[i].onclick = function(e) {
    e.preventDefault();
    var parent = e.target.closest('.modal-button')
    var modal = document.querySelector(parent.getAttribute("data-target"));
    modal.style.display = "block";
    body.classList.add("open-modal");
 }
}

for (var i = 0; i < close_btn.length; i++) {
 close_btn[i].onclick = function() {
    for (var index in modals) {
      if (typeof modals[index].style !== 'undefined'){
         modals[index].style.display = "none";  
         body.classList.remove("open-modal");
      }   
    }
 }
}

for (var i = 0; i < cancel_btn.length; i++) {
   cancel_btn[i].onclick = function() {
      for (var index in modals) {
        if (typeof modals[index].style !== 'undefined'){
           modals[index].style.display = "none";  
           document.getElementById("ether-address").value = '';
           body.classList.remove("open-modal");
        }   
      }
   }
  }

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
     for (var index in modals) {
      if (typeof modals[index].style !== 'undefined'){
         modals[index].style.display = "none";   
         body.classList.remove("open-modal");
      } 
     }
    }
}


