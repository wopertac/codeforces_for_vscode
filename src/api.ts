import axios from 'axios'
import { UserDataProvider, StatusDataProvide } from './globals'
import * as vscode from "vscode"

interface CFRes<T> {
    status: "OK" | "FAILED",
    comment?: string,
    result: T
}

interface CFUser {
    handle: string,
    rating: number,
    rank: string
}

interface CFProblem {
    contestId: number,
    index: string,
    rating: number
}

interface CFStatus {
    id: number,
    problem: CFProblem,
    verdict: string,
    passedTestCount: number
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function monitorInfo(secrets: vscode.SecretStorage, intervalMs: number) {
    while(true){
        let handle = await secrets.get("cf_handle");
        if (!handle){

            UserDataProvider.updateItem(0, "");
            UserDataProvider.updateItem(1, "");
            UserDataProvider.updateItem(2, "");

            continue;
        }

        const userData = await fetchCodeforcesUser(handle);
        const userStatus = await fetchCodeforcesStatus(handle);

        if (userData){

            UserDataProvider.updateItem(0, userData.handle);
            UserDataProvider.updateItem(1, `${userData.rating}`);
            UserDataProvider.updateItem(2, userData.rank);
        }else{
            UserDataProvider.updateItem(0, "wrong handler");
            UserDataProvider.updateItem(1, "");
            UserDataProvider.updateItem(2, "");
        }

        if (userStatus){
            for (let i = 0; i < userStatus.length; i++){
                StatusDataProvide.updateTask(i, userStatus[i].id, userStatus[i].verdict, userStatus[i].passedTestCount, userStatus[i].problem.contestId, userStatus[i].problem.index);
                StatusDataProvide.updateLabel(i, 0, `id : ${userStatus[i].id}`)
                StatusDataProvide.updateLabel(i, 1, `passed tests : ${userStatus[i].passedTestCount}`)
            }
        }

        await delay(intervalMs);
    }
}