import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const PROFILE_PATH = path.join(process.env.HOME || '', '.config/chromium');
const CHROMIUM_PATH = "/usr/bin/chromium";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export function activate(context: vscode.ExtensionContext){
   
    const secrets = context.secrets;

    let login = vscode.commands.registerCommand("srpo3.loginCF", async () => {
            let handle = await vscode.window.showInputBox();

            if (!handle){
                vscode.window.showErrorMessage("Хендл не может быть пустым");
                return;
            }

            await secrets.store("cf_handle", handle);

            vscode.window.showInformationMessage("Информация о хендле изменена");
        }
    );

    let logout = vscode.commands.registerCommand("srpo3.logoutCF", async () => {
        await secrets.delete("cf_handle");
        vscode.window.showInformationMessage("Информация о хендле удалена");
    });

    

    context.subscriptions.push(login, logout);
}

export function deactivate() {}