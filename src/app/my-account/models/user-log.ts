export interface IUserLog {
  count:number;
  amount: number;
  balance: number;
  dateTime: string;
  description: '';
  txnType: number;
  userId: number;
  userName: string;
  withUid: number;
  withUname: string;
  from: string;
  to: string;
  type: 'depositByUpline' | 'depositToDownline' | 'withdrawalByUpline' | 'withdrawalFromDownline';
}
