import Signup from '../../../src/components/auth/Signup.vue'
import { initTestEnvironment, mountComponent, getRenderedTextFromSelector } from '../init'

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

initTestEnvironment()

function getRandomString () {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

// describe('user sign up', () => {
//
//   it('should not pass validation because of empty fields', () => {
//     const SignupComponent = mountComponent(Signup)
//     return expect(SignupComponent.signup()).to.be.rejectedWith('Validation failed');
//   })
//
//   it('should be rejected because of wrong confirm password', () => {
//     const SignupComponent = mountComponent(Signup)
//     SignupComponent.email = 'qwe@mail.com'
//     SignupComponent.password = 'qwe123'
//     SignupComponent.confirmPassword = 'qqweqweqe'
//     return expect(SignupComponent.signup()).to.be.rejectedWith('Passwords do not match')
//   })
//
//   it('should be rejected because of conflict with 409 error', () => {
//     // it can not pass if server database was dropped, in this case you should run this test twice, because 1st time
//     // user will be registered as expects
//     const SignupComponent = mountComponent(Signup)
//     SignupComponent.email = 'qwe@qwe.com'
//     SignupComponent.password = 'qwe'
//     SignupComponent.confirmPassword = 'qwe'
//     return expect(SignupComponent.signup()).to.be.rejectedWith('Email already taken')
//   })
//
//   it('should successfully register new user', () => {
//     //is needed only for teting logic so it's still possible to generate 2 random strings and get conflict error
//     const SignupComponent = mountComponent(Signup)
//     SignupComponent.email = getRandomString() + '@mail.com'
//     SignupComponent.password = 'testpassword'
//     SignupComponent.confirmPassword = 'testpassword'
//     return expect(SignupComponent.signup()).to.be.fulfilled
//   })
// })
