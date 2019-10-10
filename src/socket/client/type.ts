import { ResponseEntity } from '../model/response';

export interface IEmitter {
    on(event: string, fn: Function): IEmitter;
    emit<T>(event: string, ...args: Array<T>): IEmitter;
}

export interface ISocketClient<Code = string, Socket = WebSocket> extends IEmitter {
    send<Data, Response>(code: Code, data: Data): Promise<ResponseEntity<Response>>;
    addCodeListener(code: Code, fn: Function): ISocketClient<Code, Socket>;
    getSocket(): Socket;
    close(): ISocketClient<Code, Socket>;
}
