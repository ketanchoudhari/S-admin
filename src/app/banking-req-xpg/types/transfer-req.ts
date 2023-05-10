export interface ITransfer {
  password: string;
  txntype:any;
  users: {
    userId: number;
    txnType: number;
    amount: number;
    remark: string;
    creditRef?: number;
    key?: boolean | number;
  }[];
}
