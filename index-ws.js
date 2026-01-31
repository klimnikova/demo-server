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


process.on('SIGINT', () => {
    wss.clients.forEach((client) => {
        client.close();
    })
    server.close(() => {
        shutdownDB();
    })
})

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

    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))
    `);

    wsArg.on('close', () => {
        console.log('A client has disconnected');
    })
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
        client.send(data);
    });
}



/** End Websockets */

/** Begin database */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
        `)
});

function getCounts () {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);

    })
}

function shutdownDB () {
    getCounts();
    console.log('Shutting down db');
    db.close();
}