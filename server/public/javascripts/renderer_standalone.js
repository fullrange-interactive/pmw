var _GET = getQueryParams(document.location.search);

var rendererGrid = null;
var serverIp = _GET['serverIp'];
var serverPort = _GET['serverPort'];
var windowId = _GET['windowId'];
var multiple = _GET['multiple'];

if (typeof multiple !== 'undefined')
{
    var options = JSON.parse(_GET['options']);
}

var currentSlide = '';

/*
* Starting client
*/

var newGrid = false;


var clients = [];
var serializedClients = [];

var defaultWidth = 200;
var defaultHeight = 200;

function newRenderer(clientId, points, resizeOnWindowModel) {
    var newClient = new RendererProjectionMapped($("#windowsWrapper"), serverIp, serverPort, clientId, points); //Client($("#windowsWrapper"), clientId, points);
    newClient.resizeOnWindowModel = resizeOnWindowModel;

    // Add remove handler
    newClient.bounds.dblclick(function (i){

    }.bind(newClient, clients.length));

    // Add distort listener
    newClient.onDistort = function (i){
        serializedClients[i].points = this.points;
        localStorage.setItem('clients', JSON.stringify(serializedClients));
    }.bind(newClient, serializedClients.length);

    clients.push(newClient);
    serializedClients.push({clientId: newClient.windowId, points: newClient.points});    
}

var selectedClient = 0;
var selectedPoint = 0;
function selectNextClient() {
    clients[selectedClient].bounds.removeClass("selected");
    selectedClient++;
    if (selectedClient >= clients.length)
        selectedClient = 0;
    clients[selectedClient].bounds.addClass("selected");
}
function selectPoint(n) {
    $(".corner[corner=" + selectedPoint + "]").removeClass("selected");
    selectedPoint += n;
    if (selectedPoint > 4)
        selectedPoint = 1;
    $(".corner[corner=" + selectedPoint + "]").addClass("selected");
}
function movePoint(x, y) {
    clients[selectedClient].points["p" + selectedPoint].x += x;
    clients[selectedClient].points["p" + selectedPoint].y += y;
    clients[selectedClient].reinitialize();
    clients[selectedClient].onDistort();
    selectPoint(0);
}
function deleteSelectedClient() {
    var client = clients[selectedClient];
    var i = selectedClient;
    selectNextClient();
    client.remove();
    clients.splice(i, 1);
    serializedClients.splice(i, 1);
    localStorage.setItem('clients', JSON.stringify(serializedClients));
    return false;
}

$(document).ready(function (){
    // Restore clients from storage
    var oldClients = localStorage.getItem('clients');
    if (oldClients)
        oldClients = JSON.parse(oldClients);
    if (oldClients) {
        for (var i in oldClients) {
            newRenderer(oldClients[i].clientId, oldClients[i].points, false);
        }
    }

    $(document).dblclick(function (e) {
        var clientId = prompt("Window ID?");
        if (!clientId)
            return;
        var points = {
            p1: {x: e.pageX, y: e.pageY},
            p2: {x: e.pageX + defaultWidth, y: e.pageY},
            p3: {x: e.pageX, y: e.pageY + defaultHeight},
            p4: {x: e.pageX + defaultWidth, y: e.pageY + defaultHeight}
        };
        newRenderer(clientId, points, true);
    });

    var moveSpeed = 1;
    $(document).keydown(function (evt) {
        if (evt.keyCode === 77) {
            // m
            $("#windowsWrapper").toggleClass("debug");
        } else if (evt.keyCode === 78) {
            // n
            selectNextClient();
        } else if (evt.keyCode === 32) {
            selectPoint(1);
        } else if (evt.keyCode === 37) {
            // left
            movePoint(-moveSpeed, 0);
        } else if (evt.keyCode === 38) {
            // up
            movePoint(0, -moveSpeed);
        } else if (evt.keyCode === 39) {
            // right
            movePoint(moveSpeed, 0);
        } else if (evt.keyCode === 40) {
            // down
            movePoint(0, moveSpeed);
        } else if (evt.keyCode === 83) {
            // s
            moveSpeed *= 2;
            if (moveSpeed > 4)
                moveSpeed = 1;
        } else if (evt.keyCode === 88) {
            deleteSelectedClient();
        }
    });
});

var Client = function (container, windowId, x, y) {

}
