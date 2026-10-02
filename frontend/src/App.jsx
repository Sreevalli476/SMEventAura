import { usePath } from './lib/router'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import FeaturedDecorations from './components/FeaturedDecorations'
import WhyChooseUs from './components/WhyChooseUs'
import Contact from './components/Contact'

import Gallery from './pages/Gallery'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import AdminSignUp from './pages/AdminSignUp'
import AdminDashboard from './pages/AdminDashboard'

import './App.css'

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <FeaturedDecorations />
        <WhyChooseUs />
        <Contact />
      </main>
    </>
  )
}

function App() {
  const path = usePath()

  if (path === '/') {
    return <Home />
  }

  if (path === '/gallery') {
    return (
      <>
        <Navbar />
        <Gallery />
      </>
    )
  }

  if (path === '/login') {
    return <Login />
  }

  if (path === '/signup') {
    return <SignUp />
  }

  if (path === '/dashboard') {
    return <Dashboard />
  }

  if (path === '/admin/login') {
    return <AdminLogin />
  }

  if (path === '/admin/signup') {
    return <AdminSignUp />
  }

  if (path === '/admin/dashboard') {
    return <AdminDashboard />
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h1>Page Not Found</h1>
        <p>The page you requested does not exist.</p>
      </div>
    </>
  )
}

export default App