import io, { Server, ServerOptions } from 'socket.io';
import { ISocketMiddleware } from '../middleware';
import { initSocketListeners } from '../../util';
import { SocketRunnable, SocketServer } from '../types';

export class SocketIOServer extends SocketServer<Server, ServerOptions> implements SocketRunnable {

    constructor(port: number,
                config: ServerOptions,
                heartbeatRate: number = 0,
                middleware?: ISocketMiddleware<Server>) {
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
        console.log('Stopping socket server...');
        if (this.socket) {
            clearInterval(this.heartbeatJob);
            this.socket.close();
            console.log('Socket server stopped successfully');
        }
    }
}
