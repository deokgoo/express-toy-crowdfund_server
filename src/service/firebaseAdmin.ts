import admin, { app } from 'firebase-admin';

class FirebaseAdmin {
  private firebaseAdmin: app.App
  constructor() {
    const serviceAccount = require("../../serviceAccountKey.json");
    
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://crowd-funding-edf5a-default-rtdb.firebaseio.com"
    });
  }

  async verifyIdToken(idToken: string) {
    console.log(idToken);
    const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(idToken);
    console.log(decodedToken);
    return decodedToken.uid;
  }
}

export default FirebaseAdmin;
