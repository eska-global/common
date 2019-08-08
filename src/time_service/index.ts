import fetch from 'node-fetch';
import { config } from '../time_service/config';

interface TimeService {
    getTime(date: Date): Promise<number>;
}

// TODO calc delivery time for request
export class TimeServiceClient implements TimeService {
    async getTime(): Promise<number> {
        return await fetch(config.url)
        .then(data => data.json())
        .then(data => data.currentTime)
        .catch(error => {
           return Date.now();
        });
    }
}

export default new TimeServiceClient();
