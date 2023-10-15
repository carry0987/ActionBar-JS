import Util from './util';
import reportInfo from './report';
import './actionBar.css';

class ActionBar {
    constructor(option = {}) {
        this.init(option, ActionBar.instance.length);
        ActionBar.instance.push(this);

        if (ActionBar.instance.length === 1) reportInfo(`ActionBar is loaded, version: ${ActionBar.version}`);
    }

    static defaultOption = {
        countMsg: 'Selected (:num) items',
        countPlaceholder: '(:num)',
        hideButton: [],
        template: null,
        styles: {},
        customButton: [], // [{'name': '', 'icon': html, 'callback': function(){} }]
        onLoad: null,
        onClear: null,
        onSelectAll: null,
        onRestore: null,
        onMove: null,
        onDelete: null
    };

    static instance = [];
    static version = '__version__';
    static get CLEAR() { return 'clear'; }
    static get SELECT_ALL() { return 'selectAll'; }
    static get RESTORE() { return 'restore'; }
    static get MOVE() { return 'move'; }
    static get DELETE() { return 'delete'; }

    /**
     * Initializes the plugin
     */
    init(option, id) {
        let tpl, container, button = {};
        this.id = id;
        this.option = Util.deepMerge({}, ActionBar.defaultOption, option);
        tpl = Util.getTemplate(this.option?.template, id);

        // Inject stylesheet
        if (this.option?.styles && Object.keys(this.option.styles).length > 0) {
            let styles = Util.deepMerge({}, this.option.styles);
            Util.injectStylesheet(styles, id);
        }

        // Put template to container
        if (!Util.getElem('.action-bar-container')) {
            document.body.insertAdjacentHTML('beforeend', '<div class="action-bar-container"></div>');
        }
        container = Util.getElem('.action-bar-container');
        container.insertAdjacentHTML('beforeend', tpl);
        this.element = Util.getElem('.action-bar-' + id);

        // Call onLoad function
        if (this.option?.onLoad) this.option.onLoad();

        // Get button
        button.clear = Util.getElem('.action-button.clear', this.element);
        button.selectAll = Util.getElem('.action-button.selectAll', this.element);
        button.restore = Util.getElem('.action-button.restore', this.element);
        button.move = Util.getElem('.action-button.move', this.element);
        button.delete = Util.getElem('.action-button.delete', this.element);

        // Hide button
        if (this.option?.hideButton && this.option.hideButton.length > 0) {
            let hideButton = Array.isArray(this.option.hideButton) ? this.option.hideButton : [this.option.hideButton];
            hideButton.forEach((value) => {
                if (!button[value]) return;
                button[value].style.display = 'none';
            });
        }

        button.clear.addEventListener('click', () => {
            if (button.clear.style.display === 'none') return;
            if (this.option?.onClear) this.option.onClear(button.clear);
        });

        button.selectAll.addEventListener('click', () => {
            if (button.selectAll.style.display === 'none') return;
            if (this.option?.onSelectAll) this.option.onSelectAll(button.selectAll);
        });

        button.restore.addEventListener('click', () => {
            if (button.restore.style.display === 'none') return;
            if (this.option?.onRestore) this.option.onRestore(button.restore);
        });

        button.move.addEventListener('click', () => {
            if (button.move.style.display === 'none') return;
            if (this.option?.onMove) this.option.onMove(button.move);
        });

        button.delete.addEventListener('click', () => {
            if (button.delete.style.display === 'none') return;
            if (this.option?.onDelete) this.option.onDelete(button.delete);
        });

        // Custom buttons
        if (this.option?.customButton && this.option.customButton.length > 0) {
            let buttonArea = Util.getElem('.action-buttons', this.element);
            this.option.customButton.forEach(({name, icon, callback}) => {
                Util.addCustomButton(name, icon, callback, buttonArea);
                // Check if the custom button is in hideButton array
                if (this.option?.hideButton.includes(name)) {
                    button.style.display = 'none';
                }
            });
        }

        return this;
    }

    target() {
        return this.element;
    }

    show() {
        const actionBar = this.element;
        if (actionBar) {
            actionBar.parentNode.style.display = 'block';
        }
        return this;
    }

    hide() {
        const actionBar = this.element;
        if (actionBar) {
            actionBar.parentNode.style.display = 'none';
        }
        return this;
    }

    updateCountNumber(count) {
        let selectedCount = Util.getElem('.selected-count', this.element);
        let countMsg = this.option.countMsg;
        let countPlaceholder = this.option.countPlaceholder;
        if (selectedCount) {
            selectedCount.innerHTML = countMsg.replace(countPlaceholder, count);
        }
        return this;
    }

    enableButton(button) {
        Util.modifyButtonState(button, false, this.element);
        return this;
    }

    disableButton(button) {
        Util.modifyButtonState(button, true, this.element);
        return this;
    }

    doAction(action) {
        switch (action) {
            case ActionBar.CLEAR:
                this.option?.onClear && this.option.onClear();
                break;
            case ActionBar.SELECT_ALL:
                this.option?.onSelectAll && this.option.onSelectAll();
                break;
            case ActionBar.RESTORE:
                this.option?.onRestore && this.option.onRestore();
                break;
            case ActionBar.MOVE:
                this.option?.onMove && this.option.onMove();
                break;
            case ActionBar.DELETE:
                this.option?.onDelete && this.option.onDelete();
                break;
            default:
                break;
        }
        return this;
    }

    onClear(func) {
        this.option.onClear = func;
        return this;
    }

    onSelectAll(func) {
        this.option.onSelectAll = func;
        return this;
    }

    onRestore(func) {
        this.option.onRestore = func;
        return this;
    }

    onMove(func) {
        this.option.onMove = func;
        return this;
    }

    onDelete(func) {
        this.option.onDelete = func;
        return this;
    }

    getButtonList() {
        return [
            ActionBar.CLEAR,
            ActionBar.SELECT_ALL,
            ActionBar.RESTORE,
            ActionBar.MOVE,
            ActionBar.DELETE
        ];
    }

    destroy() {
        Util.removeStylesheet(this.id);
        let container = Util.getElem('.action-bar-container');
        if (container) container.removeChild(this.element.parentNode);
        ActionBar.instance.splice(this.id, 1);
        return this;
    }
}

export default ActionBar;
