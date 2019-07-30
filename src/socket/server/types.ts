import io, { Server, ServerOptions as IOServerOptions } from 'socket.io';
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

    socket: T;

    constructor(port: number, config: SocketServerOptions, heartbeatRate: number = 0, middleware?: ISocketMiddleware) {
        this.port = port;
        this.config = config;
        this.middleware = middleware;

        if (heartbeatRate) {
            this.enableHeartbeat(heartbeatRate);
        }
    }

    protected enableHeartbeat(heartbeatRate: number) {
        this.heartbeatJob = setInterval(() => {
            this.socket.emit(SYSTEM_HEALTH_SOCKET_CHANNEL, { isAlive: true, date: new Date() });
        }, heartbeatRate);
    }

}

export class SocketIOServer extends SocketServer<Server, IOServerOptions> implements SocketRunnable {

    constructor(port: number, config: SocketIO.ServerOptions, heartbeatRate: number = 0, middleware?: ISocketMiddleware) {
        super(port, config, heartbeatRate, middleware);
    }

    run() {
        this.socket = io(this.port, this.config);
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
