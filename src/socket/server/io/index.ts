import io, { Server, ServerOptions } from 'socket.io';
import { ISocketMiddleware, SocketMiddleware } from '../../middleware/middleware';
import { SocketRunnable, SocketServer, SocketType } from '../types';
import { API_CONTAINER } from '../../decorator/api';

export class IOSocketServer extends SocketServer<Server, ServerOptions> implements SocketRunnable {

    constructor(port: number,
                config: ServerOptions,
                heartbeatRate?,
                middleware: ISocketMiddleware<Server> = new SocketMiddleware(API_CONTAINER, true, SocketType.IO)) {
        super(port, config, heartbeatRate, middleware);
    }

    run() {
        this.socket = io(this.port, this.config);
        this.heartbeatRate && this.enableHeartbeat(this.heartbeatRate);
        this.middleware.socketServer = this.socket;
        this.socket.on('connection', (socket: any) => {
            if (this.middleware) {
                this.middleware.onConnect(socket);
                this.middleware.applyApi(socket);
            }
        });
        console.log('Socket server started successfully');
    }

    shutdown() {
        super.shutdown();
    }
}
