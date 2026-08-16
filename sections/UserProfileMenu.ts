import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/BasePage";

export class UserProfileMenu extends BasePage
{
    readonly hamburgerMenu: Locator;
    readonly logoutLink: Locator;
    readonly supportLink: Locator;

    constructor(page: Page)
    {
        super(page);
        this.hamburgerMenu = page.locator("//p[contains(@class,'userdropdown-name')]");
         this.supportLink = page.locator("//a[@role='menuitem' and text()='Support']");
        this.logoutLink = page.locator("//a[@role='menuitem' and text()='Logout']");
    }

    async clickOnHamburgerMenu(){
        await this.actions.click(this.hamburgerMenu);
    }

    async clickOnSupportLink(){
        await this.actions.click(this.supportLink);
    }

    async checkIflogoutPresent(): Promise<boolean>{
        return await this.actions.isVisible(this.logoutLink);
    }

    async clickLogoutLink(){
        await this.actions.click(this.logoutLink);
    }
}