function throwError(message) {
    throw new Error(message);
}

function getElem(ele, mode, parent) {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string')
        return ele;
    let searchContext = document;
    if (mode === null && parent) {
        searchContext = parent;
    }
    else if (mode && mode instanceof Node && 'querySelector' in mode) {
        searchContext = mode;
    }
    else if (parent && parent instanceof Node && 'querySelector' in parent) {
        searchContext = parent;
    }
    // If mode is 'all', search for all elements that match, otherwise, search for the first match
    // Casting the result as E or NodeList
    return mode === 'all' ? searchContext.querySelectorAll(ele) : searchContext.querySelector(ele);
}
function createElem(tagName, attrs = {}, text = '') {
    let elem = document.createElement(tagName);
    for (let attr in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
            if (attr === 'textContent' || attr === 'innerText') {
                elem.textContent = attrs[attr];
            }
            else {
                elem.setAttribute(attr, attrs[attr]);
            }
        }
    }
    if (text)
        elem.textContent = text;
    return elem;
}

let stylesheetId = 'utils-style';
const replaceRule = {
    from: '.utils',
    to: '.utils-'
};
function isObject(item) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
}
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key;
                const value = source[sourceKey];
                const targetKey = key;
                if (isObject(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = {};
                    }
                    deepMerge(target[targetKey], value);
                }
                else {
                    target[targetKey] = value;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
}
function setStylesheetId(id) {
    stylesheetId = id;
}
function setReplaceRule(from, to) {
    replaceRule.from = from;
    replaceRule.to = to;
}
// CSS Injection
function injectStylesheet(stylesObject, id = null) {
    id = isEmpty(id) ? '' : id;
    // Create a style element
    let style = createElem('style');
    // WebKit hack
    style.id = stylesheetId + id;
    style.textContent = '';
    // Add the style element to the document head
    document.head.append(style);
    let stylesheet = style.sheet;
    for (let selector in stylesObject) {
        if (stylesObject.hasOwnProperty(selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}
function buildRules(ruleObject) {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }
    return ruleSet;
}
function compatInsertRule(stylesheet, selector, cssText, id = null) {
    id = isEmpty(id) ? '' : id;
    let modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
}
function removeStylesheet(id = null) {
    const styleId = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + stylesheetId + styleId);
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}
function isEmpty(str) {
    if (typeof str === 'number') {
        return false;
    }
    return !str || (typeof str === 'string' && str.length === 0);
}
function generateRandom(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

class Utils {
    static setStylesheetId = setStylesheetId;
    static setReplaceRule = setReplaceRule;
    static isEmpty = isEmpty;
    static deepMerge = deepMerge;
    static generateRandom = generateRandom;
    static injectStylesheet = injectStylesheet;
    static removeStylesheet = removeStylesheet;
    static getElem = getElem;
    static createElem = createElem;
    static throwError = throwError;
    static getTemplate = function (id, tpl) {
        id = id.toString();
        let html = `
        <div style="display:none">
            <div class="action-bar action-bar-${id}">
                <div class="selected-count"></div>
                <div class="action-buttons">
                    <button class="action-button clear" title="Clear" aria-label="Clear Selection">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                        </svg>
                    </button>
                    <button class="action-button selectAll" title="SelectAll" aria-label="Select All">
                        <svg width="22px" height="22px" viewBox="0 0 448 512">
                            <path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z"></path>
                        </svg>
                    </button>
                    <button class="action-button restore" title="Restore" aria-label="Restore">
                        <svg width="24px" height="24px" viewBox="0 0 1024 1024">
                            <path d="M512 768q88 0 151-63t63-151-63-150-151-62q-116 0-180 98l-54-56v170h170l-68-68q16-32 55-56t77-24q62 0 106 43t44 105-44 106-106 44q-78 0-122-64h-74q24 58 77 93t119 35zM598 86l256 256v512q0 34-26 59t-60 25h-512q-34 0-60-25t-26-59l2-684q0-34 25-59t59-25h342z"></path>
                        </svg>
                    </button>
                    <button class="action-button move" title="Move" aria-label="Move">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zm-8.01-9l-1.41 1.41L12.16 12H8v2h4.16l-1.59 1.59L11.99 17 16 13.01 11.99 9z"></path>
                        </svg>
                    </button>
                    <button class="action-button delete" title="Delete" aria-label="Delete">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        `;
        if (tpl) {
            let template = getElem(tpl);
            if (!template)
                throwError('Template not found');
            html = `<div style="display:none"><div class="action-bar action-bar-${id}">`;
            html += template.innerHTML;
            html += `</div></div>`;
        }
        return html;
    };
    static modifyButtonState(buttons, state, element) {
        if (!element)
            return;
        // Check if buttons is an array otherwise convert it to an array
        buttons = Array.isArray(buttons) ? buttons : [buttons];
        buttons.forEach((buttonSelector) => {
            let actionButton = getElem('.action-button.' + buttonSelector, element);
            if (actionButton)
                this.toggleDisableStatus(actionButton, state);
        });
    }
    static toggleDisableStatus(ele, disabled) {
        if (disabled) {
            ele.disabled = true;
            ele.setAttribute('disabled', 'disabled');
        }
        else {
            ele.disabled = false;
            ele.removeAttribute('disabled');
        }
    }
    /**
     * Add custom button
     *
     * @param {string} name Name of button
     * @param {string} icon Icon of button
     * @param {function} callback Callback function to be called on clicking the button
     * @returns HTMLButtonElement
     */
    static addCustomButton(name, icon, callback, buttonArea) {
        if (typeof callback !== 'function') {
            throwError('callback should be a function');
        }
        const button = createElem('button');
        button.className = `action-button custom ${name}`;
        button.title = name;
        button.innerHTML = icon;
        buttonArea.appendChild(button);
        button.addEventListener('click', () => {
            if (button.style.display === 'none')
                return;
            callback(button);
        });
        return button;
    }
}
Utils.setStylesheetId('actionbar-style');
Utils.setReplaceRule('.action-bar', '.action-bar-');

var Action;
(function (Action) {
    Action["CLEAR"] = "clear";
    Action["SELECT_ALL"] = "selectAll";
    Action["RESTORE"] = "restore";
    Action["MOVE"] = "move";
    Action["DELETE"] = "delete";
})(Action || (Action = {}));

const reportInfo = (vars, showType = false) => {
    if (showType === true) {
        console.log('Data Type : ' + typeof vars, '\nValue : ' + vars);
    }
    else if (typeof showType !== 'boolean') {
        console.log(showType);
    }
    else {
        console.log(vars);
    }
};

const defaults = {
    countMsg: 'Selected (:num) items',
    countPlaceholder: '(:num)',
    hideButton: [],
    template: undefined,
    styles: {},
    customButton: [],
    onLoad: undefined,
    onClear: undefined,
    onSelectAll: undefined,
    onRestore: undefined,
    onMove: undefined,
    onDelete: undefined
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* Action Bar */\n.action-bar-container {\n    position: fixed;\n    top: 0;\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    z-index: 100;\n}\n\n.action-bar {\n    width: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 12px 12px;\n    color: white;\n    background-color: #4285f4;\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n    border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.action-bar .selected-count {\n    font-size: 14px;\n    margin-left: 20px;\n}\n\n.action-bar button {\n    margin: 0 10px;\n    background-color: transparent;\n    border: none;\n    color: #fff;\n    font-size: 14px;\n    cursor: pointer;\n}\n\n.action-bar .action-buttons {\n    display: flex;\n    background-color: transparent;\n}\n\n.action-bar .action-button {\n    width: 40px;\n    height: 40px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-direction: column;\n    background-color: transparent;\n    border: none;\n    border-radius: 50%;\n    cursor: pointer;\n    transition: background-color 0.3s ease;\n}\n\n.action-bar .action-button:not([disabled]):hover {\n    background-color: #fff;\n    text-decoration: none;\n}\n\n.action-bar .action-button:not([disabled]) svg {\n    fill: #fff;\n}\n\n.action-bar .action-button:not([disabled]):hover svg {\n    fill: #4285f4;\n}\n\n.action-bar .action-button[disabled] {\n    background-color: rgba(255, 255, 255, 0.5);\n    cursor: not-allowed;\n}\n\n.action-bar .action-button[disabled] svg {\n    fill: #969696;\n}\n";
styleInject(css_248z);

class ActionBar {
    static instances = [];
    static version = '2.0.1';
    static firstLoad = true;
    options = defaults;
    id = 0;
    element = null;
    constructor(option) {
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
    init(option, id) {
        let tpl;
        let container;
        let button = {};
        this.id = id;
        this.options = Utils.deepMerge({}, defaults, option);
        tpl = Utils.getTemplate(id, this.options.template);
        // Inject stylesheet
        this.injectStyles();
        // Put template to container
        const actionBarContainerElem = Utils.getElem('.action-bar-container');
        if (!actionBarContainerElem) {
            document.body.insertAdjacentHTML('beforeend', '<div class="action-bar-container"></div>');
        }
        container = Utils.getElem('.action-bar-container');
        container.insertAdjacentHTML('beforeend', tpl);
        this.element = Utils.getElem(`.action-bar-${id}`);
        // Call onLoad function
        this.options.onLoad?.(this);
        // Get button
        button.clear = Utils.getElem('.action-button.clear', this.element);
        button.selectAll = Utils.getElem('.action-button.selectAll', this.element);
        button.restore = Utils.getElem('.action-button.restore', this.element);
        button.move = Utils.getElem('.action-button.move', this.element);
        button.delete = Utils.getElem('.action-button.delete', this.element);
        // Process hideButton option
        this.options.hideButton?.forEach((buttonName) => {
            const buttonElem = button[buttonName];
            if (buttonElem)
                buttonElem.style.display = 'none';
        });
        // Initialize event listeners for buttons
        this.initializeButtonEventListeners(button);
        // Add custom buttons if they are provided in options
        this.addCustomButtonsIfExists();
        return this;
    }
    injectStyles() {
        // Inject stylesheet
        let styles = {};
        if (this.options?.styles && Object.keys(this.options.styles).length > 0) {
            styles = Utils.deepMerge({}, this.options.styles, styles);
        }
        styles && Utils.injectStylesheet(styles, this.id.toString());
    }
    initializeButtonEventListeners(button) {
        // Add event listeners for predefined action buttons
        Object.entries(button).forEach(([buttonName, buttonElem]) => {
            if (!buttonElem)
                return;
            buttonElem.addEventListener('click', () => {
                if (buttonElem.style.display === 'none')
                    return;
                const callbackName = `on${buttonName.charAt(0).toUpperCase() + buttonName.slice(1)}`;
                this.options[callbackName]?.(buttonElem);
            });
        });
    }
    addCustomButtonsIfExists() {
        if (!this.options.customButton || this.options.customButton.length === 0)
            return;
        const buttonArea = Utils.getElem('.action-buttons', this.element);
        this.options.customButton.forEach(({ name, icon, callback }) => {
            const customButtonElem = Utils.addCustomButton(name, icon, callback, buttonArea);
            // Check if the custom button is in hideButton array and hide it if necessary
            if (this.options.hideButton?.includes(name)) {
                customButtonElem.style.display = 'none';
            }
        });
    }
    target() {
        return this.element;
    }
    show() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.style.display = 'block';
        }
        return this;
    }
    hide() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.style.display = 'none';
        }
        return this;
    }
    updateCountNumber(count) {
        const selectedCount = Utils.getElem('.selected-count', this.element);
        const countMsg = this.options.countMsg;
        const countPlaceholder = this.options.countPlaceholder;
        if (selectedCount && countMsg && countPlaceholder) {
            selectedCount.innerHTML = countMsg.replace(countPlaceholder, count.toString());
        }
        return this;
    }
    enableButton(buttonName) {
        Utils.modifyButtonState(buttonName, false, this.element);
        return this;
    }
    disableButton(buttonName) {
        Utils.modifyButtonState(buttonName, true, this.element);
        return this;
    }
    doAction(action) {
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
        }
        return this;
    }
    onClear(callback) {
        this.options.onClear = callback;
        return this;
    }
    onSelectAll(callback) {
        this.options.onSelectAll = callback;
        return this;
    }
    onRestore(callback) {
        this.options.onRestore = callback;
        return this;
    }
    onMove(callback) {
        this.options.onMove = callback;
        return this;
    }
    onDelete(callback) {
        this.options.onDelete = callback;
        return this;
    }
    static getButtonList() {
        return [
            Action.CLEAR,
            Action.SELECT_ALL,
            Action.RESTORE,
            Action.MOVE,
            Action.DELETE
        ];
    }
    destroy() {
        Utils.removeStylesheet(this.id.toString());
        if (this.element && this.element.parentElement) {
            const container = Utils.getElem('.action-bar-container');
            if (container)
                container.removeChild(this.element.parentElement);
        }
        const instanceIndex = ActionBar.instances.findIndex(inst => inst.id === this.id);
        if (instanceIndex > -1) {
            ActionBar.instances.splice(instanceIndex, 1);
        }
        return this;
    }
    // Methods for external use
    static get CLEAR() { return Action.CLEAR; }
    static get SELECT_ALL() { return Action.SELECT_ALL; }
    static get RESTORE() { return Action.RESTORE; }
    static get MOVE() { return Action.MOVE; }
    static get DELETE() { return Action.DELETE; }
}

export { ActionBar as default };
