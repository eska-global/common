export class Heartbeat {

    isAlive: boolean;
    date: Date;

    constructor() {
        this.isAlive = true;
        this.date = new Date();
    }
}
