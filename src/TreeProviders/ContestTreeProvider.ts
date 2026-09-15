import * as vscode from 'vscode'

class Problem extends vscode.TreeItem {
    constructor(
        public label: string,
        public contestId: number,
        public problemId: string,
        public verdict: string,
        public name: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public children?: Problem[]
    ){
        super(`${problemId}[${verdict}] : ${name}`, collapsibleState)

        this.label = `${problemId} : ${name} [${verdict}]`
    }

    updateVerdict(newVerdict: string){
        this.verdict = newVerdict;
        this.label = `${this.problemId}[${this.verdict}] : ${this.name}`
    }

    updateProblem(contestId: number, problemId: string, name: string){
        this.contestId = contestId;
        this.problemId = problemId;
        this.name = name;
        this.label = `${this.problemId}[${this.verdict}] : ${this.name}`
    }

    updateLabel(label: string){
        this.label = label;
    }

}

export class Contest implements vscode.TreeDataProvider<Problem> {
    private _onDidChangeTreeData: vscode.EventEmitter<Problem | undefined | null | void> = new vscode.EventEmitter<Problem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Problem | undefined | null | void> = this._onDidChangeTreeData.event;
    
    private data: Problem[];
    constructor(){
        this.data = [];
    }

    getTreeItem(element: Problem): vscode.TreeItem{
        return element;
    }

    getChildren(element?: Problem): Thenable<Problem[]> {
        if (element){
            return Promise.resolve(element.children || []);
        }else{
            return Promise.resolve(this.data);
        }
    }

    updateVerdict(idx: number, newVerdict: string){
        if (this.data[idx]){
            this.data[idx].updateVerdict(newVerdict);

            this._onDidChangeTreeData.fire(undefined);
        }
    }

    updateProblem(idx: number, contestId: number, problemId: string, name: string){
        if (this.data[idx]){
            this.data[idx].updateProblem(contestId, problemId, name);

            this._onDidChangeTreeData.fire(undefined);
        }
    }

    updateLablel(idx: number, label: string){
        if (this.data[idx]){
            this.data[idx].updateLabel(label);

            this._onDidChangeTreeData.fire(undefined);
        }
    }

    setNumOfProblems(num: number){
        for(let i = this.data.length; i < num; i++){
            this.data.push(
                new Problem("", 0, "", "-", "", vscode.TreeItemCollapsibleState.None, [])
            );
        }
        for(let i = this.data.length; i > num; i--){
            this.data.pop();
        }
        this._onDidChangeTreeData.fire(undefined);
    }
}