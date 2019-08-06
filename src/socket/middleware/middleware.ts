import { AnyFunction, ApiContainer, IEmitter, Listeners, SocketType } from '../server/types';
import { initSocketListeners, onMessage, sendData } from '../util/index';
import { Message, MessageType } from '../model/message';
import { SOCKET_DEFAULT_MESSAGE_CHANNEL } from '../config/config';
import { ResponseEntity } from '../model/response';
import { API_CONTAINER } from '../decorator/api';
import { validate } from '../validator/index';

export interface ISocketMiddleware<T> {

    apiMethods: ApiContainer;
    socketServer?: T;

    onConnect(socket: any);

    registerApi(channel: string, listener: AnyFunction);

    applyApi(socket: any);

    emitEvent(channel: string, data: any);

}

export class DefaultSocketMiddleware<T extends IEmitter> implements ISocketMiddleware<T> {

    apiMethods: ApiContainer;
    socketServer?: T;
    listeners: Listeners;
    type: SocketType;

    enableDefaultListeners: boolean;

    constructor(apiMethods: ApiContainer, enableDefaultListeners: boolean = false, type: SocketType, socketServer?: T) {
        this.apiMethods = apiMethods;
        this.socketServer = socketServer;
        this.enableDefaultListeners = enableDefaultListeners;
        this.type = type;
        this.listeners = [];

        // this.onMessage = this.onMessage.bind(this);
        this.onIOMessage = this.onIOMessage.bind(this);
    }

    onConnect(socket: any) {
        // default implementation
    }

    registerApi(channel: string, listener: AnyFunction) {
        this.listeners.push({ channel, executor: listener });
    }

    applyApi(socket: any) {
        this.enableDefaultListeners && this.initDefaultListeners(socket);
        initSocketListeners(this.listeners, socket);
    }

    emitEvent(channel: string, data: any) {
        this.socketServer.emit(channel, data);
    }

    private initDefaultListeners(socket: any) {
        socket.on(SOCKET_DEFAULT_MESSAGE_CHANNEL, (data: any) => {
            if (this.type === SocketType.WEB) {
                data = JSON.parse(data);
                this.onWebMessage(data, socket);
            } else {
                this.onIOMessage(data, socket);
            }
        });
    }

    // TODO: context!!!
    @validate(SocketType.IO)
    private onIOMessage(message: Message<any, any>, socket: any) {
        onMessage(message, socket, SocketType.IO);
    }

    @validate(SocketType.WEB)
    private onWebMessage(message: Message<any, any>, socket: any) {
        onMessage(message, socket, SocketType.WEB);
    }

    private onMessage(message: Message<any, any>, socket: any) {
        const method = API_CONTAINER[message.code];
        if (method && typeof method === 'function' && message.headers.type === MessageType.REQUEST) {
            message.body = method(message, socket);
            message.headers.type = MessageType.RESPONSE;
            sendData(socket, message, this.type);
        } else {
            const errors = new ResponseEntity({ errors: ['Invalid request. Request code not found'] });
            const errorMessage = new Message<ResponseEntity<any>, any>(
                MessageType.RESPONSE,
                message.code,
                errors,
                message.headers.id
            );
            sendData(socket, errorMessage, this.type);
        }
    }
}
