let currentGame;

function init() {
    (async ()=>{
        await loadLanguages();
        await loadPokemons();
        await setup();
    })();
}

async function setup() {
    let languageSelector = $(`<select id="language_selector"></select>`)
    for (let lang_index = 0; lang_index < languages.length; lang_index++) {
        let _language = languages[lang_index];
        languageSelector.append($(`<option ${(language == _language["name"]) ? "selected" : ""} value="${_language["name"]}"><span language-element="language" language="${_language["name"]}">${getName(_language)}</span></option>`))
    }
    languageSelector.change((e)=>{
        updateLanguages(languageSelector.val());
    });
    header.append(languageSelector);

    root.append($('<form id="start_game_form">'));
    let form = $('form#start_game_form');
    form.submit((e)=>startGame(e));
    let formContent = `
    <select id="game_type" class="mx-auto w-25 form-select light">
        <option value="0">Cris</option>
        <option value="1">Silhouettes</option>
        <option disabled>...</option>
    </select><br>
    `;
    for (let gen_index = 0; gen_index < generations.length; gen_index++) {
        let generation = generations[gen_index];
        let starter = getRandomStarter(generation["name"]);
        formContent += `
            <input type="checkbox" value="${generation.name}" class="btn-check" id="btn-${generation.name}" autocomplete="off">
            <label style="min-width: 19%; text-align:left; padding-left:6px; margin-bottom: 1%;" class="btn btn-outline-primary" for="btn-${generation.name}"><img class="pixelart pokemon-btn img-fluid" style="margin:-15px" width="100px" src="${starter["forms"][0]["sprite"]}"/><span language-element="generation" generation="${generation.name}">${getName(generation)}</span></label>
        `;
    }
    formContent += `<br>
    <button type="submit" class="btn btn-primary pokemon-btn" style="min-width: 19%; text-align:left; margin:2%; padding-left:6px">
        <img class="pixelart pokemon-btn img-fluid" width="100px" src="https://play.pokemonshowdown.com/sprites/gen5/substitute.png"/><span language-element="start">${getName(startMessage)}</span>
    </button>
    `;
    form.append($(formContent));
}

async function startGame(e) {
    e.preventDefault();
    let inputs = $("#start_game_form :input");
    let gameChoice = inputs[0].value;
    let checkedGenerations = [];
    for (let index = 1; index < inputs.length-1; index++) {
        const checkbox = inputs[index];
        if (checkbox.checked) checkedGenerations.push(checkbox.value);
    }
    if (checkedGenerations.length == 0) {
        alert("Choisissez au moins une génération !");
        return;
    }
    switch (gameChoice) {
        case "0":
            currentGame = new CriesGame(checkedGenerations);
            break;
        case "1":
            currentGame = new SilhouetteGame(checkedGenerations);
            break;
        default:
            alert("Mode de jeu incorrecte !");
            return;
    }
    root.html(" ");
    await currentGame.init();
}