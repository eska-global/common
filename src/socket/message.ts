import uuidv4 from 'uuid/v4';

export enum MessageType {
    REQUEST = 1,
    RESPONSE = 2,
    EVENT = 3,
}

export enum SocketSystemType {

}

export class Message<MessageBody, Code> {
    public code: Code;
    public headers: {
        id: string;
        type: MessageType;
    };
    public body: MessageBody;

    constructor(type: MessageType, code: Code, body: any, id? : string) {
        this.code = code;
        this.headers = {
            id: id || uuidv4(),
            type,
        };
        this.body = body;
    }
}

