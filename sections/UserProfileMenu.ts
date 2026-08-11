import { Locator, Page } from "@playwright/test";

export class UserProfileMenu
{
    readonly page: Page;
    readonly hamburgerMenu: Locator;
    readonly logoutLink: Locator;
    readonly supportLink: Locator;

    constructor(page: Page)
    {
        this.page = page;
        this.hamburgerMenu = page.locator("//p[contains(@class,'userdropdown-name')]");
         this.supportLink = page.locator("//a[@role='menuitem' and text()='Support']");
        this.logoutLink = page.locator("//a[@role='menuitem' and text()='Logout']");
    }

    async clickOnHamburgerMenu(){
        await this.hamburgerMenu.click();
    }

    async clickOnSupportLink(){
        await this.supportLink.click();
    }

    async checkIflogoutPresent(): Promise<boolean>{
        return await this.logoutLink.isVisible();
    }

    async clickLogoutLink(){
        await this.logoutLink.click();
    }
}