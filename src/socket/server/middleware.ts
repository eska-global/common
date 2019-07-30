export interface ISocketMiddleware {
    onConnect(socket: any);

    registerApi(socket: any);
}
