import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/BasePage";

export class LeftNavigationItems extends BasePage
{
    readonly myInfo: Locator;

    constructor(page: Page)
    {
        super(page);
        this.myInfo = page.getByRole("link", {name: 'My Info'});
    }

    async clickOnMyInfoLink(){
       await this.actions.click(this.myInfo);

    await this.actions.wait.forUrl(/viewPersonalDetails/);
    }

}