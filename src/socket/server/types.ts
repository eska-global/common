import { ISocketMiddleware, SocketMiddleware } from './middleware';
import { SYSTEM_HEALTH_SOCKET_CHANNEL } from '../server/config';
import { API_CONTAINER } from '../decorator/api';

export interface SocketRunnable {
    run();

    shutdown();

}

export interface IEmitter {
    on(event: string, listener: Function);

    emit(event: string, ...args: any[]);
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
                middleware: ISocketMiddleware<T> = new SocketMiddleware(API_CONTAINER, true)) {
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

    public register(channel: string, listener: AnyFunction) {
        this.listeners.push({ channel, executor: listener });
    }

    public getSocket(): T {
        return this.socket;
    }

}
