import fetch, { AxiosResponse } from 'axios';
import { Config } from '../time_service/config';
import { ITimeServiceClient, TimeServiceResponse } from 'src/time_service/types';

// TODO calc delivery time for request
export class TimeServiceClient implements ITimeServiceClient {

    config?: Config;
    private timeDifference: number;

    constructor(config?: Config) {
        this.config = config || new Config();
        this.timeDifference = 0;
        this.init();
    }

    private init(): void {
        this.getTimeFromServer().then((networkTime: number) => {
            this.timeDifference = networkTime - Date.now();
        });
    }

    getTime(): number {
        return Date.now() + this.timeDifference;
    }

    async getTimeFromServer(): Promise<number> {
        try {
            const response: AxiosResponse<TimeServiceResponse> = await fetch(this.config.url);
            return response.data.currentTime;
        } catch (e) {
            return Date.now();
        }
    }
}

export default new TimeServiceClient();
