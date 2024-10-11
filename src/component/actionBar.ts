import { defaults, Action } from '@/component/config';
import Utils from '@/module/utils-ext';
import reportInfo from '@/module/report';
import { OnActionCallback, ActionBarOption, ActionBarCallback, ActionBarButtons } from '@/interface/interfaces';

class ActionBar {
    private static instances: ActionBar[] = [];
    private static version: string = '__version__';
    private static firstLoad: boolean = true;
    private options: ActionBarOption = defaults;
    private id: number = 0;
    private element: HTMLDivElement | null = null;

    constructor(option: Partial<ActionBarOption>) {
        this.init(option, ActionBar.instances.length);
        ActionBar.instances.push(this);

        if (ActionBar.instances.length === 1 && ActionBar.firstLoad === true) {
            reportInfo(`ActionBar is loaded, version: ${ActionBar.version}`);
        }

        // Set firstLoad flag to false
        ActionBar.firstLoad = false;
    }

    /**
     * Initializes the plugin
     */
    private init(option: Partial<ActionBarOption>, id: number) {
        let tpl: string;
        let container: HTMLDivElement;
        let button: ActionBarButtons = {};
        this.id = id;
        this.options = Utils.deepMerge({} as ActionBarOption, defaults, option);
        tpl = Utils.getTemplate(id, this.options.template);

        // Inject stylesheet
        this.injectStyles();

        // Put template to container
        const actionBarContainerElem = Utils.getElem('.action-bar-container');
        if (!actionBarContainerElem) {
            document.body.insertAdjacentHTML('beforeend', '<div class="action-bar-container"></div>');
        }
        container = Utils.getElem('.action-bar-container') as HTMLDivElement;
        container.insertAdjacentHTML('beforeend', tpl);
        this.element = Utils.getElem<HTMLDivElement>(`.action-bar-${id}`);

        // Call onLoad function
        this.options.onLoad?.(this);

        // Get button
        button.clear = Utils.getElem<HTMLButtonElement>('.action-button.clear', this.element);
        button.selectAll = Utils.getElem<HTMLButtonElement>('.action-button.selectAll', this.element);
        button.restore = Utils.getElem<HTMLButtonElement>('.action-button.restore', this.element);
        button.move = Utils.getElem<HTMLButtonElement>('.action-button.move', this.element);
        button.delete = Utils.getElem<HTMLButtonElement>('.action-button.delete', this.element);

        // Process hideButton option
        this.options.hideButton?.forEach((buttonName) => {
            const buttonElem = button[buttonName];
            if (buttonElem) buttonElem.style.display = 'none';
        });

        // Initialize event listeners for buttons
        this.initializeButtonEventListeners(button);

        // Add custom buttons if they are provided in options
        this.addCustomButtonsIfExists();

        return this;
    }

    private injectStyles(): void {
        // Inject stylesheet
        let styles = {};
        if (this.options?.styles && Object.keys(this.options.styles).length > 0) {
            styles = Utils.deepMerge({}, this.options.styles, styles);
        }
        styles && Utils.injectStylesheet(styles, this.id.toString());
    }

    private initializeButtonEventListeners(button: ActionBarButtons): void {
        // Add event listeners for predefined action buttons
        Object.entries(button).forEach(([buttonName, buttonElem]) => {
            if (!buttonElem) return;
            buttonElem.addEventListener('click', () => {
                if (buttonElem.style.display === 'none') return;
                const callbackName =
                    `on${buttonName.charAt(0).toUpperCase() + buttonName.slice(1)}` as keyof ActionBarCallback;
                this.options[callbackName]?.(buttonElem);
            });
        });
    }

    private addCustomButtonsIfExists(): void {
        if (!this.options.customButton || this.options.customButton.length === 0) return;

        const buttonArea = Utils.getElem('.action-buttons', this.element) as HTMLElement;
        this.options.customButton.forEach(({ name, icon, callback }) => {
            const customButtonElem = Utils.addCustomButton(name, icon, callback, buttonArea) as HTMLButtonElement;
            // Check if the custom button is in hideButton array and hide it if necessary
            if (this.options.hideButton?.includes(name)) {
                customButtonElem.style.display = 'none';
            }
        });
    }

    public target(): HTMLElement | null {
        return this.element;
    }

    public show(): ActionBar {
        if (this.element && this.element.parentNode) {
            (this.element.parentNode as HTMLElement).style.display = 'block';
        }

        return this;
    }

    public hide(): ActionBar {
        if (this.element && this.element.parentNode) {
            (this.element.parentNode as HTMLElement).style.display = 'none';
        }

        return this;
    }

    public updateCountNumber(count: number): ActionBar {
        const selectedCount = Utils.getElem('.selected-count', this.element);
        const countMsg = this.options.countMsg;
        const countPlaceholder = this.options.countPlaceholder;
        if (selectedCount && countMsg && countPlaceholder) {
            selectedCount.innerHTML = countMsg.replace(countPlaceholder, count.toString());
        }

        return this;
    }

    public enableButton(buttonName: string): ActionBar {
        Utils.modifyButtonState(buttonName, false, this.element);

        return this;
    }

    public disableButton(buttonName: string): ActionBar {
        Utils.modifyButtonState(buttonName, true, this.element);

        return this;
    }

    public doAction(action: (typeof Action)[keyof typeof Action]): ActionBar {
        switch (action) {
            case Action.CLEAR:
                this.options?.onClear?.();
                break;
            case Action.SELECT_ALL:
                this.options?.onSelectAll?.();
                break;
            case Action.RESTORE:
                this.options?.onRestore?.();
                break;
            case Action.MOVE:
                this.options?.onMove?.();
                break;
            case Action.DELETE:
                this.options?.onDelete?.();
                break;
            default:
                break;
        }

        return this;
    }

    public onClear(callback: OnActionCallback): ActionBar {
        this.options.onClear = callback;

        return this;
    }

    public onSelectAll(callback: OnActionCallback): ActionBar {
        this.options.onSelectAll = callback;

        return this;
    }

    public onRestore(callback: OnActionCallback): ActionBar {
        this.options.onRestore = callback;

        return this;
    }

    public onMove(callback: OnActionCallback): ActionBar {
        this.options.onMove = callback;

        return this;
    }

    public onDelete(callback: OnActionCallback): ActionBar {
        this.options.onDelete = callback;

        return this;
    }

    public static getButtonList() {
        return [Action.CLEAR, Action.SELECT_ALL, Action.RESTORE, Action.MOVE, Action.DELETE];
    }

    public destroy(): ActionBar {
        Utils.removeStylesheet(this.id.toString());
        if (this.element && this.element.parentElement) {
            const container = Utils.getElem('.action-bar-container');
            if (container) container.removeChild(this.element.parentElement);
        }
        const instanceIndex = ActionBar.instances.findIndex((inst) => inst.id === this.id);
        if (instanceIndex > -1) {
            ActionBar.instances.splice(instanceIndex, 1);
        }

        return this;
    }

    // Methods for external use
    static get CLEAR() {
        return Action.CLEAR;
    }
    static get SELECT_ALL() {
        return Action.SELECT_ALL;
    }
    static get RESTORE() {
        return Action.RESTORE;
    }
    static get MOVE() {
        return Action.MOVE;
    }
    static get DELETE() {
        return Action.DELETE;
    }
}

export { ActionBar };
