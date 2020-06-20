import nodemailer from 'nodemailer';
import Mail from '../models/mail';
import env from 'dotenv';
env.config();

const EMAIL_SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT);
const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;

const transporter = nodemailer.createTransport({
    host: process.env.NODE_ENV === 'production' ? 'backend' : 'localhost',
    port: EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_IS_SECURE === 'false' ? false : true,
    tls: {
        rejectUnauthorized: false
    }
});

export const send = (req, res) => {
    const { to, subject, text, html } = req.body;

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
        to: {
            $regex: new RegExp(`[A-Za-z0-9_<>]+${req.user.login}@${EMAIL_SERVER_HOST}[A-Za-z0-9_<>]+`, 'i')
        }
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
        from: {
            $regex: new RegExp(`[A-Za-z0-9_<>]+${req.user.login}@${EMAIL_SERVER_HOST}[A-Za-z0-9_<>]+`, 'i')
        }
    }).exec();

    const formatedMails = [];
    for (const mail of mails) {
        formatedMails.push(mail.toObject());
    }

    res.json({
        mails: formatedMails
    });
}