import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as vscode from 'vscode';

import { UserDataProvider, StatusDataProvide } from './globals';
import { monitorInfo } from './api';

export function activate(context: vscode.ExtensionContext){
   
    const secrets = context.secrets;

    console.log("test!")

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

    vscode.window.registerTreeDataProvider("cf-user", UserDataProvider);
    vscode.window.registerTreeDataProvider("cf-try", StatusDataProvide);

    monitorInfo(secrets, 5000);

    context.subscriptions.push(login, logout);
}

export function deactivate() {}