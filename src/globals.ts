import { User } from "./TreeProviders/UserTreeProvider";
import { Status } from "./TreeProviders/StatusTreeProvider";

export const UserDataProvider = new User();
export const StatusDataProvide = new Status();

StatusDataProvide.createTask(10);