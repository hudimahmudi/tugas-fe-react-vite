import { useState } from 'react'

function Register({ onRegister, onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onRegister()
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-card display-center">
        <a className="brand auth-brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark">c</span>
          <span>Creatore<span className="brand-dot">.</span></span>
        </a>
        <div className="auth-heading">
          <h1>Begin your creative journey</h1>
          <p>Create a free account and manage your content ideas with ease.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">Full Name</label>
          <input id="register-name" type="text" placeholder="Enter your full name" value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="6" />
          <label className="remember-option"><input type="checkbox" required /> I agree to the Terms & Conditions</label>
          <button className="button-primary auth-submit" type="submit">Create Free Account</button>
        </form>
        <p className="auth-switch">Already have an account? <button className="text-button" onClick={onLogin}>Log in</button></p>
      </section>
    </main>
  )
}

export default Register
