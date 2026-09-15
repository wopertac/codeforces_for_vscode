import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as vscode from 'vscode';

import { registerCommands } from './commands';
import { UserDataProvider, StatusDataProvider, ContestTreeProvider, fetchCodeforces, selectContest} from './globals';
import { monitorInfo } from './api';

export async function activate(context: vscode.ExtensionContext){
    const secrets = context.secrets;
    const handle = await secrets.get("cf_handle");
    const contest = await secrets.get("cf_contest");

    registerCommands(secrets);

    vscode.window.registerTreeDataProvider("cf-user", UserDataProvider);
    vscode.window.registerTreeDataProvider("cf-try", StatusDataProvider);
    vscode.window.registerTreeDataProvider("cf-contest", ContestTreeProvider);

    await fetchCodeforces();

    if (contest){
        selectContest(+contest);
    }

    monitorInfo(secrets, 1000);
}

export async function deactivate() {}