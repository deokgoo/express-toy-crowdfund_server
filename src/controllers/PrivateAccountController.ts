import { Router } from 'express';
import FirebaseService from '../service/firebase';

const PrivateAccountController = (firebaseService: FirebaseService) => {
  let router = Router();

  router.use(async (req, res, next) => {
    const { authorization } = req.headers;
    const idToken = authorization?.split(' ')[1];
    if(!idToken) {
      res.sendStatus(401);
      return;
    }
    try {
      const uid = await firebaseService.verifyIdToken(idToken);
      req.body.userId = uid;
    } catch(err) {
      res.sendStatus(401);
    }
    next();
  });

  router.post('/crowd/create', async (req, res) => {
    const { authorization } = req.headers;
    const idToken = authorization?.split(' ')[1];
    const userId = await firebaseService.verifyIdToken(idToken!);
    const { title, desc, targetMoney } = req.body;
    if(!title || !desc || !targetMoney) {
      res.sendStatus(400);
      return;
    }
    firebaseService.createCrowdFunding({
      userId,
      title,
      desc,
      targetMoney,
    })
    res.sendStatus(201);
  });

  router.get('/crowd', async (req,res) => {
    const { userId } = req.body
    const data = await firebaseService.getCrowdFunding(userId);
    res.send(data);
  });

  router.get('/crowd/participate', async (req,res) => {
    const { userId } = req.body
    const data = await firebaseService.getCrowdFunding(userId);
    res.send(data);
  });

  router.post('/crowd/deposit', async (req, res) => {
    const { fid, money, msg, userId } = req.body;
    try {
      await firebaseService.depositFunding({
        fid,
        userId,
        money,
        msg,
      });
      res.sendStatus(200);
    } catch(err) {
      console.log(err);
      res.sendStatus(500)
    }
  });

  return router;
}

export default PrivateAccountController;
