import puppeteer from 'puppeteer-extra';
import * as vscode from 'vscode';
import * as path from 'path';
const PROFILE_PATH = path.join(process.env.HOME || '', '.config/chromium');
const CHROMIUM_PATH = "/usr/bin/chromium";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
export function activate(context) {
    const secrets = context.secrets;
    let login = vscode.commands.registerCommand("srpo3.loginCF", async () => {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                userDataDir: PROFILE_PATH,
                executablePath: CHROMIUM_PATH,
                ignoreDefaultArgs: ['--enable-automation'],
                args: [
                    '--no-sandbox',
                    '--disable-blink-features=AutomationControlled',
                    '--window-size=1280,800'
                ]
            });
            const page = await browser.newPage();
            await page.setUserAgent(USER_AGENT);
            await page.setViewport({ width: 1280, height: 800 });
            await page.goto("https://codeforces.com/enter");
        }
        catch {
        }
        finally {
            vscode.window.showInformationMessage("Авторизация успешна!");
        }
    });
    // let submit = vscode.commands.registerCommand("srpo3.submitCF", async () => {
    //     const handle = await secrets.get("cf_handle");
    //     const password = await secrets.get("cf_password");
    //     if (!handle || !password){
    //         vscode.window.showErrorMessage("Сначала надо авторизоваться!!!");
    //         return;
    //     }
    //     const editor = vscode.window.activeTextEditor;
    //     if (!editor){
    //         vscode.window.showErrorMessage("Нет открытого решения!!!");
    //         return;
    //     }
    //     const filePath = editor.document.fileName;
    //     const fileName = path.basename(filePath, path.extname(filePath));
    //     const match = fileName.match(/^(\d+)([A-Z]|[a-z]\d*)$/)
    //     if (!match){
    //         vscode.window.showErrorMessage("Переименуйте файл по шаблону КОНТЕСТ_ЗАДАЧА (пример 4A.cpp)");
    //         return;
    //     }
    //     const contestId = match[1];
    //     const problemIndex = match[2];
    //     const sourceCode = editor.document.getText();
    //     vscode.window.withProgress({
    //         location: vscode.ProgressLocation.Notification,
    //         title: `Отправка задачи ${contestId}${problemIndex}`,
    //         cancellable: false
    //     }, async (progress) => {
    //         let browser;
    //         let chromePath = '/usr/bin/google-chrome';
    //         if (!fs.existsSync(chromePath)){
    //             chromePath = '/usr/bin/chromium';
    //         }
    //         if (!fs.existsSync(chromePath)){
    //             vscode.window.showErrorMessage("Can't find chrome");
    //             return;
    //         }
    //         try{
    //             browser = await puppeteer.launch({
    //                 headless: false,
    //                 executablePath: chromePath,
    //                 userDataDir: PROFILE_PATH,
    //                 args: [
    //                     '--disable-blink-features=AutomationControlled',
    //                     '--start-maximized'
    //                 ]
    //             });
    //             const page = await browser.newPage();
    //             await page.goto("https://codeforces.com", {waitUntil: "networkidle2"});
    //             // await page.type("#handleOrEmail", handle);
    //             // await page.type("#password", password);
    //             // await Promise.all([
    //             //     page.click('input[type=submit]'),
    //             //     page.waitForNavigation({waitUntil: "networkidle2"})
    //             // ]);
    //             // await page.goto(`https://codeforces.com/problemset/submit`, {waitUntil: "networkidle2"});
    //             // await page.type("input[name=submittedProblemCode]", `${contestId}${problemIndex}`);
    //             // await Promise.all([
    //             //     page.keyboard.press("Enter"),
    //             //     page.waitForNavigation({waitUntil: "networkidle2"})
    //             // ])
    //             // const inputElement = await page.$("input[type=file]")
    //             // await inputElement?.uploadFile(filePath);
    //             // await Promise.all([
    //             //     page.waitForNavigation({waitUntil: "networkidle0"}),
    //             //     page.click('input[type=submit]')
    //             // ]);
    //         }catch{
    //         }finally{
    //             if (browser){
    //                 // browser.close();
    //                 vscode.window.showInformationMessage("Задача успешно отправлена");
    //             }
    //         }
    //     }
    // );
    // });
    context.subscriptions.push(login);
}
export function deactivate() { }
