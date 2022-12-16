const customOptions = { protocol: "https", versionPath: "/api/v2/", cache: true, timeout: 5 * 1000, cacheImages: true }
const P = new Pokedex.Pokedex(customOptions);

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

function getPokemonCry(pokemon) {
    return `https://play.pokemonshowdown.com/audio/cries/${pokemon.replace("-","")}.mp3`
}

async function getPokemonIcon(pokemon) {
    let data = await P.getPokemonByName(pokemon);
    if (data.sprites.versions['generation-v']['black-white'].front_default == null) {
        return data.sprites.front_default
    } else {
        return data.sprites.versions['generation-v']['black-white'].front_default;
    }
}

function getGenerations() {
    return new Promise((resolve,reject)=>{
        P.getGenerationsList().then((response)=>{
            resolve(response);
        })
    });
}

function getRandomPokemonFromGeneration(generation) {
    let species = generation.pokemon_species;
    return species[species.length * Math.random() | 0];
}

function getGenerationData(name) {
    return new Promise((resolve,reject)=>{
        P.getGenerationByName(name).then((response)=>{
            resolve(response);
        })
    });
}

function getSpeciesData(dex) {
    return new Promise((resolve,reject)=>{
        P.getPokemonSpeciesByName(dex).then((response)=>{
            resolve(response);
        });
    });

}

function getPokemonData(dex) {
    return new Promise((resolve, reject)=>{        
        P.getPokemonByName(dex).then((response)=>{
            resolve(response);
        });
    });
}