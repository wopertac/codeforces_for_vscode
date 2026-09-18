import * as vscode from "vscode"

class Info extends vscode.TreeItem {
    constructor(
        public name: string,
        public info: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public children?: Info[]
    ){
        super(`${name} : ${info}`, collapsibleState);
        this.children = [];
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
        this.data = []
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

            if (this.data[idx].info == newInfo){
                return;
            }

            this.data[idx].updateInfo(name, newInfo);

            this._onDidChangeTreeData.fire(this.data[idx]);
        }
    }

    setNumOfChildren(idx: number, num: number){
        if (this.data[idx]){
            if (!this.data[idx].children){
                return;
            }

            if (this.data[idx].children.length == num){
                return;
            }

            if (num > 0){
                this.data[idx].collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            }else{
                this.data[idx].collapsibleState = vscode.TreeItemCollapsibleState.None;
            }

            for(let i = this.data[idx].children.length; i < num; i++){
                this.data[idx].children.push(
                    new Info("", "", vscode.TreeItemCollapsibleState.None, [])
                )
            }

            for (let i = this.data[idx].children.length; i > num; i--){
                this.data[idx].children.pop();
            }
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