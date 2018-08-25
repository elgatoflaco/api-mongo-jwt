module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONDODB || 'mongodb://localhost/passport',
  SECRET_TOKEN: process.env.SECRET_TOKEN || 'miclavedetokens',
  serverEndpoint: process.env.serverEndpoint || 'http://localhost:3000/forgot-password',
  passwordResetLinkTimeout: process.env.passwordResetLinkTimeout || 1000 * 60 * 60,
  emailVerificationLinkTimeout: process.env.emailVerificationLinkTimeout || 60 * 60 * 24 * 3,
  SENGRID_API: process.env.SENDGRID_API_KEY || ''
}
