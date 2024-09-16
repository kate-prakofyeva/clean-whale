import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const sendActivationEmail = async (to, link) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Activation account on ${process.env.API_URL}`,
    text: '',
    html: `
      <div>
        <h1>For activation account click on link</h1>
        <a href="${link}">${link}</a>
      </div>
    `,
  });
};

export default sendActivationEmail;
