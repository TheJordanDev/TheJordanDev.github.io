const customOptions = { protocol: "https", versionPath: "/api/v2/", cache: true, timeout: 5 * 1000, cacheImages: true }

const generations = [];
let languages = [];

const typesColors = {
    "normal":"#A8A77A",
    "fire":"#EE8130",
    "water":"#6390F0",
    "electric":"#F7D02C",
    "grass":"#7AC74C",
    "fighting":"#C22E28",
    "flying":"#A98FF3",
    "poison":"#A33EA1",
    "ground":"#E2BF65",
    "rock":"#B6A136",
    "bug":"#A6B91A",
    "ghost":"#735797",
    "steel":"#B7B7CE",
    "psychic":"#F95587",
    "ice":"#96D9D6",
    "dragon":"#6F35FC",
    "dark":"#705746",
    "fairy":"#D685AD",
    "unknown":"#FFFFFF",
    "shadow":"#230434",
}

const cries_blacklist = [899,900,901,902,903,904];

async function loadLanguages() {
    languages = languages.concat(await $.get("./assets/data/languages.json"));
}

async function loadPokemons() {
    let gens = await $.get("./assets/data/generations.json");
    for (const _gen of gens) {
        let gen = await $.get(`./assets/data/${_gen["name"]}.json`);
        generations.push(gen);
    }
}

function filterGeneration(filter) {
    return generations.filter(filter);
}

function filterLanguage(filter) {
    return languages.filter(filter);
}

function filterPokemon(filter) {
    return generations
        .map(_gen=>_gen["pokemons"])
        .flat()
        .filter(filter);
}

function getName(element) {
    let trads = element["names"].filter((v)=>{return v["language"]["name"] === language});
    if (trads.length == 0) {
        return element["names"].filter((v)=>{return v["language"]["name"] === "en"})[0]["name"];
    }
    return trads[0]["name"];
}

function getRandomStarter(generation) {
    let gen = filterGeneration((v,i)=>v["name"] == generation)[0];
    let starterOffset = (gen["id"] == 5) ? 1 : 0;
    return gen["pokemons"][rand(0,2)+starterOffset];
}

function getRandomForm(pokemon) {
    let index = rand(0,pokemon["forms"].length-1);
    return pokemon["forms"][index];
}
