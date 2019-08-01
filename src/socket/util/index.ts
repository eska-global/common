import { Listeners, SocketType } from '../server/types';
import { SOCKET_DEFAULT_MESSAGE_CHANNEL } from '../config/config';
import { Message, MessageType } from '../model/message';
import { API_CONTAINER } from '../decorator/api';
import { ResponseEntity } from '../model/response';

export const initSocketListeners = (listeners: Listeners, socket: any) => {
    listeners.length && listeners.forEach(listener => socket.on(listener.channel, listener.executor));
};

export const sendData = (socket: any,
                         data: any,
                         socketType: SocketType,
                         channel: string = SOCKET_DEFAULT_MESSAGE_CHANNEL) => {
    socketType === SocketType.WEB
        ? socket.send(JSON.stringify(data))
        : socket.emit(channel, data);
};


export const onMessage = (message: Message<any, any>, socket: any, type: SocketType) => {
    const method = API_CONTAINER[message.code];
    if (method && typeof method === 'function' && message.headers.type === MessageType.REQUEST) {
        message.body = method(message, socket);
        message.headers.type = MessageType.RESPONSE;
        sendData(socket, message, type);
    } else {
        const errors = new ResponseEntity({ errors: ['Invalid request. Request code not found'] });
        const errorMessage = new Message<ResponseEntity<any>, any>(
            MessageType.RESPONSE,
            message.code,
            errors,
            message.headers.id
        );
        sendData(socket, errorMessage, type);
    }
};
