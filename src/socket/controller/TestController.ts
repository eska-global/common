import { API } from '../decorator/api';
import { Message } from '../model/message';
import { ResponseEntity } from '../model/response';

export class TestController {

    constructor() {
        this.getDelegates = this.getDelegates.bind(this);
    }

    @API('GET_DELEGATES')
    public getDelegates(message: Message<any, any>): ResponseEntity<{ delegates: Array<any>, count: number }> {
        return new ResponseEntity({
            data: {
                delegates: [],
                count: 5,
            }
        });
    }
}

export default new TestController();
