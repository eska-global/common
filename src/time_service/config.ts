import { Configuration } from '../time_service/types';

export class Config {
    path: string;
    protocol: string;
    host: string;
    port: string;

    constructor(configuration: Configuration = {}) {
        this.path = configuration.path || 'getTime';
        this.protocol = configuration.protocol || 'http';
        this.host = configuration.host || '0.0.0.0';
        this.port = configuration.port || '7015';
    }

    get url(): string {
        return `${this.protocol}://${this.host}:${this.port}/${this.path}`;
    }
}
