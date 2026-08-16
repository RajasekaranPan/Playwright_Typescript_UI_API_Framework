import {
    Frame,
    FrameLocator,
    Locator,
    Page
} from '@playwright/test';

export class FrameActions {

    constructor(
        private readonly page: Page
    ) {}

    // ============================================================
    // FRAME LOCATOR
    // ============================================================

    /**
     * Get a FrameLocator using an iframe selector.
     *
     * Example:
     * getFrameLocator('#payment-frame')
     */
    getFrameLocator(
        selector: string
    ): FrameLocator {

        return this.page.frameLocator(selector);
    }


    // ============================================================
    // FRAME BY NAME
    // ============================================================

    /**
     * Get a frame by its name.
     */
    getFrameByName(
        name: string
    ): Frame | null {

        return this.page.frame({
            name
        });
    }


    // ============================================================
    // FRAME BY URL
    // ============================================================

    /**
     * Get a frame by URL.
     */
    getFrameByUrl(
        url: string | RegExp
    ): Frame | null {

        return this.page
            .frames()
            .find(frame => {

                const frameUrl = frame.url();

                if (typeof url === 'string') {
                    return frameUrl === url;
                }

                return url.test(frameUrl);
            }) ?? null;
    }


    // ============================================================
    // WAIT FOR FRAME
    // ============================================================

    /**
     * Wait for a frame to be attached to the page.
     */
    async waitForFrame(
        predicate: (frame: Frame) => boolean,
        timeout?: number
    ): Promise<Frame> {

        return await this.page.waitForEvent(
            'frameattached',
            {
                predicate,
                timeout
            }
        );
    }


    // ============================================================
    // ALL FRAMES
    // ============================================================

    /**
     * Get all frames currently attached to the page.
     */
    getAllFrames(): Frame[] {

        return this.page.frames();
    }


    // ============================================================
    // MAIN FRAME
    // ============================================================

    /**
     * Get the main page frame.
     */
    getMainFrame(): Frame {

        return this.page.mainFrame();
    }
}