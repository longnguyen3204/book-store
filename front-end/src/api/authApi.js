const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  let data = null
  try {
    data = await response.json()
  } catch (error) {
    // ignore parse error, will handle below
  }

  if (!response.ok) {
    const message = data?.message || 'Đăng nhập thất bại'
    throw new Error(message)
  }

  return data
}

export default {
  login,
}
