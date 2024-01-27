import nodemailer from "nodemailer";
import { EmailVerificationToken } from "@/app/models/emailVerificationToken";
import crypto from "crypto";
type profile = {
  name: string;
  email: string;
};
interface EmailOption {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}
const genertMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6494749aa1a716",
      pass: "df939d5783d494",
    },
  });
  return transport;
};

const sendEmailVerificationLink = async (profile: profile, linkUrl: string) => {
  const trnasport = genertMailTransporter();
  await trnasport.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: profile.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Thank you for registering ..please click in?<a href = "${linkUrl}" >this link to verifiy your account</a></b>`, // html body
  });
};
const sendForgetPasswordlink = async (profile: profile, linkUrl: string) => {
  const trnasport = genertMailTransporter();
  await trnasport.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: profile.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Thank you ..please click in?<a href = "${linkUrl}" >this link to rest your password</a></b>`, // html body
  });
};
const sendUpdatePasswordConfirmationlink = async (profile: profile) => {
  const trnasport = genertMailTransporter();
  await trnasport.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: profile.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Your password has benn changed <a hrfe='${process.env.SIGN_IN_URL}'> click here</a> to signin </b>`, // html body
  });
};

export const sendEmail = (options: EmailOption) => {
  const { profile, subject, linkUrl } = options;
  switch (subject) {
    case "verification":
      return sendEmailVerificationLink(profile, linkUrl!);
    case "forget-password":
      return sendForgetPasswordlink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmationlink(profile);
  }
};
