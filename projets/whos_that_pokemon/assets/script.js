let currentGame;

function init() {
    (async ()=>{setup()})();
}

async function setup() {
    root.append($('<form id="start_game_form">'));
    let form = $('form#start_game_form');
    form.submit((e)=>startGame(e));
    form.append($(`
    <select id="game_type" class="mx-auto w-25 form-select light">
        <option value="0">Cris</option>
        <option value="1">Silhouettes</option>
        <option disabled>...</option>
    </select><br>
    `));
    let generations = await getGenerations();
    for (let gen_index = 0; gen_index < generations.results.length; gen_index++) {
        const _generation = generations.results[gen_index];
        let generation = await getGenerationData(_generation.name);
        let starter = rand(0,2);
        let offset = (gen_index == 4) ? 1 : 0;
        form.append($(`
            <input type="checkbox" value="${generation.name}" class="btn-check" id="btn-${generation.name}" autocomplete="off">
            <label style="min-width: 19%; text-align:left; padding-left:6px; margin-bottom: 1%;" class="btn btn-outline-primary" for="btn-${generation.name}"><img class="pixelart pokemon-btn img-fluid" width="100px" src="${ await getPokemonIcon(generation.pokemon_species[starter+offset].name)}"/>${generation.names[2].name}</label>
        `));
    }
    form.append($(`<br>
    <button type="submit" class="btn btn-primary pokemon-btn" style="min-width: 19%; text-align:left; margin:2%; padding-left:6px">
        <img class="pixelart pokemon-btn img-fluid" width="100px" src="https://play.pokemonshowdown.com/sprites/gen5/substitute.png"/>Commencer !
    </button>
    `));
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