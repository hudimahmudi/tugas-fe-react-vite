import { useState } from 'react'

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin()
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <a className="brand auth-brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark">c</span>
          <span>creatoria<span className="brand-dot">.</span></span>
        </a>
        <div className="auth-heading">
          <span className="auth-emoji">👋</span>
          <h1>Selamat datang kembali!</h1>
          <p>Masuk untuk melanjutkan mengatur kontenmu.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <div className="label-row">
            <label htmlFor="login-password">Kata sandi</label>
            <button className="text-button" type="button">Lupa kata sandi?</button>
          </div>
          <input id="login-password" type="password" placeholder="Masukkan kata sandi" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="6" />
          <label className="remember-option"><input type="checkbox" /> Ingat saya</label>
          <button className="button-primary auth-submit" type="submit">Masuk ke akun</button>
        </form>
        <p className="auth-switch">Belum punya akun? <button className="text-button" onClick={onRegister}>Daftar sekarang</button></p>
        <p className="auth-footnote">Dengan masuk, kamu menyetujui <a href="#" onClick={(event) => event.preventDefault()}>Syarat & Ketentuan</a> dan <a href="#" onClick={(event) => event.preventDefault()}>Kebijakan Privasi</a>.</p>
      </section>
      <aside className="auth-side">
        <div className="auth-side-orb orb-one" />
        <div className="auth-side-orb orb-two" />
        <div className="auth-side-content">
          <span className="side-pill">✦ TEMAN KREATIFMU</span>
          <h2>Ide bagus<br />layak jadi nyata.</h2>
          <p>Rencanakan, buat, dan bagikan konten terbaikmu—semua dalam satu alur yang mudah.</p>
          <div className="side-quote">
            <div className="quote-avatars"><span>A</span><span>N</span><span>R</span></div>
            <span>Dipakai kreator untuk berkarya lebih konsisten</span>
          </div>
        </div>
        <span className="side-decoration decoration-one">✳</span>
        <span className="side-decoration decoration-two">✦</span>
      </aside>
    </main>
  )
}

export default Login
