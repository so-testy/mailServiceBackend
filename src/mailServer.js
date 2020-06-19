import env from 'dotenv';
env.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { readFileSync } from 'fs';
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';

import Mail from './models/mail';

const EMAIL_SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT);
const EMAIL_SERVER_HOST = process.env.NODE_ENV === 'production' ? 'backend' : 'localhost';
const EMAIL_SERVER_IS_SECURE = process.env.EMAIL_SERVER_IS_SECURE == 'true' ? true : false;
const EMAIL_SERVER_HAS_CERT = process.env.EMAIL_SERVER_HAS_CERT == 'true' ? true : false;

const smtp = new SMTPServer({
    logger: true,
    secure: EMAIL_SERVER_IS_SECURE,
    ...(EMAIL_SERVER_HAS_CERT && { key: readFileSync('./src/cert/key.pem') }),
    ...(EMAIL_SERVER_HAS_CERT && { cert: readFileSync('./src/cert/cert.pem') }),
    onConnect(session, callback) {
        console.log('Console in onConnect function>>>', session);
        return callback();
    },
    onMailFrom(address, session, callback) {
        console.log('Received mail from function>>>',address);
        return callback(); 
    },
    onRcptTo,
    onData,
    allowInsecureAuth: true,
    authOptional: true,
});

function onRcptTo(data, session, callback) {
    console.log(data);
    callback();
}

async function onData(stream, session, callback) {
    const parsedMail = await simpleParser(stream);
    const newMail = new Mail({
        from: parsedMail.from.text,
        to: parsedMail.to.text,
        subject: parsedMail.subject,
        text: parsedMail.text,
        html: parsedMail.html,
    });
    console.log(await newMail.save());
    callback();
}

smtp.listen(EMAIL_SERVER_PORT, EMAIL_SERVER_HOST, () => {
    console.log('Mail server started at %s:%s', EMAIL_SERVER_HOST, EMAIL_SERVER_PORT);
});