let ejs = require('ejs')
var Promise = require("bluebird");
// var helper = require("sendgrid")(process.env.SENDGRID_API_KEY);
var helper = require('sendgrid').mail;


const renderFile = Promise.promisify(ejs.renderFile)
const path = require('path');
const appDir = path.dirname(require.main.filename);
console.log(path.join())
var uploadDir = `${path.join()}/views`
console.log(uploadDir)

module.exports = class MailSender {
  constructor() {
    console.log('constructor')
  }

  static sendEmail(payload) {
    console.log("Sender", payload);
    return this.sendTemplate(`${appDir}/views/${payload.template}`, payload.recipient, payload.subject, payload.data)
      .then(null, () => { });
  }
  static sendEmailConfirmationCode(recipient, code) {
    const subject = `Your Musicoin confirmation code`;
    return this.sendTemplate(`${appDir}/views/mail/email-confirmation.ejs`, recipient, subject, { code: code });
  }

  static sendWelcomeEmail(recipient) {
    const subject = `Welcome to Musicoin!`
    return this.sendTemplate(`${appDir}/views/mail/invite.ejs`, recipient, subject, { invite: 'invite' });
  }
static  sendPasswordReset(recipient, link) {
    const subject = `Musicoin password reset request`;
    return this.sendTemplate(`/Users/Ghost/Sites/musicoin/api-musicoin/views/mail/password-reset.ejs`, recipient, subject, { link: link });
  }

   static sendTemplate(template, recipient, subject, data) {
    return renderFile(template, data)
      .then(html => {
        console.log("send template then");
        const from_email = new helper.Email("musicoin@musicoin.org");
        const to_email = new helper.Email(recipient);
        const content = new helper.Content("text/html", html);
        const mail = new helper.Mail(from_email, subject, to_email, content);
        const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
        if (process.env.CAPTCHA_SECRET == "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe") {
          console.log(`SendGrid key is: ` + process.env.SENDGRID_API_KEY);
          console.log(mail.toJSON());
        }
        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });

        return sg.API(request)
          .then(response => {
            if (response.statusCode < 300) {
              return response;
            }
            throw new Error(`Failed to send e-mail, template: ${template}, server returned status code: ${response.statusCode}` + response);
          });
      });

  }

}
