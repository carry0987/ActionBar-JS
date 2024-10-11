import { ActionBar, Action } from '@/index';
import { defaults } from '@/component/config';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ActionBar', () => {
    let actionBar: ActionBar; // Declare an ActionBar instance

    beforeEach(() => {
        actionBar = new ActionBar({});
    });

    afterEach(() => {
        actionBar.destroy();
        document.body.innerHTML = ''; // Clean up DOM after each test
    });

    it('should initialize with default options', () => {
        expect(actionBar['options']).toMatchObject(defaults); // Validate options initialized correctly
    });

    it('should render action bar in the document', () => {
        actionBar.show();
        const container = document.querySelector('div.action-bar-container');
        expect(container).not.toBeNull();
    });

    it('should toggle button visibility based on hideButton option', () => {
        actionBar.destroy();
        actionBar = new ActionBar({ hideButton: [Action.CLEAR, Action.MOVE] });
        actionBar.show();

        const clearButton = document.body.querySelector<HTMLButtonElement>('.action-button.clear');
        const moveButton = document.querySelector<HTMLButtonElement>('.action-button.move');
        const deleteButton = document.querySelector<HTMLButtonElement>('.action-button.delete');

        expect(clearButton?.style.display).toBe('none');
        expect(moveButton?.style.display).toBe('none');
        expect(deleteButton?.style.display).not.toBe('none');
    });

    it('should call onClear callback when clear button is clicked', () => {
        const onClearMock = vi.fn();
        actionBar.onClear(onClearMock);

        actionBar.show();
        const clearButton = document.querySelector('.action-button.clear') as HTMLButtonElement;
        clearButton?.click(); // Simulate click

        expect(onClearMock).toHaveBeenCalled();
    });

    it('should update count display correctly', () => {
        actionBar.updateCountNumber(5);
        actionBar.show();

        const countDisplay = document.querySelector('.selected-count');
        expect(countDisplay).not.toBeNull();
        expect(countDisplay?.textContent).toContain('5');
    });

    it('should hide the actionBar when hide method is called', () => {
        actionBar.show();
        actionBar.hide();

        const container = document.querySelector<HTMLElement>('.action-bar-container > div');
        expect(container).not.toBeNull();
        expect(container?.style.display).toBe('none');
    });

    it('should show the actionBar when show method is called', () => {
        actionBar.show();

        const container = document.querySelector<HTMLElement>('.action-bar-container > div');
        expect(container).not.toBeNull();
        expect(container?.style.display).toBe('block');
    });
});
