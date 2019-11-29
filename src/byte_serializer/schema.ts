class Schema {
    storeScheme: Map<any, Object>;

    constructor() {
        this.storeScheme = new Map();
    }

    add(schemaId: any, scheme: Object) {
        if (!this.storeScheme.has(schemaId)) {
            this.storeScheme.set(schemaId, scheme);
            return true;
        }
        return false;
    }

    get(schemaId: any): Object {
        return this.storeScheme.get(schemaId);
    }
}

export const schemaStore = new Schema();
