# ActionBar-JS
[![version](https://img.shields.io/npm/v/@carry0987/action-bar.svg)](https://www.npmjs.com/package/@carry0987/action-bar)
![CI](https://github.com/carry0987/ActionBar-JS/actions/workflows/ci.yml/badge.svg)  
A library for create flat-styled float ActionBar, with selection count, and more

## Installation
```bash
pnpm i @carry0987/action-bar
```

## Usage
Here is a simple example to use ActionBar-JS

#### UMD
```html
<div class="d-flex flex-column justify-content-center align-items-center vh-100">
    <div id="app">
        <h1 class="mb-3">ActionBar</h1>
    </div>
    <div class="d-flex justify-content-center">
        <button id="showActionBar" class="btn btn-primary me-2">Show ActionBar</button>
        <button id="hideActionBar" class="btn btn-secondary">Hide ActionBar</button>
    </div>
    <div id="button" class="d-flex justify-content-center mt-1 hide">
        <button id="enableButton" class="btn btn-primary me-2">Enable Button</button>
        <button id="disableButton" class="btn btn-secondary">Disable Button</button>
    </div>
</div>
<link href="dist/theme/actionBar.min.css" rel="stylesheet">
<script src="dist/actionBar.min.js"></script>
<script type="text/javascript">
const actionBar = new actionBarjs.ActionBar({
    hideButton: ['clear', 'selectAll'],
    customButton: [
        {
            name: 'Test-1',
            icon: '<i class="fa-solid fa-circle-info h5 m-0"></i>',
            callback: (e) => {
                alert('Test-1');
            }
        },
        {
            name: 'Test-2',
            icon: '<i class="fa-solid fa-circle-info h5 m-0"></i>',
            callback: (e) => {
                alert('Test-2');
            }
        }
    ],
    styles: {
        '.action-bar .action-button:not([disabled]):hover': {
            'color': '#000'
        }
    }
});
let buttonList = actionBarjs.ActionBar.getButtonList();
const buttons = [
    ...buttonList,
    'Test-1',
];
//...
</script>
```

#### ES Module
```ts
import { ActionBar, Action } from '@carry0987/action-bar';
import '@carry0987/action-bar/theme/actionBar.min.css';

const actionBar = new ActionBar({
    //...
});
const buttonList = [
    Action.CLEAR,
    //...
];
```
