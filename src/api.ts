import axios from 'axios'
import { UserDataProvider } from './globals'
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

async function fetchCodeforcesUser(handle: string): Promise<CFUser | null>{
    const url = `https://codeforces.com/api/user.info?handles=${handle}`

    try{
        const res = await axios.get<CFRes<CFUser[]>>(url);
    
        if (res.data.status === "OK" && res.data.result.length > 0){
            return res.data.result[0]
        }else{
            console.error(`${res.data.comment}`);
            return null;
        }
    }catch(error: any){
        console.error(`${error.message}`);
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

        if (userData){

            UserDataProvider.updateItem(0, userData.handle);
            UserDataProvider.updateItem(1, `${userData.rating}`);
            UserDataProvider.updateItem(2, userData.rank);
        }else{
            UserDataProvider.updateItem(0, "wrong handler");
            UserDataProvider.updateItem(1, "");
            UserDataProvider.updateItem(2, "");
        }

        await delay(intervalMs);
    }
}