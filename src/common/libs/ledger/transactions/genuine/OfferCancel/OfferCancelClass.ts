import { get, isUndefined } from 'lodash';

import BaseTransaction from '@common/libs/ledger/transactions/genuine/BaseTransaction';

/* Types ==================================================================== */

import { TransactionJSONType, TransactionTypes } from '@common/libs/ledger/types';

/* Class ==================================================================== */
class OfferCancel extends BaseTransaction {
    public static Type = TransactionTypes.OfferCancel as const;
    public readonly Type = OfferCancel.Type;

    constructor(tx?: TransactionJSONType, meta?: any) {
        super(tx, meta);

        // set transaction type if not set
        if (isUndefined(this.TransactionType)) {
            this.TransactionType = OfferCancel.Type;
        }

        this.fields = this.fields.concat(['OfferSequence', 'OfferID']);
    }

    get OfferSequence(): number {
        return get(this, ['tx', 'OfferSequence']);
    }

    get OfferID(): string {
        const OfferID = get(this, ['tx', 'OfferID'], undefined);

        if (isUndefined(OfferID)) {
            return undefined;
        }

        return OfferID;
    }
}

/* Export ==================================================================== */
export default OfferCancel;
