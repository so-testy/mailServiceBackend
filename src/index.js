import env from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import passport from 'passport';

import redis from 'redis';
import session from 'express-session';
import redisStore from 'connect-redis';
import mongoose from 'mongoose';

import usePassportConfig from './config/passport';
import router from './routes/index';

env.config();
import './mailServer';

const app = express();
const server = http.createServer(app);
const RedisStore = redisStore(session);
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST
});

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:27017/mail`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors({ origin: ['http://localhost:3000', 'http://епочта.рф:3000', 'http://епочта.рф'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'keyboard cat',
        resave: false,
    })
)
app.use(passport.initialize());
app.use(passport.session());

usePassportConfig(passport);

app.use('/api/v1', router);

const EMAIL_SERVER_HOST = process.env.NODE_ENV === 'production' ? 'backend' : 'localhost';

const httpServer = server.listen(3000, EMAIL_SERVER_HOST, function () {
    console.log('We are live on ', httpServer.address());
});