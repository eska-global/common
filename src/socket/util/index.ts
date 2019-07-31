import { Listeners } from '../server/types';

export const initSocketListeners = (listeners: Listeners, socket: any) => {
    listeners.length && listeners.forEach(listener => socket.on(listener.channel, listener.executor));
};
