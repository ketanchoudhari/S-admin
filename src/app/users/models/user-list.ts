import { User } from './user.model';

export interface IUserList {
  totalAvailableBalance: number;
  totalBalance: number;
  totalExposure: number;
  balance: number;
  creditRef: number;
  key: number;
  downlineBalance: number;
  exposure: number;
  refPL: number;
  plnet:number;
  users: User[];
}
export interface fullHierarchy{
  userId: number;
  userName: string;
  userType: number;
  length:number
}
