const root = $("#root");
const header = $("header#header");

let language = (localStorage.getItem("language") ? localStorage.getItem("language"): "fr");

let startMessage = {"names":[
    {
        "language": {
            "name": "ja-Hrkt",
            "url": "https://pokeapi.co/api/v2/language/1/"
        },
        "name": "始めること"
    },
    {
        "language": {
            "name": "ko",
            "url": "https://pokeapi.co/api/v2/language/3/"
        },
        "name": "시작한다"
    },
    {
        "language": {
            "name": "fr",
            "url": "https://pokeapi.co/api/v2/language/5/"
        },
        "name": "Commencer"
    },
    {
        "language": {
            "name": "de",
            "url": "https://pokeapi.co/api/v2/language/6/"
        },
        "name": "Anfangen"
    },
    {
        "language": {
            "name": "es",
            "url": "https://pokeapi.co/api/v2/language/7/"
        },
        "name": "Comenzar"
    },
    {
        "language": {
            "name": "en",
            "url": "https://pokeapi.co/api/v2/language/9/"
        },
        "name": "Start"
    },
    {
        "language": {
            "name": "it",
            "url": "https://pokeapi.co/api/v2/language/8/"
        },
        "name": "Cominciare"
    }

    
]}

function rand(min, max){
    return (Math.floor(Math.pow(10,14)*Math.random()*Math.random())%(max-min+1))+min;
}  

function toggleAudio(selector) {
    let audio = $(selector);
    audio.trigger("play");
}

function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
    return shuffled.slice(0, num);
}

function getArrayWithoutX(array, without) {
    let withoutSet = new Set(without);
    return array.filter((element)=>{
        return !withoutSet.has(element);
    });
}

function updateLanguages(lang) {
    language = lang;
    $("*[language-element]").each((index,_e) => {
        let element = $(_e);
        if (element.attr("generation")) {
            let gen = element.attr("generation");
            let generation = filterGeneration((v)=>v["name"] == gen)[0];
            element.text(getName(generation));
        } else if (element.attr("language")) {
            let _lang = element.attr("language");
            let selectedLang = filterLanguage((v)=>v["name"] == _lang)[0];
            element.text(getName(selectedLang));
        } else if (element.attr("pokemon")) {
            let _pkmn = element.attr("pokemon");
            let selectedLang = filterPokemon((v)=>v["name"] == _pkmn)[0];
            if (element.children().length == 0 && element.text() === "") {
                element.val(getName(selectedLang))
            } else {
                element.text(getName(selectedLang));
            }
        } else {
            if (element.attr("language-element") == "start") {
                element.text(getName(startMessage)+" !");
            }
        }
    });
    localStorage.setItem("language",language);
}