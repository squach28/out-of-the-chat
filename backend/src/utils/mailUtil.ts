import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import ejs from 'ejs'
import path from 'path'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendMail = (email: string, subject: string, content: string): void => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: content
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error !== null) {
      console.log(error)
    }
  })
}

export const sendEmailVerification = (email: string, firstName: string, link: string): void => {
  const VERIFY_EMAIL_SUBJECT = 'Verify your email for Out of the Chat'
  ejs.renderFile(path.join(__dirname, '/templates/verifyEmail.ejs'), { email, firstName, link }, (err, data) => {
    if (err !== null) {
      console.log(err)
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: VERIFY_EMAIL_SUBJECT,
        html: data
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error !== null) {
          console.log(error)
        } else {
          console.log('message sent successfully')
        }
      })
    }
  })
}

export const sendResetPasswordEmail = (email: string, link: string): void => {
  const RESET_PASSWORD_EMAIL_SUBJECT = 'Reset your password for Out of the Chat'
  ejs.renderFile(path.join(__dirname, '/templates/resetPasswordEmail.ejs'), { email, link }, (err, data) => {
    if (err !== null) {
      console.log(err)
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: RESET_PASSWORD_EMAIL_SUBJECT,
        html: data
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error !== null) {
          console.log(error)
        } else {
          console.log('message sent successfully')
        }
      })
    }
  })
}
