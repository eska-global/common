import { ISocketMiddleware } from '../middleware/middleware';
import { SYSTEM_HEALTH_SOCKET_CHANNEL } from '../config/config';
import { Message, MessageType } from '../model/message';
import { Heartbeat } from '../model/heartbeat';

export interface SocketRunnable {
    run();

    shutdown();

}

export interface IEmitter {
    on(event: string, listener: Function);

    emit(event: string, ...args: any[]);

    close();
}

export enum SocketType {
    IO,
    WEB
}

export type AnyFunction = (...args: any[]) => any;
export type Listeners = Array<{ channel: string, executor: AnyFunction }>;
export type ApiContainer = { [methodName: string]: AnyFunction };

export abstract class SocketServer<T extends IEmitter, SocketServerOptions> {

    readonly port: number;
    readonly config: SocketServerOptions;
    readonly middleware?: ISocketMiddleware<T>;

    protected heartbeatJob: any;
    protected heartbeatRate: number;

    protected listeners: Listeners;

    socket: T;

    constructor(port: number,
                config: SocketServerOptions,
                heartbeatRate: number = 0,
                middleware: ISocketMiddleware<T>) {
        this.port = port;
        this.config = config;
        this.heartbeatRate = heartbeatRate;
        this.middleware = middleware;

        this.listeners = [];
    }

    protected enableHeartbeat(heartbeatRate: number) {
        this.heartbeatJob = setInterval(() => {
            const heartbeatData = new Heartbeat();
            const heartbeatMessage = new Message(MessageType.EVENT, SYSTEM_HEALTH_SOCKET_CHANNEL, heartbeatData);
            this.socket.emit(SYSTEM_HEALTH_SOCKET_CHANNEL, heartbeatMessage);
        }, heartbeatRate);
    }

    public getSocket(): T {
        return this.socket;
    }

    run() {
        this.heartbeatRate && this.enableHeartbeat(this.heartbeatRate);
        this.middleware.socketServer = this.socket;
        this.socket.on('connection', (socket: any) => {
            if (this.middleware) {
                this.middleware.onConnect(socket);
                this.middleware.applyApi(socket);
            }
        });
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
