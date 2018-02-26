import defaultMsg from './default'

export default {
  ...defaultMsg,
  not_found: 'Wrong email or password',
  user_exists: 'User with such email already exists',
  tfa_wrong_code: 'Wrong code',
  password_not_verified: 'Wrong password',
  email_not_verified: 'Email not verified. Please check your mailbox',
  email_verified: 'Email successfully verified',
  password_do_not_match: 'Passwords do not match',
  wrong_password: 'Wrong Password',
  password_changed: 'Password successfully changed',
  recovery_wallet_not_found: 'Wrong email or recovery seed',
  recovered: 'Account successfully recovered. You can now login with new credentials',
  email_sent: 'Request successfully sent. Please check your inbox',
  expired_signature: `Expired signature error. Please check if the time on your device is correct and try again`,
  email_not_verified_on_recovery: 'It is not possible to recover account with unverified email'
}
