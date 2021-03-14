import admin from 'firebase-admin';

export type RepoCrowdFundType = {
  userId: string,
  title: string,
  desc: string,
  targetMoney: number,
}

export type FirebaseCrowdFundType = {
  created_at: Date,
  created_by: string,
} & RepoCrowdFundType

export type DepositType = {
  fid: string,
  userId: string,
  money: number,
}

export type FirebaseReference = admin.database.Reference;
export type FirebaseAuth = admin.auth.Auth
