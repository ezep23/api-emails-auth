import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

dotenv.config();

const app = express();
const mailerSend = new MailerSend({ apiKey: process.env.API_KEY, });
const sentFrom = new Sender(process.env.EMAIL, process.env.NAME);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(`${path.resolve()}/index.html`)
});

app.post('/send', async (req,res) => {
   const { to, subject, html } = req.body

   try {
    const params = new EmailParams()
        .setFrom(sentFrom)
        .setTo([
            new Recipient(to, subject)
        ])
        .setSubject(subject)
        .setHtml(html)
        .setText("This is the text content");

    await mailerSend.email.send(params);
    res.sendStatus(204)
   } catch (e) {
    console.log(e)
    res.status(400)
   }
});

app.listen(3000, () => console.log('¡Ejecutando aplicación correctamente!'));