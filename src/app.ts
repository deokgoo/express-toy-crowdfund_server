import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';
import ExpressCore from 'express-serve-static-core';
import PrivateAccountController from './controllers/PrivateAccountController';
import PublicAccountController from './controllers/PublicAccountController';
import FirebaseService from './service/firebase';

class App {
  private app: ExpressCore.Express;
  private firebaseService: FirebaseService;
  private port: number|string;
  
  private constructor() {
    this.app = express();
    this.port = process.env.PORT??80;
    this.firebaseService = FirebaseService.create();
    this.useExpress();
    this.setController();
  }
  useExpress() {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  setController() {
    this.app.use('/private', PrivateAccountController(this.firebaseService));
    this.app.use('/public', PublicAccountController(this.firebaseService));
  }
  serverStart() {
    this.app.listen(this.port, () => {
      console.log(chalk.green(`server at http://localhost:${this.port}`))
    });
  }
  static run() {
    const app = new App();
    app.serverStart();
  }
}

App.run();
