import { AnyFunction, ApiContainer, IEmitter, Listeners } from '../server/types';
import { initSocketListeners } from '../util';
import { Message, MessageType } from '../model/message';
import { SOCKET_DEAULT_MESSAGE_CHANNEL } from '../server/config';
import { ResponseEntity } from '../model/response';
import { API_CONTAINER } from '../decorator/api';

export interface ISocketMiddleware<T> {

    apiMethods: ApiContainer;
    socketServer?: T;

    onConnect(socket: any);

    registerApi(channel: string, listener: AnyFunction);

    applyApi(socket: any);

    emitEvent(channel: string, data: any);

}

export class SocketMiddleware<T extends IEmitter> implements ISocketMiddleware<T> {

    apiMethods: ApiContainer;
    socketServer?: T;
    listeners: Listeners;

    enableDefaultListeners: boolean;

    constructor(apiMethods: ApiContainer, enableDefaultListeners: boolean = false, socketServer?: T) {
        this.apiMethods = apiMethods;
        this.socketServer = socketServer;
        this.enableDefaultListeners = enableDefaultListeners;

        this.listeners = [];
    }

    onConnect(socket: any) {
        // default implementation
    }

    registerApi(channel: string, listener: AnyFunction) {
        this.listeners.push({ channel, executor: listener });
    }

    applyApi(socket: any) {
        if (this.enableDefaultListeners) {
            this.initDefaultListeners(socket);
        }
        initSocketListeners(this.listeners, socket);
    }

    emitEvent(channel: string, data: any) {
        this.socketServer.emit(channel, data);
    }

    private initDefaultListeners(socket: any) {
        socket.on(SOCKET_DEAULT_MESSAGE_CHANNEL, (message: Message<any, any>) => this.onMessage(message, socket));
    }

    private onMessage(message: Message<any, any>, socket: any) {
        const method = API_CONTAINER[message.code];
        if (method && typeof method === 'function' && message.headers.type === MessageType.REQUEST) {
            message.body = method(message, socket);
            message.headers.type = MessageType.RESPONSE;
            socket.emit(SOCKET_DEAULT_MESSAGE_CHANNEL, message);
        } else {
            const errors = new ResponseEntity({ errors: ['Invalid request. Request code not found'] });
            const errorMessage = new Message<ResponseEntity<any>, any>(
                MessageType.RESPONSE,
                message.code,
                errors,
                message.headers.id
            );
            socket.emit(SOCKET_DEAULT_MESSAGE_CHANNEL, errorMessage);
        }

    }
}
