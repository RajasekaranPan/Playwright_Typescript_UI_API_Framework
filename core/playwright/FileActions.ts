import {
    Download,
    Locator,
    Page
} from '@playwright/test';

export class FileActions {

    constructor(
        private readonly page: Page
    ) {}

    // ============================================================
    // FILE UPLOAD
    // ============================================================

    /**
     * Upload a file using a file input element.
     *
     * @param locator File input locator.
     * @param filePath Absolute or relative file path.
     */
    async uploadFile(
        locator: Locator,
        filePath: string
    ): Promise<void> {

        await locator.setInputFiles(filePath);
    }


    /**
     * Upload multiple files using a file input element.
     *
     * @param locator File input locator.
     * @param filePaths Array of file paths.
     */
    async uploadFiles(
        locator: Locator,
        filePaths: string[]
    ): Promise<void> {

        await locator.setInputFiles(filePaths);
    }


    // ============================================================
    // FILE CHOOSER
    // ============================================================

    /**
     * Handle a file chooser triggered by an action.
     *
     * Example:
     * await fileActions.uploadUsingChooser(
     *     async () => await page.getByRole('button', {
     *         name: 'Upload'
     *     }).click(),
     *     '/path/to/file.pdf'
     * );
     */
    async uploadUsingChooser(
        action: () => Promise<void>,
        filePath: string
    ): Promise<void> {

        const fileChooserPromise =
            this.page.waitForEvent('filechooser');

        await action();

        const fileChooser =
            await fileChooserPromise;

        await fileChooser.setFiles(filePath);
    }


    // ============================================================
    // FILE DOWNLOAD
    // ============================================================

    /**
     * Wait for a download triggered by an action.
     *
     * Returns the Playwright Download object.
     */
    async downloadFile(
        action: () => Promise<void>
    ): Promise<Download> {

        const downloadPromise =
            this.page.waitForEvent('download');

        await action();

        return await downloadPromise;
    }


    /**
     * Download a file and save it to the specified path.
     */
    async downloadAndSave(
        action: () => Promise<void>,
        savePath: string
    ): Promise<void> {

        const download =
            await this.downloadFile(action);

        await download.saveAs(savePath);
    }
}