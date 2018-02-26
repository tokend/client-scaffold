export const SET_LOGGED_IN_STATE = (state) => {
  state.auth.isLoggedIn = true
}

export const SET_LOGGED_OUT_STATE = (state) => {
  state.auth.isLoggedIn = false
}

export const KEEP_SESSION = () => {}
