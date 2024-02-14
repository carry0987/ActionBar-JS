export interface OnLoadCallback {
    (actionBar: any): void;
}

export interface OnActionCallback {
    (button?: HTMLButtonElement): void;
}

export interface ActionBarOption {
    countMsg: string;
    countPlaceholder: string;
    hideButton: string[];
    template?: string | Element;
    styles: object;
    customButton: Array<{ name: string; icon: string; callback: Function }>;
    onLoad?: OnLoadCallback;
    onClear?: OnActionCallback;
    onSelectAll?: OnActionCallback;
    onRestore?: OnActionCallback;
    onMove?: OnActionCallback;
    onDelete?: OnActionCallback;
}

export interface ActionBarCallback {
    onClear: OnActionCallback;
    onSelectAll: OnActionCallback;
    onRestore: OnActionCallback;
    onMove: OnActionCallback;
    onDelete: OnActionCallback;
}

export interface ActionBarButtons {
    [key: string]: HTMLButtonElement | null
}

export enum Action {
    CLEAR = 'clear',
    SELECT_ALL = 'selectAll',
    RESTORE = 'restore',
    MOVE = 'move',
    DELETE = 'delete'
}
