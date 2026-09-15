import axios from 'axios'
import * as vscode from "vscode"
import { UserDataProvider, StatusDataProvider, ContestProblemset, ContestTreeProvider, ContestId } from './globals'
import { CFRes, CFStatus, CFUser, CFProblemsets } from './globals'

export async function fetchCodeforcesProblems(): Promise<CFProblemsets | null> {
    const url = `https://codeforces.com/api/problemset.problems`

    try{
        const res = await axios.get<CFRes<CFProblemsets>>(url);

        if (res.data.status === "OK"){
            return res.data.result;
        }else{
            return null;
        }
    }catch{
        return null;
    }
}

async function fetchCodeforcesUser(handle: string): Promise<CFUser | null>{
    const url = `https://codeforces.com/api/user.info?handles=${handle}`

    try{
        const res = await axios.get<CFRes<CFUser[]>>(url);
    
        if (res.data.status === "OK" && res.data.result.length > 0){
            return res.data.result[0]
        }else{
            return null;
        }
    }catch(error: any){
        return null;
    }
}

async function fetchCodeforcesStatus(handle: string): Promise<CFStatus[] | null> {
    const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`

    try{
        const res = await axios.get<CFRes<CFStatus[]>>(url);

        if (res.data.status === "OK"){
            return res.data.result;
        }else{
            return null;
        }

    }catch{
        return null;
    }
}

async function fetchCodeforcesContest(handle: string, contestId: number) : Promise<CFStatus[] | null>{
    const url = `https://codeforces.com/api/contest.status?handle=${handle}&contestId=${contestId}`

    try {
        const res = await axios.get<CFRes<CFStatus[]>>(url);

        if (res.data.status === "OK"){
            return res.data.result;
        }else{
            return null;
        }

    }catch{
        return null;
    }
}

export async function monitorInfo(secrets: vscode.SecretStorage) {
    let handle = await secrets.get("cf_handle");
    if (!handle){
        UserDataProvider.setNumberOfItem(0);
        StatusDataProvider.setNumOfTrasks(0);
        ContestTreeProvider.setNumOfProblems(0);
        return;
    }

    const userData = await fetchCodeforcesUser(handle);
    const userStatus = await fetchCodeforcesStatus(handle);

    UserDataProvider.setNumberOfItem(3);

    if (userData){
        UserDataProvider.updateItem(0, "Handle", userData.handle);
        UserDataProvider.updateItem(1, "Rating", `${userData.rating}`);
        UserDataProvider.updateItem(2, "Rank", userData.rank);
    }

    if (userStatus){
        StatusDataProvider.setNumOfTrasks(userStatus.length);
        for (let i = 0; i < userStatus.length; i++){
            StatusDataProvider.updateTask(i, userStatus[i].id, userStatus[i].verdict, userStatus[i].passedTestCount, userStatus[i].problem.contestId, userStatus[i].problem.index);
            StatusDataProvider.updateLabel(i, 0, `id : ${userStatus[i].id}`)
            StatusDataProvider.updateLabel(i, 1, `passed tests : ${userStatus[i].passedTestCount}`)
        }
    }

    if (ContestId !== -1){
        ContestTreeProvider.setNumOfProblems(ContestProblemset.length + 1);
        ContestTreeProvider.updateLablel(0, `${ContestId}`);

        for(let i = 0; i < ContestProblemset.length ; i++){
            ContestTreeProvider.updateProblem(i + 1, ContestId, ContestProblemset[ContestProblemset.length - i - 1].index, ContestProblemset[ContestProblemset.length - i - 1].name);
        }

        const contestStatus = await fetchCodeforcesContest(handle, ContestId);

        if (contestStatus){
            for (let i = 0; i < contestStatus.length; i++){
                if (contestStatus[i].verdict === "OK"){
                    ContestTreeProvider.updateVerdict(contestStatus[i].problem.index, "+");
                }
            }
        }
    }
}