import {
    Dialog,
    Page
} from '@playwright/test';

export class DialogActions {

    //Usage:
    /**
     * 
     * 
await this.actions.dialog.accept(
    async () => {
        await this.actions.click(
            this.deleteButton
        );
    }
);
     */
    constructor(
        private readonly page: Page
    ) {}

    // ============================================================
    // ACCEPT
    // ============================================================

    /**
     * Execute an action and accept the resulting dialog.
     */
    async accept(
        action: () => Promise<void>
    ): Promise<void> {

        const dialogPromise =
            this.page.waitForEvent('dialog');

        await action();

        const dialog =
            await dialogPromise;

        await dialog.accept();
    }


    // ============================================================
    // DISMISS
    // ============================================================

    /**
     * Execute an action and dismiss the resulting dialog.
     */
    async dismiss(
        action: () => Promise<void>
    ): Promise<void> {

        const dialogPromise =
            this.page.waitForEvent('dialog');

        await action();

        const dialog =
            await dialogPromise;

        await dialog.dismiss();
    }


    // ============================================================
    // ACCEPT PROMPT
    // ============================================================

    /**
     * Execute an action and accept the resulting prompt
     * with the specified value.
     */
    async acceptPrompt(
        action: () => Promise<void>,
        value: string
    ): Promise<void> {

        const dialogPromise =
            this.page.waitForEvent('dialog');

        await action();

        const dialog =
            await dialogPromise;

        await dialog.accept(value);
    }
}