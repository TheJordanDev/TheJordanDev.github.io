const root = $("#root");

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