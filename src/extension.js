import * as vscode from 'vscode';
export function activate(context) {
    vscode.window.showInformationMessage("ENABLED!!!");
    let disposable = vscode.commands.registerCommand('srpo3.helloWorld', () => {
        vscode.window.showInformationMessage("IT WORKS!!!");
    });
    context.subscriptions.push(disposable);
}
export function deactivate() { }
