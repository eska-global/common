import Validator from 'z-schema';
import { HEADER_MESSAGE_SCHEMA, MESSAGE_SCHEMA } from '../validator/schema/message';
import { Message, MessageType } from '../model/message';
import { ResponseEntity } from '../model/response';
import { SocketType } from '../server/types';
import { sendData } from '../util';

/**
 * Compile all schemas for validate
 */
const validator: Validator = new Validator({
    noTypeless: true,
    noExtraKeywords: true,
    noEmptyArrays: true,
    noEmptyStrings: true
});

const isSchemasValid: boolean = validator.validateSchema([
    HEADER_MESSAGE_SCHEMA,
    MESSAGE_SCHEMA,
]);

if (!isSchemasValid) {
    throw new Error('Invalid validation schema');
}


export const validate = (type: SocketType) => {
    return (_target: any, _propertyName: string, descriptor: PropertyDescriptor) => {
        let descriptorFn = descriptor.value || descriptor.get();

        return {
            value: (message: any, socket: any): any => {
                const callback = (errors: Array<Validator.SchemaError>, isValid: boolean) => {
                    if (!isValid) {
                        const errorMessage = [`Invalid arguments`, ...errors.map(err => err.message)];
                        if (message.headers && message.headers.id) {
                            message.headers.type = MessageType.RESPONSE;
                            message.body = new ResponseEntity({
                                errors: errorMessage
                            });
                        } else {
                            const responseBody = new ResponseEntity({ errors: errorMessage });
                            message = new Message(MessageType.RESPONSE, 'ERROR', responseBody);
                        }
                        sendData(socket, message, type);
                        return;
                    }
                    return descriptorFn.call(this, message, socket);
                };
                validator.validate(message, 'message', callback);
            },
        };
    };
};


