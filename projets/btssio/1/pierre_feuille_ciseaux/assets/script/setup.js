const weakness = [1, 2, 0];
const emoji = ["👊", "🖐️", "✌️"];
let currentName = "";

let streaks = (localStorage.getItem("streaks")) ? JSON.parse(localStorage.getItem("streaks")) : {};
let streak = 0;
let nextAttack = null;

let easteregg = true;

function main() {
    $("#nav-logo").attr("src", "assets/image/logo.svg");
    showLobby();
}

function showLobby() {
    $('link[rel="icon"]').attr('href', 'assets/image/icon.ico');
    refreshScores();
    let html = `
        <button type="button" style="font-size:2vmax;" onclick="loadGame(true)" class="btn btn-primary">Jouer</button>
    `
    $("#container").html(html);
    $("title").text("ChiFouMi - Lobby");
}
function showLeaderboard() {
    $('link[rel="icon"]').attr('href', 'assets/image/icon.ico');
    refreshScores();
    let html = `<span class="leaderboard">`
    console.log(streaks);
    let items = Object.keys(streaks).map(function(key) { return [key, streaks[key]]; });
    items.sort((x, y) => y[1] - x[1]);
    $.each(items, function (index,value) {
        html+="["+index+"] "+value[0]+": "+value[1]+"<br>";
    });
    html+="</span>";
    $("#container").html(html);
    $("title").text("ChiFouMi - Scores");
}

function loadGame(askname) {
    refreshScores();
    if (!login()) return;
    nextAttack = botChoice();
    let html = `
    <div id="message-block">
        <h1><span id="message"> </span></h1>
    </div><br/>
    <div id="bot-block">
        <span id="player-choice"><span class="emoji">❔</span></span>
        <span class="emoji">💥</span>
        <span id="bot-choice"><span class="emoji">❔</span></span>
    </div><br/>
    <div id="player-block">            
        <button type="button" onclick="rock();" class="btn btn-primary action-input btn-lg"><span class="emoji">👊</span></button>
        <button type="button" onclick="paper();" class="btn btn-primary action-input btn-lg"><span class="emoji">🖐️</span></button>
        <button type="button" onclick="scissors();" class="btn btn-primary action-input btn-lg"><span class="emoji">✌️</span></button>
    </div><br/>
    <div>
        <span id="score" style="font-size:2vmax;">${streak}</span>
    </div><br/>
    `
    $("#container").html(html);
    $("title").text("ChiFouMi - Jeu");
}

function disableActions() {
    $("button.action-input").attr("disabled", true);
}

function enableActions() {
    $("button.action-input").attr("disabled", false);
}

function login() {
    if(currentName) return true;
    let _prompt = prompt("Quel est votre nom ?");
    if (!_prompt) return false;
    if (streaks[_prompt]) streak = streaks[_prompt];
    currentName = _prompt;
    setTimeout(()=>{$("a#login").on("click", function() { logout(); }); },10);
    $("a#login").text(currentName);
    return true;
}

function refreshScores() {
    streaks = (localStorage.getItem("streaks")) ? JSON.parse(localStorage.getItem("streaks")) : {};
}

function botChoice() {
    let botChoice = Math.floor(Math.random() * 3);
    if (easteregg) 
        $('link[rel="icon"]').attr('href', 'assets/image/'+botChoice+'.ico');
    return botChoice;
}

function setMessage(msg) {
    if (msg) $("#message").html(msg);
    else $("#message").html(" ");
}

function rock() {
    disableActions();
    attack(0);
}

function paper() {
    disableActions();
    attack(1);
}

function scissors() {
    disableActions();
    attack(2);
}

function attack(choice) {
    $("#player-choice").html("<span class='emoji'>"+emoji[choice]+"</span>");
    $("#bot-choice").html("<span class='emoji'>"+emoji[nextAttack]+"</span>");
    if (nextAttack == weakness[choice]) {
        setMessage("Perdu");
        streak = 0;
        streaks[currentName] = streak;
        localStorage.setItem("streaks", JSON.stringify(streaks));
    } else if (choice == weakness[nextAttack]) {
        setMessage("Gagné");
        streak++;
        streaks[currentName] = streak;
        localStorage.setItem("streaks", JSON.stringify(streaks));
    } else if (nextAttack == choice) {
        setMessage("Egalité");
    }
    $("#score").html(streak);
    setTimeout(function() {
        loadGame(false);
    }, 1000);
}


function reset() {
    loadGame(false);
}