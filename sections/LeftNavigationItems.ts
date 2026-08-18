import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/BasePage";

export class LeftNavigationItems extends BasePage
{
    readonly myInfo: Locator;
    readonly pim: Locator;

    constructor(page: Page)
    {
        super(page);
        this.myInfo = page.getByRole("link", {name: 'My Info'});
        this.pim = page.getByRole("link", {name: 'PIM'});
    }

    async clickOnMyInfoLink(){
       await this.actions.click(this.myInfo);
       await this.actions.wait.forUrl(/viewPersonalDetails/);
    }

    async clickOnPIMLink(){
       await this.actions.click(this.pim);
       await this.actions.wait.forUrl(/viewEmployeeList/);
    }

}