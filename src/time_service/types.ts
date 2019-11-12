export interface TimeService {
    getTime(): number;
}

export type Configuration = {
    path?: string;
    protocol?: string;
    host?: string;
    port?: string;
};
