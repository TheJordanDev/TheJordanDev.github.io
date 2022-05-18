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

function addDelete(ul, li) {
    let addButton = $("<button>").html('<i class="fas fa-solid fa-trash-alt"></i>');
    addButton.on('click', function(e) {
        e.preventDefault();
        ul.remove();
    });
    addButton.appendTo(li);
}

function changeToText(what) {
    let text = what.text();
    console.log(text);
    if (what.children("input[type=text]").length == 1) {
        let area = $(document.createElement("textarea"));
        area.attr("id",what.attr("id")).width("15rem").height("3.5rem");
        what.children("input[type=text]").first().replaceWith(area);
        area.text(text);
    } else {
        let area = $(document.createElement("input"));
        area.attr("id",what.attr("id")).attr("type","text");
        what.children("textarea").first().replaceWith(area);
        area.val(text);
    }
    
}

function addElement(what) {
    let children = $(what).children("ul").length;
    let ul = $("<ul>");
    let li = $("<li>").attr('id',`${what.attr("id")}:${children}`);
    
    let div = $("<div>");

    let input = $("<input>");
    input.attr("type","text");

    addColorPicker(div);
    input.appendTo(div);
    addChangeToText(div)
    addDelete(ul,div);
    addButton(div);

    div.appendTo(li);

    li.appendTo(ul);
    ul.appendTo(what);
    $("div#main").scrollLeft(window.outerWidth);
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

function toJsonObj(root) {
    return childrenToObj(root);
}

function childrenToObj(element) {
    let objects = [];
    element.children("ul").each((i, e) => {
        let container = $(e).children("li").first().children("div").first();
        let multiline = container.children("textarea").length > 0;
        let text = multiline ? container.children("textarea").first().val() : container.children("input[type=text]").first().val();
        let obj = {
            "color": container.children("input[type=color]").first().val(),
            "text": text,
            "multiline": multiline,
            "children": childrenToObj($(container))
        };
        objects.push(obj);
    });
    return objects;
}

function parseTo() {
    $("#jsonOutput").text(JSON.stringify(toJsonObj($("#root")),null,4));
}