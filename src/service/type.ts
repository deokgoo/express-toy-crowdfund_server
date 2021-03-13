export type repoCrowdFundType = {
  userId: string,
  title: string,
  desc: string,
  targetMoney: number,
}

export type firebaseCrowdFundType = {
  created_at: Date,
  created_by: string,
} & repoCrowdFundType

export type depositType = {
  fid: string,
  userId: string,
  money: number,
}