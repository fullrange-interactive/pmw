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

var defaultWidth = 200;
var defaultHeight = 200;

$(document).ready(function (){
    function saveClients() {
        var clientsList = [];
        for (var i in clients) {
            var client = clients[i];
            var elem = {
                p1: client.p1,
                p2: client.p2,
                p3: client.p3,
                p4: client.p4
            };
        }
    }
    $(document).click(function (e){
        var clientId = prompt("Window ID?");
        if (!clientId)
            return;
        var points = {
            p1: {x: e.pageX, y: e.pageY},
            p2: {x: e.pageX + defaultWidth, y: e.pageY},
            p3: {x: e.pageX, y: e.pageY + defaultHeight},
            p4: {x: e.pageX + defaultWidth, y: e.pageY + defaultHeight}
        };
        var newClient = new RendererProjectionMapped($("#windowsWrapper"), serverIp, serverPort, clientId, points); //Client($("#windowsWrapper"), clientId, points);
        newClient.resizeOnWindowModel = true;
        clients.push(newClient);
    });
});

var Client = function (container, windowId, x, y) {

}
