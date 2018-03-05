/**
 * Tests vuex action
 *
 * @param {object} opts
 * @param {function} opts.action - action to dispatch
 * @param {*} opts.actionPayload - payload action will be dispatched with
 * @param {Array<object>} opts.expectedMutations - mutations expected to be committed inside action call
 * @param {Array<*>} opts.expectedMutationPayloads - expected mutations payloads
 * @param {object} opts.state
 * @param done
 */
export const testAction = (opts, done) => {
  const action = opts.action
  const actionPayload = opts.actionPayload
  const expectedMutations = opts.expectedMutations
  const expectedMutationPayloads = opts.expectedMutationPayloads
  const state = opts.state

  try {
    let count = 0

    const commit = (type, payload) => {
      const expectedMutation = expectedMutations[count]
      const expectedMutationPayload = expectedMutationPayloads[count]

      try {
        expect(expectedMutation.type).to.equal(type)
        if (payload) {
          console.log('mutation payload:')
          console.log(payload)
          console.log('expected payload:')
          console.log(expectedMutationPayload)
          expect(payload).to.deep.equal(expectedMutationPayload)
        }
      } catch (error) {
        done(error)
      }

      count++
      if (count >= expectedMutations.length) {
        done()
      }
    }

    action({ commit, state }, actionPayload)

    if (expectedMutations.length === 0) {
      expect(count).to.equal(0)
      done()
    }
  } catch (e) {
    done(e)
  }
}
