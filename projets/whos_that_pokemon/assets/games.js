class Game {

    constructor(name, generations) {
        this.name = name;
        this.generations = generations;
        this.alreadyShown = [];
        this.currentPokemons = [];
        this.pokemons = [];
        this.history = {};
        this.round = 1;
    }

    async init() {
        console.log(new Date().toLocaleString())
        await this.setup();
        console.log(new Date().toLocaleString())

        await this.build();
    }

    async setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    }

    async setup() {}

    async build() {}

    async roll() {}

    async draw() {}

    async nextRound() {
        this.round++;
        await this.roll();
    }

}

class CriesGame extends Game {

    constructor(generations) {
        super("Cris", generations);
        this.listening = null;
    }

    async setup() {
        for (const generationCode of this.generations) {
            let generationData = await getGenerationData(generationCode);
            let generationSpecies = generationData.pokemon_species;
            for (const genSpecie of generationSpecies){
                let speciesData = await getSpeciesData(genSpecie.name);
                let specieVarieties = speciesData.varieties;
                let pokemonSpecie = specieVarieties[0].pokemon.name;
                if (cries_blacklist.includes(speciesData.id)) continue;
                let pokemonData = await getPokemonData(pokemonSpecie);
                let cry = getPokemonCry(speciesData.name);
                let sprite = await getPokemonIcon(pokemonSpecie);
                let types = [];
                for (const type of pokemonData.types) {
                    let typeName = type.type.name;
                    types.push({type:typeName,color:typesColors[typeName]});
                }
                this.pokemons.push({types:types,name:speciesData.names[4].name,cry:cry,sprite:sprite});
            }
        }
    }

    async build() {
        root.append($(`
        <button class="btn btn-primary" id="play_cry"><i class="fa-solid fa-play fa-4x"></i></button><br><br>
        <audio id="pokemon_cry">
        `));
        this.roll();
        $(`button#play_cry`).click(()=>{toggleAudio("audio#pokemon_cry")});
        
        for (let index = 0; index < this.currentPokemons.length; index++) {
            const pokemon = this.currentPokemons[index];
            let buttonStyle = (pokemon.types.length == 1) ? `background: ${pokemon.types[0].color} !important` : `  background: linear-gradient( to right, ${pokemon.types[0].color} 0%, ${pokemon.types[0].color} 50%, ${pokemon.types[1].color} 50%, ${pokemon.types[1].color} 100% ) !important`
            let input = $(`<input type="button" value="${index}" id="btn-choice-${index}" class="btn-check" autocomplete="off">`);
            input.click(()=>this.guess(index));
            let label = $(`<label id="btn-label-${index}" style=" margin-right: 5px; margin-left: 5px;min-width: 19%; text-align:left; padding-left:6px; margin-bottom: 1%; ${buttonStyle};" class="btn" for="btn-choice-${index}"><img class="pixelart pokemon-btn img-fluid" id="btn-img-${index}"width="100px" src="${pokemon.sprite}"/><span id="btn-span-${index}">${pokemon.name}</span></label>`);
            root.append(input);
            root.append(label);
        }
    }

    async roll() {
        let pokemonsLeft = getArrayWithoutX(this.pokemons,this.alreadyShown);
        if (pokemonsLeft.length < 4) {
            alert("GG Tu a fini");
            location.reload();
            return;
        }
        this.currentPokemons = getMultipleRandom(pokemonsLeft,4);
        let chosen = this.currentPokemons[rand(0,this.currentPokemons.length-1)];
        this.listening = chosen;
        this.alreadyShown.push(chosen);
        this.draw();
    }

    async draw(){
        $(`audio#pokemon_cry`).attr("src",this.listening.cry);
        for (let index = 0; index < this.currentPokemons.length; index++) {
            const pokemon = this.currentPokemons[index];
            let buttonStyle = (pokemon.types.length == 1) ? `${pokemon.types[0].color}` : `linear-gradient( to right, ${pokemon.types[0].color} 0%, ${pokemon.types[0].color} 50%, ${pokemon.types[1].color} 50%, ${pokemon.types[1].color} 100% )`
            let label = $(`label#btn-label-${index}`);
            label.css("background", buttonStyle);
            let span = $(`span#btn-span-${index}`);
            span.text(pokemon.name);
            let img = $(`img#btn-img-${index}`);
            img.attr("src",pokemon.sprite);
        }
    }

    async guess(e) {
        let currentState = {
            pokemon:this.listening,
            guessed:this.currentPokemons[e],
            result: (this.listening.name.toLowerCase() === this.currentPokemons[e].name.toLowerCase())
        };
        console.log(currentState);
        this.history[this.round] = currentState;
        this.nextRound();
    }

}


class SilhouetteGame extends Game {

    constructor(generations) {
        super("Silhouette", generations);
        this.show = false;
        this.shownPokemon = null;
        this.sprite = null;
        this.canvas = null;
        this.ctx = null;
    }

    async setup() {
        let loadings = []
        for (const generationCode of this.generations) {
            loadings.push(this.loadGen(generationCode));
        }
        await Promise.all(loadings);
    }

    async loadGen(generationCode) {
        let generationData = await getGenerationData(generationCode);
        let generationSpecies = generationData.pokemon_species;
        for (const genSpecie of generationSpecies) {
            let speciesData = await getSpeciesData(genSpecie.name);
            let specieVarieties = speciesData.varieties;
            for (const specieVarietie of specieVarieties) {
                let pokemonData = await getPokemonData(specieVarietie.pokemon.name);
                let sprite = await getPokemonIcon(pokemonData.name);
                let types = [];
                for (const type of pokemonData.types) {
                    let typeName = type.type.name;
                    types.push({type:typeName,color:typesColors[typeName]});
                }
                let data = {id:pokemonData.name,name:speciesData.names[4].name,sprite:sprite};
                this.pokemons.push(data);
            }
        }
    }

    async build() {
        root.append($(`<canvas class="pixelart" id="game_canvas"width="300px" height="300px">`));
        root.append($(`
        <form id="guess_form">
            <input id="pokemon_guess" list="pokemon_names" type="text" autocomplete="off" placeholder="Nom">
            <datalist id="pokemon_names">
            </datalist>
        </form>
        `));
        let pokemonNameDatalist = $('datalist#pokemon_names');
        let nameList = []
        for (const _pkmn of this.pokemons) {
            if (!nameList.includes(_pkmn.name)) nameList.push(_pkmn.name);
        }
        for (const _pkmn of nameList) {
            pokemonNameDatalist.append(`<option value="${_pkmn}">`);
        }
        $(`form#guess_form`).submit((e)=>{this.guess(e)});
        $(`canvas#game_canvas`).click(()=>{this.show = !this.show; this.draw()});
        this.setCanvas(document.getElementById("game_canvas"));
        this.roll();
    }

    async roll() {
        let pokemonsLeft = getArrayWithoutX(this.pokemons,this.alreadyShown);
        if (pokemonsLeft.length == 0) {
            alert("GG Tu a fini");
            location.reload();
            return;
        }
        this.shownPokemon = pokemonsLeft[rand(0,pokemonsLeft.length-1)];
        this.alreadyShown.push(this.shownPokemon);
        this.sprite = new Image(200, 200);
        this.sprite.crossOrigin = "anonymous";
        this.sprite.src = this.shownPokemon.sprite;
        this.sprite.addEventListener("load", (e)=>{this.draw()});
    }

    async guess(e) {
        e.preventDefault();
        let guessInput = $(`input#pokemon_guess`);
        let guess = guessInput.val();
        guessInput.val("");
        let currentState = {
            pokemon:this.shownPokemon,
            guessed:guess,
            result: (this.shownPokemon.name.toLowerCase() === guess.toLowerCase())
        };
        console.log(currentState);
        this.history[this.round] = currentState;
        this.nextRound();
    }

    async draw() {
        this.canvas.width = this.canvas.width;
        this.ctx.drawImage(this.sprite, 150 - this.sprite.width / 2, 150 - this.sprite.height / 2, 200, 200);
        if (this.show) {
            this.ctx.textAlign = 'center';
            this.ctx.font = '50px Poppins';
            //this.ctx.fillText(this.shownPokemon.name, 150, 300,300);
        } else {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              data[i] = 0;
              data[i + 1] = 0;
              data[i + 2] = 0;
            }
            this.ctx.putImageData(imageData, 0, 0);
        }
    }
}