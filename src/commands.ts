import * as vscode from 'vscode'
import { selectContest } from './globals';

export function registerCommands(secrets: vscode.SecretStorage){
    vscode.commands.registerCommand("srpo3.loginCF", async () => {
            let handle = await vscode.window.showInputBox();

            if (!handle){
                vscode.window.showErrorMessage("Хендл не может быть пустым");
                return;
            }

            await secrets.store("cf_handle", handle);
        }
    );

    vscode.commands.registerCommand("srpo3.logoutCF", async () => {
        await secrets.delete("cf_handle");
    });

    vscode.commands.registerCommand("srpo3.contestCF", async () => {
        let contest = await vscode.window.showInputBox();

        if (!contest){
            vscode.window.showInformationMessage("Номер конекста не может быть пустып");
            return;
        }

        const contestId = +contest;

        if (!contestId){
            vscode.window.showErrorMessage("Номер контеста должен быть числом");
            return;
        }
        
        await selectContest(+contest);
        await secrets.store("cf_contest", contest);
    });
    
}