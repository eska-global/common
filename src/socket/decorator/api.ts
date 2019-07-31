import { ApiContainer } from '../server/types';

export const API_CONTAINER: ApiContainer = {};

export const API = (apiName: string) => {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        let fn = descriptor.value;
        return {
            configurable: true,

            get() {
                let boundFn = fn.bind(this);
                Reflect.defineProperty(this, propertyKey, {
                    value: boundFn,
                    configurable: true,
                    writable: true
                });

                API_CONTAINER[apiName] = boundFn;

                return function () {
                    return boundFn.apply(this, arguments);
                };
            }
        };
    };
};


