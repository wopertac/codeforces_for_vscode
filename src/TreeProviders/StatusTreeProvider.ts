import * as vscode from 'vscode'

class Task extends vscode.TreeItem{
    constructor(
        public label: string,
        public solveNumber: number,
        public status: string,
        public testPassed: number,
        public contestId: number,
        public taskId: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public children?: Task[]
    ){
        super(`loading`, collapsibleState);

        this.label = `loading`

        this.children = children;
    }

    updateLabel(label: string){
        this.label = label;
    }

    updateInfo(solveNumber: number, status: string, testPassed: number, contestId: number, taskId: string){
        if (status){
            if (status !== "OK"){
                this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            }else{
                this.collapsibleState = vscode.TreeItemCollapsibleState.None;
            }
            this.status = status;
        }
        if (testPassed){
            this.testPassed = testPassed;
        }
        if (solveNumber){
            this.solveNumber = solveNumber;
        }
        if (contestId){
            this.contestId = contestId;
        }
        if (taskId){
            this.taskId = taskId;
        }
        this.label = `${this.taskId}${this.contestId} : ${this.status}`
    }
}

export class Status implements vscode.TreeDataProvider<Task>{
    private _onDidChangeTreeData: vscode.EventEmitter<Task | undefined | null | void> = new vscode.EventEmitter<Task | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Task | undefined | null | void> = this._onDidChangeTreeData.event;
    
    private data: Task[];
    constructor(){
        this.data = [
        ]
    }

    getTreeItem(element: Task): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Task): Thenable<Task[]> {
        if (element){
            return Promise.resolve(element.children || []);
        }else{
            return Promise.resolve(this.data);
        }
    }

    updateLabel(idx:number, idxC: number, newLabel:string){
        if (this.data[idx].children && this.data[idx].children[idxC]){
            this.data[idx].children[idxC].updateLabel(newLabel);

            this._onDidChangeTreeData.fire(this.data[idx]);
        }
    }

    updateTask(idx:number, solveNumber: number, status: string, testPassed: number, contestId: number, taskId: string){
        if (this.data[idx]){
            this.data[idx].updateInfo(solveNumber, status, testPassed, contestId, taskId);

            this._onDidChangeTreeData.fire(this.data[idx]);
        }
    }

    setNumOfTrasks(num: number){
        if (this.data.length == num){
            return;
        }
        for (let i = this.data.length; i < num; i++){
            this.data.push(
                new Task("", 0, "", 0, 0, "", vscode.TreeItemCollapsibleState.None, [
                    new Task("1", 0, "", 0, 0, "", vscode.TreeItemCollapsibleState.None, []),
                    new Task("2", 0, "", 0, 0, "", vscode.TreeItemCollapsibleState.None, [])
                ])
            )
        }
        for(let i = this.data.length; i > num; i--){
            this.data.pop();
        }
        this._onDidChangeTreeData.fire(undefined);
    }
}