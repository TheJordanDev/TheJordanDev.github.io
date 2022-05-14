function main() {
    setup();
}

function setup() {
    let root = $("#root");
    addButton(root);
}

function addButton(what) {
    let addButton = $("<button>").html('<i class="fas fa-solid fa-plus"></i>');
    addButton.on('click', function(e) {
        e.preventDefault();
        addElement(what);
    });
    addButton.appendTo(what);
}

function addColorPicker(what) {
    let colorPicker = $("<input>").attr("type","color").attr("value","#ffffff");
    colorPicker.appendTo(what);
}

function addChangeToText(what) {
    let addButton = $("<button>").html('<i class="fas fa-solid fa-i-cursor"></i>');
    addButton.on('click', function(e) {
        e.preventDefault();
        changeToText(what);
    });
    addButton.appendTo(what);
}

function changeToText(what) {
    if (what.children("input").length == 1) {
        let area = $(document.createElement("textarea"));
        area.attr("id",what.attr("id"));
        what.children("input").first().replaceWith(area);
    } else {
        let area = $(document.createElement("input"));
        area.attr("id",what.attr("id")).attr("type","text");
        what.children("textarea").first().replaceWith(area);
    }
}

function addElement(what) {
    let children = $(what).children("ul").length;
    let ul = $("<ul>");
    let li = $("<li>").attr('id',`${what.attr("id")}:${children}`);
    
    let input = $("<input>");
    li.appendTo(ul);
    ul.appendTo(what);
    addColorPicker(li);
    input.appendTo(li);
    addButton(li);
    addChangeToText(li)
}

function getPath(element) {
    let path = element.attr('id');
    console.log(path);
    let parent = element.parent();
    console.log(parent);
    let i = 0;
    while(element && parent && parent.attr('id') != "root" && i < 10) {
        path = `${parent.attr('id')}.${path}`;
        parent = parent.parent();
        console.log(path);
        i++;
    }
    path = `root.${path}`;
    return path;
}