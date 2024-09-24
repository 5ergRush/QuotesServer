const websocket = require('ws');
const http = require('http');

const server = http.createServer();
const PORT = process.env.PORT || 8888;
const wss = new websocket.WebSocketServer({port: PORT});

const symbols = [
    'EURUSD',
    'GBPUSD',
    'USDJPY',
    'USDRUB',
    'AUDUSD',
    'USDCAD'
];

function generateRate(symbol) {
    const basePrice = Math.random() * 100 + 50;
    const spread = Math.random() * 0.0010 + 0.0001;
    const bid = basePrice;
    const ask = bid + spread;

    return {
        time: new Date().toISOString(),
        symbol : symbol,
        bid: parseFloat(bid.toFixed(4)),
        ask: parseFloat(ask.toFixed(4))
    }
}
function broadcastRates(){
    if (wss.clients.size > 0){
        symbols.forEach(symbol => {
            const rate = generateRate(symbol);
            wss.clients.forEach(client => {
                if (client.readyState === websocket.OPEN) {
                    client.send(JSON.stringify(rate));
                }
            });
        });
    }
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

setInterval(broadcastRates, 100);