const difficulties = [
    {numbers:3,tries:20,timer:1000*60},
    {numbers:5,tries:3,timer:1000*40},
    {numbers:7,tries:1,timer:1000*20}
]

let numbers = []
let colorHelp = false;

let time = 0;
let tries = 0;

let currentDifficulty;

let ended = false;

let endInterval;
//===============================================//

function msToTime(duration) {
    let micro = Math.floor(duration%1000),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    micro = (micro < 100) ? (micro < 10) ? "00" + micro : "0"+micro : micro;

  
    return hours + ":" + minutes + ":" + seconds + "."+micro;
}

function digitChoose(e) {
    e.target.style.color = "black";
    if (e.target.value > 9) {
        e.target.value = 0;
    } else if (e.target.value < 0) {
        e.target.value = 9;
    }
}

function difficultyChoose(e) {
    e.preventDefault();
    colorHelp = e.target[2].checked;
    setup(e.target[0].value);
}

function defuse(e) {
    e.preventDefault();
    if (ended) {
        onload();
        return;
    }
    if (tries == 0) {
        loose();
    } else {
        let won = true;
        for (let index = 0; index < numbers.length; index++) {
            let target = numbers[index];
            let number = e.target[index].value;
            if (target > number) {
                if (colorHelp) e.target[index].style.color = "red";
                won = false;
            } else if (target < number) {
                if (colorHelp) e.target[index].style.color = "blue";
                won = false;
            } else {
                if (colorHelp) e.target[index].style.color = "green";
            }
        }
        if (won) win();
    }
    tries -= 1;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}



function win() {
    clearInterval(endInterval);
    document.getElementsByTagName("body")[0].style.backgroundColor = "green";
    setTimeout(()=>{registerTime(); ended = true;
    },100);
}

function registerTime() {
    let name = prompt("Quel est ton pseudo ?","");
    if (name === "") {
        registerTime();
    } else {
        let currentLeaderboard;
        if (localStorage.getItem("leaderboard") === null) currentLeaderboard = JSON.parse("[]");
        else currentLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
        currentLeaderboard.push({name:name,time:time,difficulty:currentDifficulty});
        localStorage.setItem("leaderboard",JSON.stringify(currentLeaderboard));
    }
}

function loose() {
    document.getElementsByTagName("body")[0].style.backgroundColor = "red";
    clearInterval(endInterval)
    setTimeout(()=>{alert("BOOM"); 
    ended = true;},100);
}

function timer() {
    let timer = document.getElementById("timer");
    time -= 4;
    timer.innerHTML = msToTime(time);
    if (time == 0) loose();
}

function br() {
    return document.createElement("br");
}

//===============================================//
function onload() {
    document.getElementsByTagName("body")[0].style.backgroundColor = "white";
    ended = false;
    const content = document.getElementById("contenu");
    content.innerHTML = "";
    let startForm = document.createElement("form");
    startForm.addEventListener("submit",difficultyChoose);
    let diffChooser = document.createElement("select");
    diffChooser.style.fontSize = "5vw";
    diffChooser.setAttribute("id", "difficulty");
    for (let index = 1; index <= difficulties.length; index++) {
        let option = document.createElement("option");
        option.setAttribute("value",index);
        option.innerHTML = "Difficulté n°"+index;
        diffChooser.appendChild(option);
    };
    let sumbitBtn = document.createElement("button");
    sumbitBtn.innerHTML = "OK";
    sumbitBtn.style.fontSize = "5vw";
    let colorHelpCheckbox = document.createElement("input");
    colorHelpCheckbox.type = "checkbox";
    colorHelpCheckbox.style = "width: 5vw; height: 5vw;";
    let lead = document.createElement("button");
    lead.style.fontSize = "5vw";
    lead.addEventListener("click",displayLeaderBoard);
    lead.innerHTML = "Leaderboard"; 
    startForm.appendChild(diffChooser);
    startForm.appendChild(sumbitBtn);
    startForm.appendChild(colorHelpCheckbox);
    content.appendChild(startForm);
    contenu.appendChild(lead);
}
//===============================================//
function setup(diff=1) {
	currentDifficulty = diff;
    if (diff > difficulties.length+1 || diff < 1) {
        alert("Veuillez choisir une difficulté.")
        onload();
        return;
    }
    
    let contenu = document.getElementById("contenu");
    diff = diff-1
    let difficulty = difficulties[diff]
    time = difficulty.timer;
    tries = difficulty.tries;
    numbers = new Array(difficulty.numbers);
    for (i=0; i<numbers.length; i++) {
        numbers[i] = getRandomInt(9);
    }

    contenu.innerHTML = "";
    let timerH1 = document.createElement("span");
    timerH1.innerHTML = "TIMER";
    timerH1.setAttribute("id","timer");
    timerH1.style.fontSize = "5vw";
    let testForm = document.createElement("form");
    testForm.addEventListener("submit", defuse);
    for (let i = 0; i < difficulty.numbers; i++) {
        let numberInput = document.createElement("input");
        numberInput.addEventListener("change",digitChoose);
        numberInput.setAttribute("type","number");
        numberInput.setAttribute("value",0);
        numberInput.setAttribute("id",i);
        numberInput.style = "width:5vw; height:4vw; font-size:5vw;";
        testForm.appendChild(numberInput);
    }
    let defuseBtn = document.createElement("button");
    defuseBtn.style.fontSize = "5vw";
    defuseBtn.setAttribute("id","defuse");
    defuseBtn.innerHTML = "Désamorcer"; 

    testForm.appendChild(br())
    testForm.appendChild(defuseBtn);
    contenu.appendChild(timerH1);
    contenu.appendChild(testForm);
    endInterval = setInterval(timer,1);
}

function displayLeaderBoard() {
    let contenu = document.getElementById("contenu");
    contenu.innerHTML = "";
    let retour = document.createElement("button");
    retour.addEventListener("click",onload);
    retour.innerHTML = "Retour";
    retour.style.fontSize = "2vw";
    contenu.appendChild(retour);
    contenu.appendChild(br());
    let currentLeaderboard;
    if (localStorage.getItem("leaderboard") === null) currentLeaderboard = JSON.parse("[]");
    else currentLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    currentLeaderboard.sort( function( a , b){
        if(a.time > b.time) return 1;
        if(a.time < b.time) return -1;
        return 0;
    });
    for (let index = 0; index < currentLeaderboard.length; index++) {
        const element = currentLeaderboard[index];
        let time = document.createElement("span");
        time.style.fontSize = "2vw";
        time.innerHTML = "["+element.difficulty+"] "+element.name+": "+msToTime(element.time)+"<br>"
        contenu.appendChild(time);
    }
}