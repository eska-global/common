# create config
# example config


```typescript

import schemaStore from './schema';
import { BufferTypes } from './types';

export enum SchemaName {
    request = 0,
    shortPeerInfo = 1,
    headers = 2,
}

schemaStore.add(SchemaName.request, {
    code: new BufferTypes.Utf8(),
    data: new BufferTypes.Buffer(),
});

schemaStore.add(SchemaName.shortPeerInfo, {
    ip: new BufferTypes.Utf8(),
    port: new BufferTypes.Uint8(),
    peerCount: new BufferTypes.Uint16(),
});


schemaStore.add(SchemaName.headers, {
    height: new BufferTypes.Uint32(),
    broadhash: new BufferTypes.Utf8(),
    peerCount: new BufferTypes.Uint16()
});


```
