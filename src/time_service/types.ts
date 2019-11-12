export interface ITimeServiceClient {
    getTime(): number;
}

export type Configuration = {
    path?: string;
    protocol?: string;
    host?: string;
    port?: string;
};

export type TimeServiceResponse = {
    currentTime: number
};
