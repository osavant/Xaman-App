import {
    TransactionJSONType,
    SubmitResultType,
    SignedObjectType,
    TransactionTypes,
    PseudoTransactionTypes,
} from '../ledger/types';

export interface PayloadType {
    meta: MetaType;
    application: ApplicationType;
    payload: PayloadReferenceType;
    response?: ResponseType;
}

export interface ApplicationType {
    name: string;
    description: string;
    disabled?: number;
    uuidv4?: string;
    icon_url: string;
}

export interface MetaType {
    generated?: boolean;
    exists?: boolean;
    uuid?: string;
    multisign?: boolean;
    submit: boolean;
    patch?: boolean;
    destination?: string;
    resolved?: boolean;
    signed?: boolean;
    cancelled?: boolean;
    expired?: boolean;
    pushed?: boolean;
    app_opened?: boolean;
    return_url_app?: string;
    return_url_web?: string;
    custom_instruction?: string;
    signers?: string[];
    pathfinding?: boolean;
    pathfinding_fallback?: boolean;
    force_network?: string;
}

export interface PayloadReferenceType {
    tx_type: TransactionTypes | PseudoTransactionTypes;
    tx_destination?: string;
    tx_destination_tag?: any;
    request_json: TransactionJSONType;
    created_at?: string;
    expires_at?: string;
    hash?: string;
}

export interface ResponseType {
    hex: null;
    txid: null;
    resolved_at: null;
    dispatched_to: null;
    dispatched_result: null;
    multisign_account: null;
    account: null;
}

export interface PatchSuccessType {
    signed_blob: string;
    tx_id: string;
    signmethod: 'PIN' | 'BIOMETRIC' | 'PASSPHRASE' | 'TANGEM' | 'OTHER';
    signpubkey: string;
    multisigned: string;
    permission?: Permission;
    origintype?: PayloadOrigin;
    environment: Environment;
}

export interface PatchSubmitType {
    dispatched?: Dispatched;
}

export interface PatchRejectType {
    reject: boolean;
}

export interface Environment {
    nodeuri: string;
    nodetype: string;
}

export interface Dispatched {
    to: string;
    nodetype: string;
    result: string;
}

export interface Permission {
    push: boolean;
    days: number;
}

export interface PayloadSubmitResult {
    submitted: boolean;
    submitResult?: SubmitResultType;
    signedObject: SignedObjectType;
}

export enum PayloadOrigin {
    QR = 'QR',
    DEEP_LINK = 'DEEP_LINK',
    PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    EVENT_LIST = 'EVENT_LIST',
    XAPP = 'XAPP',
    UNKNOWN = 'UNKNOWN',
}

export enum XAppOrigin {
    XAPP_STORE = 'XAPP_STORE',
    XAPP_SHORT_LIST = 'XAPP_SHORT_LIST',

    QR = 'QR',
    DEEP_LINK = 'DEEP_LINK',
    PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    EVENT_LIST = 'EVENT_LIST',
    TRANSACTION_MEMO = 'TRANSACTION_MEMO',

    IMPORT_ACCOUNT = 'IMPORT_ACCOUNT',
    XUMM = 'XUMM',
    UNKNOWN = 'UNKNOWN',
}
