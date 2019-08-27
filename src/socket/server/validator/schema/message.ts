export const HEADER_MESSAGE_SCHEMA = {
    id: 'HEADERS',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        type: {
            type: 'number'
        }
    },
    required: ['id', 'type']
};

export const MESSAGE_SCHEMA = {
    id: 'message',
    type: 'object',
    properties: {
        code: {
            type: 'string'
        },
        headers: {
            $ref: 'HEADERS'
        },
        body: {
            type: 'object'
        }
    },
    required: ['code', 'headers', 'body']
};
