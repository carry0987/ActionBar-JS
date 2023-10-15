import throwError from './error';

/* Util */
const Util = {
    getElem(ele, mode, parent) {
        if (typeof ele === 'object') {
            return ele;
        } else if (mode === undefined && parent === undefined) {
            return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
        } else if (mode === 'all' || mode === null) {
            return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
        } else if (typeof mode === 'object' && parent === undefined) {
            return mode.querySelector(ele);
        }
    },
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    deepMerge(target, ...sources) {
        const source = sources.shift();
        if (!source) return target;
        if (Util.isObject(target) && Util.isObject(source)) {
            for (const key in source) {
                if (Util.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    Util.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return Util.deepMerge(target, ...sources);
    },
    injectStylesheet(stylesObject, id) {
        let style = document.createElement('style');
        style.id = 'actionbar-style' + id;
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);

        let stylesheet = document.styleSheets[document.styleSheets.length - 1];

        for (let selector in stylesObject) {
            if (stylesObject.hasOwnProperty(selector)) {
                Util.compatInsertRule(stylesheet, selector, Util.buildRules(stylesObject[selector]), id);
            }
        }
    },
    buildRules(ruleObject) {
        let ruleSet = '';
        for (let [property, value] of Object.entries(ruleObject)) {
            ruleSet += `${property}:${value};`;
        }
        return ruleSet;
    },
    compatInsertRule(stylesheet, selector, cssText, id) {
        let modifiedSelector = selector.replace('.action-bar', '.action-bar-' + id);
        stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
    },
    removeStylesheet(id) {
        let styleElement = Util.getElem('#actionbar-style' + id);
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }
    },
    isEmpty(str) {
        return (!str?.length);
    },
    getTemplate(tpl, id) {
        let html = `
        <div style="display:none">
            <div class="action-bar action-bar-${id}">
                <div class="selected-count"></div>
                <div class="action-buttons">
                    <button class="action-button clear" aria-label="Clear Selection">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                        </svg>
                    </button>
                    <button class="action-button selectAll" aria-label="Select All">
                        <svg width="22px" height="22px" viewBox="0 0 448 512">
                            <path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z"></path>
                        </svg>
                    </button>
                    <button class="action-button restore" aria-label="Restore">
                        <svg width="24px" height="24px" viewBox="0 0 1024 1024">
                            <path d="M512 768q88 0 151-63t63-151-63-150-151-62q-116 0-180 98l-54-56v170h170l-68-68q16-32 55-56t77-24q62 0 106 43t44 105-44 106-106 44q-78 0-122-64h-74q24 58 77 93t119 35zM598 86l256 256v512q0 34-26 59t-60 25h-512q-34 0-60-25t-26-59l2-684q0-34 25-59t59-25h342z"></path>
                        </svg>
                    </button>
                    <button class="action-button move" aria-label="Move">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zm-8.01-9l-1.41 1.41L12.16 12H8v2h4.16l-1.59 1.59L11.99 17 16 13.01 11.99 9z"></path>
                        </svg>
                    </button>
                    <button class="action-button delete" aria-label="Delete">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        `;
        if (tpl) {
            let template = Util.getElem(tpl);
            if (!template || template.length === 0) throwError('Template not found');
            html = `<div style="display:none"><div class="action-bar action-bar-${id}">`;
            html += template.innerHTML;
            html += `</div></div>`;
        }

        return html;
    },
    modifyButtonState(buttons, state, element) {
        // Check if buttons is an array otherwise convert it to an array
        buttons = Array.isArray(buttons) ? buttons : [buttons];
        buttons.forEach((value) => {
            let actionButton = Util.getElem('.action-button.' + value, element) || null;
            if (actionButton) actionButton.disabled = state;
        });
    }
};

export default Util;
