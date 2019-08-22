import { SocketRunnable, SocketServer, SocketType } from '../../server/types';
import WebSocket, { Server, ServerOptions } from 'ws';
import { DefaultSocketMiddleware as SocketMiddleware, ISocketMiddleware } from '../../middleware/middleware';
import { API_CONTAINER } from '../../decorator/api';
import { SYSTEM_HEALTH_SOCKET_CHANNEL } from '../../config/config';
import { Message, MessageType } from '../../model/message';
import { Heartbeat } from '../../model/heartbeat';

export class WebSocketServer extends SocketServer<Server, ServerOptions> implements SocketRunnable {

    constructor(port: number,
                config: ServerOptions = {},
                heartbeatRate?: number,
                middleware: ISocketMiddleware<Server> = new SocketMiddleware(API_CONTAINER, true, SocketType.WEB)) {
        super(port, config, heartbeatRate, middleware);
    }

    // TODO: split heartbeat. create separated channel for that
    protected enableHeartbeat(heartbeatRate: number) {
        this.heartbeatJob = setInterval(() => {
            const heartbeatData = new Heartbeat();
            const heartbeatMessage = new Message(MessageType.EVENT, SYSTEM_HEALTH_SOCKET_CHANNEL, heartbeatData);
            this.socket.clients.forEach(client => client.send(JSON.stringify(heartbeatMessage)));
        }, heartbeatRate);
    }

    run() {
        this.socket = new WebSocket.Server({ port: this.port, ...this.config });
        super.run();
    }

    shutdown() {
        super.shutdown();
    }
}

