const ACCESS_KEY = "auth.access_token"
const REFRESH_KEY = "auth.refresh_token"
const CSRF_KEY = "auth.csrf_token"

export const getTokens = () => ({
  accessToken: localStorage.getItem(ACCESS_KEY),
  refreshToken: localStorage.getItem(REFRESH_KEY),
  csrfToken: localStorage.getItem(CSRF_KEY),
})

export const setTokens = ({ accessToken, refreshToken, csrfToken }) => {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  if (csrfToken) localStorage.setItem(CSRF_KEY, csrfToken)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(CSRF_KEY)
}
