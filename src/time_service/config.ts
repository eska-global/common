export class Config {
    PATH: string;
    PROTOCOL: string;
    HOST: string;
    PORT: string;

    constructor() {
        this.PATH = process.env.TIME_SERVER_PATH || 'getTime';
        this.PROTOCOL = process.env.TIME_SERVER_PROTOCOL || 'http';
        this.HOST = process.env.TIME_SERVER_HOST || '0.0.0.0';
        this.PORT = process.env.TIME_SERVER_PORT || '7015';
    }

    get url(): string {
        return `${this.PROTOCOL}://${this.HOST}:${this.PORT}/${this.PATH}`;
    }
}
