import io, { Server, ServerOptions } from 'socket.io';
import { ISocketMiddleware } from './middleware';
import { SYSTEM_HEALTH_SOCKET_CHANNEL } from '../server/config';

export interface SocketRunnable {
    run();

    shutdown();

}

interface IEmitter {
    on(event: string, listener: Function);

    emit(event: string, ...args: any[]);

}

export abstract class SocketServer<T extends IEmitter, SocketServerOptions> {

    readonly port: number;
    readonly config: SocketServerOptions;
    readonly middleware?: ISocketMiddleware;

    protected heartbeatJob: any;
    protected heartbeatRate: number;

    protected listeners: Array<{ channel: string, executor: Function }>;

    socket: T;

    constructor(port: number, config: SocketServerOptions, heartbeatRate: number = 0, middleware?: ISocketMiddleware) {
        this.port = port;
        this.config = config;
        this.heartbeatRate = heartbeatRate;
        this.middleware = middleware;

        this.listeners = [];
    }

    protected enableHeartbeat(heartbeatRate: number) {
        this.heartbeatJob = setInterval(() => {
            this.socket.emit(SYSTEM_HEALTH_SOCKET_CHANNEL, { isAlive: true, date: new Date() });
        }, heartbeatRate);
    }

    public register(channel: string, listener: Function) {
        this.listeners.push({ channel, executor: listener });
    }

    public getSocket(): T {
        return this.socket;
    }

}

export class SocketIOServer extends SocketServer<Server, ServerOptions> implements SocketRunnable {

    constructor(port: number, config: ServerOptions, heartbeatRate: number = 0, middleware?: ISocketMiddleware) {
        super(port, config, heartbeatRate, middleware);
    }

    run() {
        this.socket = io(this.port, this.config);
        if (this.heartbeatRate) {
            this.enableHeartbeat(this.heartbeatRate);
        }
        this.socket.on('connection', (socket) =>
            this.listeners.forEach(listener => socket.on(listener.channel, () => listener.executor)));
        console.log('Socket server started successfully');
    }

    shutdown() {
        console.log('Stopping socket server...');
        if (this.socket) {
            clearInterval(this.heartbeatJob);
            this.socket.close();
            console.log('Socket server stopped successfully');
        }
    }
}

const server = new SocketIOServer(5000, {
    serveClient: false,
    pingTimeout: 5000,
    pingInterval: 10000,
});

server.register('HELLO_WORLD', (data: any) => console.log('HELLO WORLD'));
server.run();
