const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let pcOffer = null;

wss.on('connection', ws => {
    console.log('Cliente conectado');

    ws.on('message', message => {
        const data = JSON.parse(message);

        if (data.type === 'offer') {
            console.log('Offer recibida del celular');
            pcOffer = ws;
            // Reenviamos al navegador
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'offer', sdp: data.sdp }));
                }
            });
        }

        if (data.type === 'answer') {
            console.log('Answer recibida del navegador');
            // Reenviamos al celular
            if (pcOffer && pcOffer.readyState === WebSocket.OPEN) {
                pcOffer.send(JSON.stringify({ type: 'answer', sdp: data.sdp }));
            }
        }
    });
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080');
