import { repoCrowdFundType, depositType } from './type';
import firebase from 'firebase';
import { uid } from 'uid';

const {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  STORAGE_BUCKET
} = process.env;

class FirebaseService {
  private crowdFundRef: firebase.database.Reference;
  private participantsRef: firebase.database.Reference;

  private constructor() {
    firebase.initializeApp({
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      databaseURL: DATABASE_URL,
      storageBucket: STORAGE_BUCKET,
    });
    const database = firebase.database();
    this.crowdFundRef = database.ref('crowdFund');
    this.participantsRef = database.ref('participants')
  }

  static create() { return new FirebaseService(); }

  async createCrowdFunding({userId, title, desc, targetMoney}: repoCrowdFundType) {
    const ref = this.crowdFundRef.child(uid(16));
    await ref.set({
      targetMoney,
      title,
      desc,
      created_by: userId,
      created_at: new Date().toString(),
    });
  }

  async getCrowdFundingById(fid: string) {
    const ref = this.crowdFundRef.child(fid);
    const snapshot = await ref.get();
    const crowdFundInfo = snapshot.val();
    if(!crowdFundInfo) throw new Error('not exist crowdFunding');
    return crowdFundInfo;
  }

  async getCrowdFunding(userId: string) {
    const ref = this.crowdFundRef;
    const snapshot = await ref.get();
    const data = snapshot.val();
    const resKeys = Object.keys(data).filter(x => data[x].created_by === userId);

    return resKeys.map(x => data[x]);
  }

  async getParticipate(fid: string) {
    await this.getCrowdFundingById(fid);
    const ref = this.participantsRef.child(fid);
    const snapshot = await ref.get();
    const data = snapshot.val();
    return Object.keys(data).map(x => data[x]);
  }

  async depositFunding({fid, userId, money}: depositType) {
    const ref = this.participantsRef.child(fid).child(uid(16));
    await this.getCrowdFundingById(fid);
    await ref.set({
      userId,
      money,
      created_at: new Date().toString(),
    });
  }
}

export default FirebaseService;
