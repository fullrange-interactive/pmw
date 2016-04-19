ClientConnection = Class.extend({
    onConnect: null,
    onClose: null,
    onPing: null,
    onError: null,
    onSlide: null,
    onWindowModel: null,
    initialize: function (serverIp, serverPort, windowId)
    {
        var serverConnection = false;

        var pingIntervalSeconds = 9;
        var timeoutSeconds = 30;

        this.ip = '1.1.1.1'; // Fake IP (impossible to get via JS in-browser)
        this.serverIp = serverIp;
        this.serverPort = serverPort;
        this.windowId = windowId;

        var client = new WebSocket('ws://' + serverIp + ':' + serverPort + '/', 'echo-protocol');

        client.onerror = function(error)
        {
            console.log('[Client] Cannot connect');
            serverConnection = false;
            if (this.onError !== null)
                this.onError();
        };

        client.onclose = function()
        {
            console.log('[Client] close');
            serverConnection = false;
            if (this.onClose !== null)
                this.onClose();
        }.bind(this);

        client.onmessage = function (message)
        {
            message.utf8Data = message.data;

            var parsedMessage = false;

            lastActivity = (new Date()).getTime();

            try
            {
                parsedMessage = JSON.parse(message.utf8Data);
            }
            catch (e)
            {
                console.error('[Client] Error parsing message ' + message.utf8Data);
                return;
            }

            if (parsedMessage.type == 'slide')
            {
                var slide = parsedMessage.slide;
                if (this.onSlide !== null)
                    this.onSlide(slide, parsedMessage.xStart, parsedMessage.yStart, parsedMessage.dateStart);
            }
            else if (parsedMessage.type == 'windowModel')
            {
                var windowModel = parsedMessage.windowModel;
                if (this.onWindowModel !== null)
                    this.onWindowModel(windowModel);
                return;
            }
            else if (parsedMessage.type == 'ping')
            {
                lastActivity = (new Date()).getTime();
                if (this.onPing !== null)
                    this.onPing();
                return;
            }
            else if (parsedMessage.type == 'sequence')
            {
                console.log('[Client][Error] Received sequence, but not yet implemented');
                return;
            }
            else if (parsedMessage.type == 'neighbors')
            {
                console.log('[Client][Error] Received neighbors, but not yet implemented');
                return;
            }
            else if (parsedMessage.type == 'dataStream')
            {
                console.log('[Client][Error] Received dataStream, but not yet implemented');
                return;
            }
            else
            {
                console.error('[Client] unknown message type: "' + parsedMessage.type + '" Complete message:' + message.utf8Data);
                return;
            }
        }.bind(this);

        client.onopen = function(connection)
        {
            serverConnection = connection;

            /*
             * Sending our id
             */
            client.send(JSON.stringify(
            {
                type: 'announce',
                ip: this.ip,
                windowId: this.windowId
            }), function(error)
            {
                if (error)
                {
                    client.close();
                    serverConnection = false;
                }
                else
                {
                    if (this.onConnect !== null)
                        this.onConnect();
                }
            });
        }.bind(this);

        var checkInterval = setInterval(function()
        {
            if (serverConnection)
            {
                client.send(JSON.stringify(
                {
                    type: 'ping',
                    windowId: this.windowId,
                    ip: this.ip
                }), function() {});
            }
            if (lastActivity + timeoutSeconds * 1000 < (new Date()).getTime())
            {
                if (serverConnection)
                {
                    try
                    {
                        client.close();
                    }
                    catch (e)
                    {}
                }

                serverConnection = false;

                client = new WebSocket('ws://' + serverIp + ':' + serverPort + '/', 'echo-protocol');

                wsConnect(client);
            }

        }.bind(this), pingIntervalSeconds * 1000);
    },
    onMessage: function (message)
    {
    },
})