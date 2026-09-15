import * as vscode from "vscode"

class Info extends vscode.TreeItem {
    constructor(
        public name: string,
        public info: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public children?: Info[]
    ){
        super(`${name} : ${info}`, collapsibleState);
    }

    public updateInfo(name: string, newInfo: string){
        this.info = newInfo;
        this.name = name;

        this.label = `${this.name} : ${this.info}`;
    }
}

export class User implements vscode.TreeDataProvider<Info> {
    private _onDidChangeTreeData: vscode.EventEmitter<Info | undefined | null | void> = new vscode.EventEmitter<Info | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Info | undefined | null | void> = this._onDidChangeTreeData.event;
    
    private data: Info[];

    constructor(){
        this.data = [
        ]
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Info): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Info): Thenable<Info[]> {
        if (element){
            return Promise.resolve(element.children || []);
        }else{
            return Promise.resolve(this.data);
        }
    }

    updateItem(idx: number, name: string, newInfo: string){
        if (this.data[idx]){
            this.data[idx].updateInfo(name, newInfo);

            this._onDidChangeTreeData.fire(this.data[idx]);
        }
    }



    setNumberOfItem(num: number){
        if (this.data.length == num){
            return;
        }

        for(let i = this.data.length; i < num; i++){
            this.data.push(
                new Info("", "", vscode.TreeItemCollapsibleState.None, [])
            )
        }

        for(let i = this.data.length; i > num; i--){
            this.data.pop();
        }

        this._onDidChangeTreeData.fire(undefined);
    }
}