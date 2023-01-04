class Game {

    constructor(name, generations) {
        this.name = name;
        this.generations = generations;
        this.alreadyShown = [];
        this.currentPokemons = [];
        this.pokemons = [];
        this.history = [];
        this.round = 0;
        this.maxRounds = 50;
    }

    async init() {
        await this.setup();
        await this.build();
    }

    async setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    }

    async setup() {
        let btn = $(`<button id="show-history" class="float-end">Historique</button>`);
        btn.click( async ()=>{
            await this.showHistorique();
        })
        header.append(btn);
    }

    async build() {}

    async roll() {}

    async draw() {}

    async showHistorique() {
        let modal = $(`
        <div class="modal fade" id="historique" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Haha
                    </div>
                </div>
            </div>
        </div>
        `);
        modal.on('hidden.bs.modal',(e)=>{ modal.attr("id",""); setTimeout(()=>{ modal.remove(); },1000); });
        root.append(modal);
        modal.modal('show');
     }

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
        await super.setup();
        for (const generationCode of this.generations) {
            let generationData = filterGeneration((v)=>v["name"]==generationCode)[0];
            this.pokemons = this.pokemons.concat(
                generationData["pokemons"].filter((v)=>!cries_blacklist.includes(v["dex"])).map((pkmn)=>{ 
                    let returned = pkmn;
                    let form0 = pkmn["forms"][0];
                    returned["types"] = form0["types"];
                    returned["cry"] = form0["cry"];
                    returned["sprite"] = form0["sprite"]; 
                    return returned;
                })
            );
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
            let colors = [typesColors[pokemon["types"][0]]];
            if (pokemon["types"].length > 1) colors.push(typesColors[pokemon["types"][1]]);
            let buttonStyle = (colors.length == 1) ? `background: ${colors[0]} !important` : `  background: linear-gradient( to right, ${colors[0]} 0.1%, ${colors[0]} 40%, ${colors[1]} 60%, ${colors[1]} 100% ) !important`
            let input = $(`<input type="button" value="${index}" id="btn-choice-${index}" class="btn-check" autocomplete="off">`);
            input.click(()=>this.guess(index));
            let label = $(`<label id="btn-label-${index}" style=" margin-right: 5px; margin-left: 5px;min-width: 19%; text-align:left; padding-left:6px; margin-bottom: 1%; ${buttonStyle};" class="btn" for="btn-choice-${index}"><img class="pixelart pokemon-btn img-fluid" id="btn-img-${index}"width="100px" src="${pokemon["sprite"]}"/><span language-element="pokemon" pokemon="${pokemon.name}" id="btn-span-${index}">${getName(pokemon)}</span></label>`);
            root.append(input);
            root.append(label);
            if (index == 1) root.append("<br>");
        }
    }

    async roll() {
        let pokemonsLeft = getArrayWithoutX(this.pokemons,this.alreadyShown);
        if (this.round == this.maxRounds || pokemonsLeft.length < 4) {
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
        $(`audio#pokemon_cry`).attr("src",this.listening["cry"]);
        for (let index = 0; index < this.currentPokemons.length; index++) {
            const pokemon = this.currentPokemons[index];
            let colors = [typesColors[pokemon["types"][0]]];
            if (pokemon["types"].length > 1) colors.push(typesColors[pokemon["types"][1]]);
            let buttonStyle = (colors.length == 1) ? `${colors[0]}` : `linear-gradient( to right, ${colors[0]} 0%, ${colors[0]} 40%, ${colors[1]} 60%, ${colors[1]} 100% )`
            $(`label#btn-label-${index}`).css({"background": buttonStyle});
            let span = $(`span#btn-span-${index}`);
            span.attr("pokemon",pokemon["name"]);
            span.text(getName(pokemon));
            let img = $(`img#btn-img-${index}`);
            img.attr("src",pokemon["sprite"]);
        }
    }

    async guess(e) {
        let currentState = {
            pokemon:this.listening,
            guessed:this.currentPokemons[e],
            result: (this.listening.name.toLowerCase() === this.currentPokemons[e].name.toLowerCase())
        };
        this.history[this.round] = currentState;
        this.nextRound();
    }

    async showHistorique() {
        let _modal = `<div class="modal fade" id="historique" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Historique (${this.history.filter(v=>v["result"]).length}/${this.history.length})</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="history-modal-body" class="modal-body">
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Envoyer</button>
                    </div>
                </div>
            </div>
        </div>`
        let modal = $(_modal);
        modal.on('hidden.bs.modal',(e)=>{ modal.attr("id",""); setTimeout(()=>{ modal.remove(); },1000); });
        modal.modal('show');
        root.append(modal);
        
        let limit = this.history.length-5;
        if (limit <= 0 ) limit = 0;
        for (let i = this.history.length-1; i >= limit; i--) {
            const round = this.history[i];
            $("div#history-modal-body").append($(`
                <div class="row" style="background-color:${round["result"] ? "#008000" : "#ff0000" }">
                    <div class="col">
                        <audio id="histo-pokemon-true-${i}" src="${round["pokemon"]["cry"]}"/></audio>
                        <figure>
                            <button id="histo-play-true-${i}">
                                <img class="pixelart img-fluid" width="100px" src="${round["pokemon"]["sprite"]}">
                                <figcaption><i class="fa-solid fa-check"></i></figcaption>
                            </button>
                        </figure>
                    </div>
                    <div class="col">
                        <audio id="histo-pokemon-guessed-${i}" src="${round["guessed"]["cry"]}"></audio>
                        <figure>
                            <button id="histo-play-guessed-${i}">
                                <img class="pixelart img-fluid" width="100px" src="${round["guessed"]["sprite"]}">
                                <figcaption><i class="fa-solid fa-comment"></i></figcaption>
                            </button>
                        </figure>
                    </div>
                </div><br>
            `));
            $(`button#histo-play-true-${i}`).click(()=>{toggleAudio(`audio#histo-pokemon-true-${i}`)});
            $(`button#histo-play-guessed-${i}`).click(()=>{toggleAudio(`audio#histo-pokemon-guessed-${i}`)});
        }
    }

}


class SilhouetteGame extends Game {

    constructor(generations) {
        super("Silhouette", generations);
        this.show = false;
        this.shownPokemon = null;
        this.species = [];
        this.sprite = null;
        this.canvas = null;
        this.ctx = null;
    }

    async setup() {
        super.setup();
        for (const generationCode of this.generations) {
            let generationData = filterGeneration((v)=>v["name"]==generationCode)[0];
            this.pokemons = this.pokemons.concat(generationData["pokemons"]);
            this.species = this.species.concat(generationData["pokemons"].map((pkmn)=>{ 
                let forms = pkmn["forms"].map((f)=>{
                    f["dex"] = pkmn["dex"];
                    f["name"] = pkmn["name"];
                    return f;
                });
                return forms;
            })).flat(1);
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
        for (const _pkmn of this.pokemons) {
            pokemonNameDatalist.append(`<option language-element="pokemon" pokemon="${_pkmn["name"]}" value="${getName(_pkmn)}">`);
        }
        $(`form#guess_form`).submit((e)=>{this.guess(e)});
        $(`canvas#game_canvas`).click(()=>{this.show = !this.show; this.draw()});
        this.setCanvas(document.getElementById("game_canvas"));
        this.roll();
    }

    async roll() {
        let pokemonsLeft = getArrayWithoutX(this.species,this.alreadyShown);
        if (this.round >= this.maxRounds || pokemonsLeft.length == 0) {
            alert("GG Tu a fini");
            location.reload();
            return;
        }
        this.shownPokemon = pokemonsLeft[rand(0,pokemonsLeft.length-1)];
        console.log(this.shownPokemon);
        this.alreadyShown.push(this.shownPokemon);
        this.sprite = new Image(200, 200);
        this.sprite.crossOrigin = "anonymous";
        this.sprite.src = this.shownPokemon["sprite"];
        this.sprite.addEventListener("load", (e)=>{this.draw()});
    }

    async guess(e) {
        e.preventDefault();
        let guessInput = $(`input#pokemon_guess`);
        let guess = guessInput.val();
        guessInput.val("");
        let shownPkmn = filterPokemon(v=>v["name"] === this.shownPokemon["name"])[0];
        let currentState = {
            pokemon:this.shownPokemon,
            guessed:guess,
            result: (getName(shownPkmn) === guess)
        };
        this.history[this.round] = currentState;
        this.nextRound();
    }

    async draw() {
        this.canvas.width = this.canvas.width;
        this.ctx.drawImage(this.sprite, 150 - this.sprite.width / 2, 150 - this.sprite.height / 2, 200, 200);
        if (this.show) {
            this.ctx.textAlign = 'center';
            this.ctx.font = '50px Poppins';
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

    async showHistorique() {
        let _modal = `<div class="modal fade" id="historique" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Historique (${this.history.filter(v=>v["result"]).length}/${this.history.length})</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="history-modal-body" class="modal-body">
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Envoyer</button>
                    </div>
                </div>
            </div>
        </div>`
        let modal = $(_modal);
        modal.on('hidden.bs.modal',(e)=>{ modal.attr("id",""); setTimeout(()=>{ modal.remove(); },1000); });
        modal.modal('show');
        root.append(modal);
        
        let limit = this.history.length-5;
        if (limit <= 0 ) limit = 0;
        for (let i = this.history.length-1; i >= limit; i--) {
            const round = this.history[i];
            let shownPkmn = filterPokemon(v=>v["name"] === round["pokemon"]["name"])[0];
            console.log(round["pokemon"])
            $("div#history-modal-body").append($(`
                <div class="row" style="background-color:${round["result"] ? "#008000" : "#ff0000" }">
                    <div class="col">
                        <figure>
                            <img class="pixelart img-fluid" width="100px" src="${round["pokemon"]["sprites"]}">
                            <figcaption>${getName(shownPkmn)}</figcaption>
                        </figure>
                    </div>
                    <div class="col justify-content-center m-auto">
                        <span>${round["guessed"]}</span>
                    </div>
                </div><br>
            `));
        }
    }
}