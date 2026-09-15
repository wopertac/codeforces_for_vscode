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

    public updateInfo(newInfo: string){
        this.info = newInfo;

        this.label = `${this.name} : ${this.info}`;
    }

}

export class User implements vscode.TreeDataProvider<Info> {
    private _onDidChangeTreeData: vscode.EventEmitter<Info | undefined | null | void> = new vscode.EventEmitter<Info | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Info | undefined | null | void> = this._onDidChangeTreeData.event;
    
    private data: Info[];

    constructor(){
        this.data = [
            new Info("Handle", "loading", vscode.TreeItemCollapsibleState.None, []),
            new Info("Rating", "loading", vscode.TreeItemCollapsibleState.None, []),
            new Info("rank", "loading", vscode.TreeItemCollapsibleState.None, []),
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

    updateItem(idx: number, newInfo: string){
        if (this.data[idx]){
            this.data[idx].updateInfo(newInfo);

            this._onDidChangeTreeData.fire(this.data[idx]);
        }
    }
}