import { RepoCrowdFundType, DepositType, FirebaseReference, FirebaseAuth, RegisteType } from './type';
import admin from 'firebase-admin';
import { uid } from 'uid';

const { FIREBASE_DATABASE } = process.env;

class FirebaseService {
  private crowdFundRef: FirebaseReference;
  private participantsRef: FirebaseReference;
  private userRef: FirebaseReference;
  private firebaseAuth: FirebaseAuth;

  private constructor() {
    const { FIREBASE_CONFIG } = process.env
    if(!FIREBASE_CONFIG) throw new Error('firebase config error');
    let serviceAccount = JSON.parse(FIREBASE_CONFIG);
    
    const firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: FIREBASE_DATABASE,
    });
    
    this.crowdFundRef = firebaseAdmin.database().ref('crowdFund');
    this.participantsRef = firebaseAdmin.database().ref('participants');
    this.userRef = firebaseAdmin.database().ref('users');
    this.firebaseAuth = firebaseAdmin.auth();
  }

  static create() { return new FirebaseService(); }

  async verifyIdToken(idToken: string): Promise<string> {
    const { uid } = await this.firebaseAuth.verifyIdToken(idToken);
    return uid;
  }

  async getUserInfoFromUid(uid: string) {
    const ref = this.userRef.child(uid);
    const snapshot = await ref.get();
    return snapshot.val();
  }

  async createCrowdFunding({userId, title, desc, targetMoney}: RepoCrowdFundType) {
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

    return resKeys.map(x => ({
      fid: x,
      ...(data[x])
    }));
  }

  async getParticipateCrowdFunding(userId: string) {
    const ref = this.participantsRef;
    const snapshot = await ref.get();
    const data = snapshot.val();
    const fundingArr = [];
    Object.keys(data).filter(x => {
      const a = data[x];
      const keys = Object.keys(a);
      for(let i = 0;i<keys.length;i++) {
        if(a[keys[i]].userId === userId) {
          fundingArr.push(x);
          break;
        }
      }
    });

    // return resKeys.map(x => ({
    //   fid: x,
    //   ...(data[x])
    // }));
  }

  async getParticipate(fid: string) {
    await this.getCrowdFundingById(fid);
    const ref = this.participantsRef.child(fid);
    const snapshot = await ref.get();
    const data = snapshot.val();
    if(!data) return [];
    return Object.keys(data).map(x => data[x]);
  }

  async depositFunding({fid, userId, money, msg}: DepositType) {
    const { name } = await this.getUserInfoFromUid(userId);
    const ref = this.participantsRef.child(fid).child(uid(16));
    await this.getCrowdFundingById(fid);
    await ref.set({
      userId,
      name,
      money,
      msg,
      created_at: new Date().toString(),
    });
  }

  async register({email, password, name}: RegisteType) {
    const { uid } = await this.firebaseAuth.createUser({
      email,
      emailVerified: false,
      password,
      displayName: name,
      disabled: false,
    });
    this.userRef.child(uid).set({
      name,
    })
  }
}

export default FirebaseService;
