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
    <main className="auth-page">
      <section className="auth-card">
        <a className="brand auth-brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark">c</span>
          <span>creatoria<span className="brand-dot">.</span></span>
        </a>
        <div className="auth-heading">
          <span className="auth-emoji">✨</span>
          <h1>Mulai perjalanan kreatifmu</h1>
          <p>Buat akun gratis dan atur ide kontenmu dengan lebih mudah.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">Nama lengkap</label>
          <input id="register-name" type="text" placeholder="Contoh: Alya Putri" value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="register-password">Kata sandi</label>
          <input id="register-password" type="password" placeholder="Minimal 6 karakter" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="6" />
          <label className="remember-option"><input type="checkbox" required /> Saya setuju dengan Syarat & Ketentuan</label>
          <button className="button-primary auth-submit" type="submit">Buat akun gratis</button>
        </form>
        <p className="auth-switch">Sudah punya akun? <button className="text-button" onClick={onLogin}>Masuk</button></p>
      </section>
      <aside className="auth-side register-side">
        <div className="auth-side-orb orb-one" />
        <div className="auth-side-orb orb-two" />
        <div className="auth-side-content">
          <span className="side-pill">✦ SEMUA IDE, SATU TEMPAT</span>
          <h2>Lebih fokus<br />pada karyamu.</h2>
          <p>Catat ide, atur jadwal, dan lihat proses kontenmu berkembang dari awal sampai terbit.</p>
          <div className="mini-pipeline">
            <span>Ide <b>✓</b></span><i>→</i><span>Produksi <b>◷</b></span><i>→</i><span>Terbit <b>✦</b></span>
          </div>
        </div>
        <span className="side-decoration decoration-one">✳</span>
        <span className="side-decoration decoration-two">✦</span>
      </aside>
    </main>
  )
}

export default Register
