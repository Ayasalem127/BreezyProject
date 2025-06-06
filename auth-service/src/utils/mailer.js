// const nodemailer = require('nodemailer');

//  exports.sendVerificationEmail = async (to, code)  => {
//   // Crée un compte SMTP de test
//   const testAccount = await nodemailer.createTestAccount();

//   // Création du transporteur SMTP avec les infos de test
//   const transporter = nodemailer.createTransport({
//     host: testAccount.smtp.host,
//     port: testAccount.smtp.port,
//     secure: testAccount.smtp.secure, // true pour 465, false pour autres ports
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   // Envoie de l’email
//   const info = await transporter.sendMail({
//     from: '"Breezy Test" <no-reply@breezy.dev>',
//     to: to,
//     subject: "Code de test Breezy",
//     text: `Voici votre code : ${code}`,
//   });

//   console.log("Message envoyé : %s", info.messageId);
//   console.log("URL de prévisualisation : %s", nodemailer.getTestMessageUrl(info));
// }


