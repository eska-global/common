import fetch from 'node-fetch';
import { TimeService } from '../time_service/types';
import { Config } from '../time_service/config';

export class TimeServiceClient implements TimeService {

    config?: Config;
    private timeDifference: number;

    constructor( config?: Config ) {
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
        return await fetch(this.config.url)
        .then(data => data.json())
        .then(data => data.currentTime)
        .catch(error => {
           return Date.now();
        });
    }
}

export default new TimeServiceClient();
