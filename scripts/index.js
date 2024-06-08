

import { startSearch } from '/scripts/search.js'

let counterClick = 0;
const startButtomLm = document.querySelector('.increase');
const resetButtomLm = document.querySelector('.reset');
const counterTextLm = document.querySelector('.js-counter');
const tabContainerLm = document.querySelector('.tab-container');
const navButtonLm = document.querySelector('.menu-button');
const cancelNavButtonLm = document.querySelector('.cancel-menu');
const navBarLm = document.querySelector('.menu-div');

const historyList = [];


startSearch();


function clear(){
    counterTextLm.innerHTML = '0';
    historyList.length = 0;
}
function increase(){
    counterClick += 1;
    counterTextLm.innerHTML = counterClick;

    const historyObj = {
        serial: counterClick - 1,
        counter: counterClick,
        timestamp: Date.now()
    }


    historyList.push(historyObj);
    tabContainerLm.innerHTML += `
    <div class="row-title">

    <div class="list-text s-n">${historyObj.serial}</div>
    <div class="list-text c-v">${historyObj.counter}</div>
    <div class="list-text t-s">${historyObj.timestamp}</div>

    </div>
    `
    //    listTextLm.innerHTML = historyList;

}

function showNav(){
    navBarLm.classList.add('show-nav');

}
function hideNav(){
    navBarLm.classList.remove('show-nav');
}


//startButtomLm.addEventListener('click', ()=> {
//    increase();
//});
//
//resetButtomLm.addEventListener('click', ()=> {
//    clear();
//});

navButtonLm.addEventListener('click',()=> {
    showNav();
});

cancelNavButtonLm.addEventListener('click',()=> {
    hideNav();
});

