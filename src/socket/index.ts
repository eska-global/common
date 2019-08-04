import './controller/TestController';

export { IOSocketServer } from './server/io';
export { WebSocketServer } from './server/web';
export {
    IEmitter, SocketType, Listeners,
    AnyFunction, SocketRunnable, SocketServer,
    ApiContainer
} from './server/types';

// import { IOSocketServer } from '../socket/server/io';
// import './controller/TestController';
// import { WebSocketServer } from '../socket/server/web';
//
// const PORT = 5000;
// const listener = (data: any) => console.log(JSON.stringify(data));
// const HELLO_WORLD_CHANNEL = 'HELLO_WORLD';
//
// const IOServerConfig = {
//     serveClient: false,
//     pingTimeout: 5000,
//     pingInterval: 10000,
// };
//
// const ioServer = new IOSocketServer(PORT, IOServerConfig, 1000);
// const webServer = new WebSocketServer(PORT, {},1000);
//
// // ioServer.run();
// webServer.run();
//
// // ioServer.middleware.registerApi(HELLO_WORLD_CHANNEL, listener);
// // setInterval(() => ioServer.middleware.emitEvent('TEST', { data: 'test' }), 1000);
//
// // setTimeout(() => webServer.shutdown(), 5000);
// // setTimeout(() => ioServer.shutdown(), 5000);
//
