import { SocketIOServer } from '../socket/server/io';
import './controller/TestController';

const PORT = 5000;
const server = new SocketIOServer(PORT, {
    serveClient: false,
    pingTimeout: 5000,
    pingInterval: 10000,
});

// server.register('HELLO_WORLD', function (data: any) {
//     console.log('HELLO_WORLD');
// });

server.middleware.registerApi('HELLO_WORLD', (data: any) => console.log(JSON.stringify(data)));
// server.register('HELLO_WORLD', (data: any) => console.log(JSON.stringify(data)));
server.run();

setInterval(() => server.middleware.emitEvent('TEST', { data: 'test' }), 1000);
