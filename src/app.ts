import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import ExpressCore from 'express-serve-static-core';
import PrivateAccountController from './controllers/PrivateAccountController';
import PublicAccountController from './controllers/PublicAccountController';

class App {
  private app: ExpressCore.Express;
  private port: number|string;

  private constructor() {
    this.app = express();
    this.port = process.env.PORT??80;
    this.useExpress();
    this.setController();
  }
  useExpress() {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  setController() {
    this.app.use('/private', PrivateAccountController);
    this.app.use('/public', PublicAccountController);
    this.app.get('/hoge', (req, res) => res.send('hoge'));
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
