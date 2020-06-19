import nodemailer from 'nodemailer';
import Mail from '../models/mail';
import env from 'dotenv';
env.config();

const EMAIL_SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT);
const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;


export const send = (req, res) => {
    const { to, from, subject, text, html } = req.body;
    
    const transporter = nodemailer.createTransport({
        host: EMAIL_SERVER_HOST,
        port: EMAIL_SERVER_PORT,
        secure: process.env.EMAIL_SERVER_IS_SECURE === 'false' ? false : true,
    });

    const mailOptions = {
        from: `${req.user.login}@${EMAIL_SERVER_HOST}`,
        to,         // 'user2@localhost',
        subject,    // 'Testmail',
        text,       // 'Hi, mail sent.'
        html,       //
        secure: process.env.EMAIL_SERVER_IS_SECURE === 'false' ? false : true,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(400).send(error);

        } else {
            res.json(info);
        }
    });
};

export const incoming = async (req, res) => {
    const mails = await Mail.find({
        to: `${req.user.login}@${EMAIL_SERVER_HOST}`
    }).exec();

    const formatedMails = [];
    for (const mail of mails) {
        formatedMails.push(mail.toObject());
    }

    res.json({
        mails: formatedMails
    });
}

export const outcoming = async (req, res) => {
    const mails = await Mail.find({
        from: `${req.user.login}@${EMAIL_SERVER_HOST}`
    }).exec();

    const formatedMails = [];
    for (const mail of mails) {
        formatedMails.push(mail.toObject());
    }

    res.json({
        mails: formatedMails
    });
}