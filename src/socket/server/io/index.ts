import io, { Server, ServerOptions } from 'socket.io';
import { DefaultSocketMiddleware as SocketMiddleware, ISocketMiddleware } from '../../middleware/middleware';
import { SocketRunnable, SocketServer, SocketType } from '../types';
import { API_CONTAINER } from '../../decorator/api';

export class IOSocketServer extends SocketServer<Server, ServerOptions> implements SocketRunnable {

    constructor(port: number,
                config: ServerOptions,
                heartbeatRate?: number,
                middleware: ISocketMiddleware<Server> = new SocketMiddleware(API_CONTAINER, true, SocketType.IO)) {
        super(port, config, heartbeatRate, middleware);
    }

    run() {
        this.socket = io(this.port, this.config);
        super.run();
    }

    shutdown() {
        super.shutdown();
    }
}
