interface OnLoadCallback {
    (actionBar: any): void;
}
interface OnActionCallback {
    (button?: HTMLButtonElement): void;
}
interface ActionBarOption {
    countMsg: string;
    countPlaceholder: string;
    hideButton: string[];
    template?: string | Element;
    styles: object;
    customButton: Array<{
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
interface ActionBarCallback {
    onClear: OnActionCallback;
    onSelectAll: OnActionCallback;
    onRestore: OnActionCallback;
    onMove: OnActionCallback;
    onDelete: OnActionCallback;
}
interface ActionBarButtons {
    [key: string]: HTMLButtonElement | null;
}

type interfaces_ActionBarButtons = ActionBarButtons;
type interfaces_ActionBarCallback = ActionBarCallback;
type interfaces_ActionBarOption = ActionBarOption;
type interfaces_OnActionCallback = OnActionCallback;
type interfaces_OnLoadCallback = OnLoadCallback;
declare namespace interfaces {
  export type { interfaces_ActionBarButtons as ActionBarButtons, interfaces_ActionBarCallback as ActionBarCallback, interfaces_ActionBarOption as ActionBarOption, interfaces_OnActionCallback as OnActionCallback, interfaces_OnLoadCallback as OnLoadCallback };
}

declare const Action: {
    readonly CLEAR: "clear";
    readonly SELECT_ALL: "selectAll";
    readonly RESTORE: "restore";
    readonly MOVE: "move";
    readonly DELETE: "delete";
};

declare class ActionBar {
    private static instances;
    private static version;
    private static firstLoad;
    private options;
    private id;
    private element;
    constructor(option: Partial<ActionBarOption>);
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
    doAction(action: (typeof Action)[keyof typeof Action]): ActionBar;
    onClear(callback: OnActionCallback): ActionBar;
    onSelectAll(callback: OnActionCallback): ActionBar;
    onRestore(callback: OnActionCallback): ActionBar;
    onMove(callback: OnActionCallback): ActionBar;
    onDelete(callback: OnActionCallback): ActionBar;
    static getButtonList(): ("clear" | "selectAll" | "restore" | "move" | "delete")[];
    destroy(): ActionBar;
    static get CLEAR(): "clear";
    static get SELECT_ALL(): "selectAll";
    static get RESTORE(): "restore";
    static get MOVE(): "move";
    static get DELETE(): "delete";
}

export { Action, ActionBar, interfaces as ActionBarInterface };
