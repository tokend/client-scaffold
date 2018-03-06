import Vuex from 'vuex'

const store = new Vuex.Store({
  getters: {
    userAccountId: () => "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
    balances: () => ({
      SUN: 'BARTKK7F4V7P6FKLKG46B2ALF7HY5LEGEHBX2A2BVNZ76YJOX64QLRGV'
    })
  }
})

export default store
