import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'aos/dist/aos.css'
import './assets/css/normalize.css'
import './assets/icomoon/icomoon.css'
import './assets/css/vendor.css'
import './assets/css/style.css'
import './index.css'
import LoginPage from './pages/Auth/LoginPage.jsx'
import App from './App.jsx'

const Root = () => {
  const [isAuthed, setIsAuthed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = () => {
    // TODO: replace with real auth; currently just toggles to home
    setIsAuthed(true)
    setShowLogin(false)
  }

  const handleAccountClick = () => {
    setShowLogin(true)
  }

  if (showLogin) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <App onAccountClick={handleAccountClick} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
