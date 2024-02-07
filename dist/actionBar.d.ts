interface OnLoadCallback {
    (actionBar: any): void;
}
interface OnActionCallback {
    (button?: HTMLButtonElement): void;
}
interface ActionBarOption {
    countMsg?: string;
    countPlaceholder?: string;
    hideButton?: string[];
    template?: string | Element;
    styles?: object;
    customButton?: Array<{
        name: string;
        icon: string;
        callback: Function;
    }>;
    onLoad?: OnLoadCallback;
    onClear?: OnActionCallback;
    onSelectAll?: OnActionCallback;
    onRestore?: OnActionCallback;
    onMove?: OnActionCallback;
    onDelete?: OnActionCallback;
}
declare enum Action {
    CLEAR = "clear",
    SELECT_ALL = "selectAll",
    RESTORE = "restore",
    MOVE = "move",
    DELETE = "delete"
}

declare class ActionBar {
    private static instances;
    private static version;
    private static firstLoad;
    private options;
    private id;
    private element;
    constructor(option?: ActionBarOption);
    /**
     * Initializes the plugin
     */
    private init;
    private injectStyles;
    private initializeButtonEventListeners;
    private addCustomButtonsIfExists;
    target(): HTMLElement | null;
    show(): ActionBar;
    hide(): ActionBar;
    updateCountNumber(count: number): ActionBar;
    enableButton(buttonName: string): ActionBar;
    disableButton(buttonName: string): ActionBar;
    doAction(action: Action): ActionBar;
    onClear(callback: OnActionCallback): ActionBar;
    onSelectAll(callback: OnActionCallback): ActionBar;
    onRestore(callback: OnActionCallback): ActionBar;
    onMove(callback: OnActionCallback): ActionBar;
    onDelete(callback: OnActionCallback): ActionBar;
    static getButtonList(): Action[];
    destroy(): ActionBar;
    static get CLEAR(): Action;
    static get SELECT_ALL(): Action;
    static get RESTORE(): Action;
    static get MOVE(): Action;
    static get DELETE(): Action;
}

export { ActionBar as default };
