import { mutations, getters } from './user.module'
import {} from '../test/default.mocks'
import { testAction } from '../test/vuex-test.helper'
import { userResponse, mockUserFavorites } from './user.mocks'
import { Response } from '../../js/builders/response_builder'

const moduleInjector = require('inject-loader!./user.module')

const module = moduleInjector({
  '../../js/services/users.service': {
    usersService: {
      loadUser: _ => Promise.resolve(Response.getCommonResponse(userResponse)),
      loadUserFavorites: _ => Promise.resolve()
    }
  }
})

const {
  SET_USER_EMAIL,
  SET_USER_TYPE,
  SET_USER_STATE,
  SET_USER_REJECT_REASON,
  SET_USER_CREATED_AT,
  SET_FAVORITES
} = mutations

const {
  userEmail,
  userState,
  userType,
  userRejectReason,
  userCreatedAt,
  userFavorites
} = getters

describe('module.user', () => {
  it('SET_USER_EMAIL', () => {
    const state = { email: '' }
    SET_USER_EMAIL(state, userResponse.data.attributes.email)
    expect(state.email).to.equal(userResponse.data.attributes.email)
  })
  it('SET_USER_TYPE', () => {
    const state = { type: '' }
    SET_USER_TYPE(state, userResponse.data.type)
    expect(state.type).to.equal(userResponse.data.type)
  })
  it('SET_USER_STATE', () => {
    const state = { state: '' }
    SET_USER_STATE(state, userResponse.data.attributes.state)
    expect(state.state).to.equal(userResponse.data.attributes.state)
  })
  it('SET_USER_REJECT_REASON', () => {
    const state = { rejectReason: '' }
    SET_USER_REJECT_REASON(state, userResponse.data.attributes.reject_reason)
    expect(state.rejectReason).to.equal(userResponse.data.attributes.reject_reason)
  })
  it('SET_USER_CREATED_AT', () => {
    const state = { createdAt: '' }
    SET_USER_CREATED_AT(state, userResponse.data.attributes.created_at)
    expect(state.createdAt).to.equal(userResponse.data.attributes.created_at)
  })
  it('SET_FAVORITES', () => {
    const state = { details: { favorites: [] } }
    SET_FAVORITES(state, mockUserFavorites)
    expect(state.details.favorites).to.deep.equal(mockUserFavorites)
  })
  it('GET_USER_DETAILS', (done) => {
    testAction({
      action: module.actions.GET_USER_DETAILS,
      actionPayload: null,
      expectedMutations: [
        { type: 'SET_USER_TYPE' },
        { type: 'SET_USER_STATE' },
        { type: 'SET_USER_REJECT_REASON' },
        { type: 'SET_USER_CREATED_AT' },
      ],
      expectedMutationPayloads: [
        userResponse.data.type,
        userResponse.data.attributes.state,
        userResponse.data.attributes.reject_reason,
        userResponse.data.attributes.created_at,
      ],
      state: []
    }, done)
  })
  it('userEmail getter', () => {
    const mockedEmail = userResponse.data.attributes.email
    const state = { email: mockedEmail }
    expect(userEmail(state)).to.equal(mockedEmail)
  })
  it('userState getter', () => {
    const mockedState = userResponse.data.attributes.state
    const state = { state: mockedState }
    expect(userState(state)).to.equal(mockedState)
  })
  it('userType getter', () => {
    const mockedType = userResponse.data.type
    const state = { type: mockedType }
    expect(userType(state)).to.equal(mockedType)
  })
  it('userRejectReason getter', () => {
    const mockedRejectReason = userResponse.data.attributes.reject_reason
    const state = { rejectReason: mockedRejectReason }
    expect(userRejectReason(state)).to.equal(mockedRejectReason)
  })
  it('userCreatedAt getter', () => {
    const mockedCreatedAt = userResponse.data.attributes.created_at
    const state = { createdAt: mockedCreatedAt }
    expect(userCreatedAt(state)).to.equal(mockedCreatedAt)
  })
  it('userFavorites getter', () => {
    const state = { details: { favorites: mockUserFavorites }  }
    expect(userFavorites(state)).to.equal(mockUserFavorites)
  })

})
