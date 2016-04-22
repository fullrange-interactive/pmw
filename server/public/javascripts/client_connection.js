ClientConnection = Class.extend({
    onConnect: null,
    onClose: null,
    onPing: null,
    onError: null,
    onSlide: null,
    onWindowModel: null,
    initialize: function(serverIp, serverPort, windowId) {
        var serverConnection = false;

        this.pingIntervalSeconds = 9;
        this.timeoutSeconds = 30;

        this.ip = '1.1.1.1'; // Fake IP (impossible to get via JS in-browser)
        this.serverIp = serverIp;
        this.serverPort = serverPort;
        this.windowId = windowId;
        this.finished = false;

        this.client = new WebSocket('ws://' + serverIp + ':' + serverPort + '/', 'echo-protocol');

        this.client.onerror = this._onError.bind(this);
        this.client.onclose = this._onClose.bind(this);
        this.client.onmessage = this._onMessage.bind(this);
        this.client.onopen = this._onOpen.bind(this);

        this.checkInterval = setInterval(this._doCheck.bind(this), this.pingIntervalSeconds * 1000);
    },
    _onError: function(error) {
        console.log('[Client] Cannot connect');
        this.serverConnection = false;
        if (this.onError !== null)
            this.onError();
    },
    _onClose: function() {
        console.log('[Client] close');
        this.serverConnection = false;
        if (this.onClose !== null)
            this.onClose();
    },
    _onMessage: function(message) {
        message.utf8Data = message.data;

        var parsedMessage = false;

        this.lastActivity = (new Date()).getTime();

        try {
            parsedMessage = JSON.parse(message.utf8Data);
        } catch (e) {
            console.error('[Client] Error parsing message ' + message.utf8Data);
            return;
        }

        if (parsedMessage.type == 'slide') {
            var slide = parsedMessage.slide;
            if (this.onSlide !== null)
                this.onSlide(slide, parsedMessage.xStart, parsedMessage.yStart, parsedMessage.dateStart, false, parsedMessage.transition);
        } else if (parsedMessage.type == 'windowModel') {
            var windowModel = parsedMessage.windowModel;
            if (this.onWindowModel !== null)
                this.onWindowModel(windowModel);
            return;
        } else if (parsedMessage.type == 'ping') {
            lastActivity = (new Date()).getTime();
            if (this.onPing !== null)
                this.onPing();
            return;
        } else if (parsedMessage.type == 'sequence') {
            console.log('[Client][Error] Received sequence, but not yet implemented');
            return;
        } else if (parsedMessage.type == 'neighbors') {
            console.log('[Client][Error] Received neighbors, but not yet implemented');
            return;
        } else if (parsedMessage.type == 'dataStream') {
            console.log('[Client][Error] Received dataStream, but not yet implemented');
            return;
        } else {
            console.error('[Client] unknown message type: "' + parsedMessage.type + '" Complete message:' + message.utf8Data);
            return;
        }
    },
    _onOpen: function() {
        this.serverConnection = true;

        /*
         * Sending our id
         */
        this.client.send(JSON.stringify({
            type: 'announce',
            ip: this.ip,
            windowId: this.windowId
        }), function(error) {
            if (error) {
                this.client.close();
                this.serverConnection = false;
            } else {
                if (this.onConnect !== null)
                    this.onConnect();
            }
        });
    },
    _doCheck: function() {
        if (this.finished) {
            clearInterval(checkInterval);
            return;
        }
        if (this.serverConnection) {
            this.client.send(JSON.stringify({
                type: 'ping',
                windowId: this.windowId,
                ip: this.ip
            }), function() {});
        }
        if (this.lastActivity + this.timeoutSeconds * 1000 < (new Date()).getTime()) {
            if (this.serverConnection) {
                try {
                    this.client.close();
                } catch (e) {}
            }

            this.serverConnection = false;

            this.client = new WebSocket('ws://' + this.serverIp + ':' + this.serverPort + '/', 'echo-protocol');
            this.client.onerror = this._onError.bind(this);
            this.client.onclose = this._onClose.bind(this);
            this.client.onmessage = this._onMessage.bind(this);
            this.client.onopen = this._onOpen.bind(this);
        }
    },
    onMessage: function(message) {},
    end: function() {
        this.finished = true;
        this.client.close();
    }
})
