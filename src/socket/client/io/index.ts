import { ResponseEntity } from '../../model/response';
import { DEFAULT_SOCKET_EVENT, DEFAULT_SOCKET_TIMEOUT } from '../../model/type';
import { Message, MessageType } from '../..';
import { ISocketClient, IEmitter } from '../../client/type';

export class IOSocketClient<ActionTypes> implements ISocketClient<ActionTypes, SocketIOClient.Socket> {
    private readonly socket: SocketIOClient.Socket;
    private readonly messageListeners: Map<string, (value?: any) => void>;
    private readonly codeListeners: Map<ActionTypes, Array<Function>>;
    private readonly timeout: number;
    private readonly event: string;

    constructor(
        socket: SocketIOClient.Socket,
        event: string = DEFAULT_SOCKET_EVENT,
        timeout: number = DEFAULT_SOCKET_TIMEOUT,
    ) {
        this.socket = socket;
        this.event = event;
        this.messageListeners = new Map<string, (value?: any | PromiseLike<any>) => void>();
        this.codeListeners = new Map<ActionTypes, Array<Function>>();
        this.timeout = timeout;

        this.socket.on(this.event, (serializedMessage: Message<ResponseEntity<any>, ActionTypes>) => {
            const message = Message.deserialize(serializedMessage);

            if (this.messageListeners.has(message.getId())) {
                this.messageListeners.get(message.getId())(message.getBody());
                this.messageListeners.delete(message.getId());
            }
            if (this.codeListeners.has(message.code)) {
                this.codeListeners.get(message.code).forEach(fn => fn(message.body));
            }
        });
    }

    on(event: string, fn: Function): IEmitter {
        return this.socket.on(event, fn);
    }

    emit(event: string, ...args: Array<any>): IEmitter {
        return this.socket.emit(event, args);
    }

    close(): IOSocketClient<ActionTypes> {
        this.socket.close();

        return this;
    }

    send<D, R>(code: ActionTypes, data: D): Promise<ResponseEntity<R>> {
        const message = new Message(MessageType.REQUEST, code, data);

        this.socket.emit(this.event, message);

        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                this.messageListeners.delete(message.headers.id);
                resolve(new ResponseEntity({ errors: ['Socket timeout'] }));
            }, this.timeout);

            this.messageListeners.set(message.headers.id, (res?: ResponseEntity<R>) => {
                clearTimeout(timeoutId);
                resolve(res);
            });
        });
    }

    getSocket(): SocketIOClient.Socket {
        return this.socket;
    }

    addCodeListener(code: ActionTypes, fn: Function): IOSocketClient<ActionTypes> {
        if (!this.codeListeners.has(code)) {
            this.codeListeners.set(code, []);
        }

        this.codeListeners.get(code).push(fn);

        return this;
    }
}
