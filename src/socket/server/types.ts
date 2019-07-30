import io, { Server, ServerOptions as IOServerOptions } from 'socket.io';
import { ISocketMiddleware } from './middleware';
import { ServerOptions as WSServerOptions } from 'ws';
import { SYSTEM_HEALTH_SOCKET_CHANNEL } from '../server/config';

export interface SocketInstance {
    start();

    stop();

}

interface IEmitter {
    on(event: string, fn: Function): IEmitter;
    emit<T>(event: string, ...args: Array<T>): IEmitter;
    close();
}

export type ServerOptions = IOServerOptions | WSServerOptions;

export abstract class SocketServer<T extends IEmitter> {

    readonly port: number;
    readonly config: ServerOptions;
    readonly middleware?: ISocketMiddleware;

    private heartbeatJob: any;

    socket: Server;

    constructor(port: number, config: ServerOptions, heartbeatRate: number = 0, middleware?: ISocketMiddleware) {
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
