import { User } from "./TreeProviders/UserTreeProvider";
import { Status } from "./TreeProviders/StatusTreeProvider";
import { Contest } from "./TreeProviders/ContestTreeProvider";
import { fetchCodeforcesProblems } from "./api";

// treeDataProviders
export const UserDataProvider = new User();
export const StatusDataProvider = new Status();
export const ContestTreeProvider = new Contest();

export let Problemsets: CFProblemsets | null;
export let ContestProblemset: CFProblem[] = [];
export let ContestId: number = -1;

export async function fetchCodeforces() {
    Problemsets = await fetchCodeforcesProblems();
}

export async function selectContest(idx: number){
    if (Problemsets){
        ContestId = idx;
        ContestProblemset = [];

        for(let i = 0; i < Problemsets.problems.length; i++){
            if (Problemsets.problems[i].contestId < ContestId){
                break;
            }else if(Problemsets.problems[i].contestId == ContestId){
                ContestProblemset.push(Problemsets.problems[i]);
            }

        }
    }
}

export interface CFRes<T> {
    status: "OK" | "FAILED",
    comment?: string,
    result: T
}

export interface CFUser {
    handle: string,
    rating: number,
    rank: string
}

export interface CFProblem {
    contestId: number,
    index: string,
    name: string,
    rating: number
}

export interface CFStatus {
    id: number,
    problem: CFProblem,
    verdict: string,
    passedTestCount: number
}

export interface CFProblemsets {
    problems: CFProblem[],
    problemStatistic: CFProblemStatistic[]
}

export interface CFProblemStatistic{
    contestId: number,
    index: string,
    solvedCount: number
}