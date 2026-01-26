const express = require('express');
const http = require("http");
const ws = require("ws");

const PORT = 3000;

const server = http.createServer();
const app = express();


app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});

});

server.on('request', app);

server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
});


/** Begin websocket */
const WebSocketServer = ws.Server;

const wss = new WebSocketServer({server});

wss.on('connection', (wsArg) => {
    const numClients = wss.clients.size;
    console.log('Clients connected', numClients);

    wss.broadcast(`Current visitors: ${numClients}`);

    if(wsArg.readyState === wsArg.OPEN) {
        wsArg.send('Welcome to my server');
    }

    wsArg.on('close', () => {
        console.log('A client has disconnected');
    })
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
        client.send(data);
    });
}

