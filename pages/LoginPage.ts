import { Locator, Page } from "@playwright/test";
import { PlaywrightActions } from "../core/playwright/PlaywrightActions";
import { BasePage } from "../core/BasePage";

export class LoginPage extends BasePage
{
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
  
    constructor(page: Page)
    {
        super(page);
        this.userNameInput = page.getByRole('textbox', { name: 'Username' })
        this.passwordInput = page.getByRole('textbox', { name: 'Password' })
        this.loginButton = page.getByRole('button', { name: 'Login' })
    }

    /**
     * To open URL into Browser
     */
    async goToOrangeHRMLoginPage(url: string)
    {
        await this.actions.navigation.goto(url, 
            { waitUntil: 'domcontentloaded' }
        );
    }

    /**
     * To login into Orange HRM
     * @param username 
     * @param password 
     */
    async loginToOrangeHRM(username: string, password: string)
    {
        await this.actions.fill(this.userNameInput, username);
        await this.actions.fill(this.passwordInput, password);
        await this.actions.click(this.loginButton);
    }
}