/**
 * Network Model
 */

import Realm from 'realm';

import { Amendments } from '@common/constants';

import { NetworkSchema } from '@store/models/schemas/latest';

/* Dictionary  ==================================================================== */
interface NativeAsset extends Realm.Dictionary {
    asset: string;
    icon: string;
    iconSquare: string;
}
/* Model  ==================================================================== */
class Network extends Realm.Object<Network> {
    public static schema: Realm.ObjectSchema = NetworkSchema.schema;

    public id: number;
    public key: string;
    public name: string;
    public color: string;
    public type: string;
    public nativeAsset: NativeAsset;
    public baseReserve: number;
    public ownerReserve: number;
    public defaultNode: any;
    public nodes: any[];
    public amendments?: string[];
    public definitionsString?: string;
    public registerAt?: Date;
    public updatedAt?: Date;

    public isFeatureEnabled(amendment: keyof typeof Amendments): boolean {
        return this.amendments.indexOf(Amendments[amendment]) > -1;
    }

    get definitions(): Record<string, any> {
        if (this.definitionsString) {
            return JSON.parse(this.definitionsString);
        }

        return undefined;
    }

    set definitions(data: Record<string, any>) {
        this.definitionsString = JSON.stringify(data);
    }
}

export default Network;
