import Utils from '@carry0987/utils';

Utils.getTemplate = function(tpl, id) {
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
        let template = Utils.getElem(tpl);
        if (!template || template.length === 0) throwError('Template not found');
        html = `<div style="display:none"><div class="action-bar action-bar-${id}">`;
        html += template.innerHTML;
        html += `</div></div>`;
    }

    return html;
}

Utils.modifyButtonState = function(buttons, state, element) {
    // Check if buttons is an array otherwise convert it to an array
    buttons = Array.isArray(buttons) ? buttons : [buttons];
    buttons.forEach((value) => {
        let actionButton = Utils.getElem('.action-button.' + value, element) || null;
        if (actionButton) actionButton.disabled = state;
    });
}

/**
 * Add custom button
 *
 * @param {string} name Name of button
 * @param {string} icon Icon of button
 * @param {function} callback Callback function to be called on clicking the button
 * @returns this
 */
Utils.addCustomButton = function(name, icon, callback, buttonArea) {
    if (typeof callback !== 'function') {
        throwError('callback should be a function');
    }
    const button = document.createElement('button');
    button.className = `action-button custom ${name}`;
    button.title = name;
    button.innerHTML = icon;
    buttonArea.appendChild(button);
    button.addEventListener('click', () => {
        if (button.style.display === 'none') return;
        callback(button);
    });
}

export default Utils;
