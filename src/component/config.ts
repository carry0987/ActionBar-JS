import { ActionBarOption } from '@/interface/interfaces';

export const defaults: ActionBarOption = {
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

export const Action = {
    CLEAR: 'clear',
    SELECT_ALL: 'selectAll',
    RESTORE: 'restore',
    MOVE: 'move',
    DELETE: 'delete'
} as const;
