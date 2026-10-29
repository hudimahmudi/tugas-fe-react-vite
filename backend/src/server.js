require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

db.raw('SELECT 1')
  .then(() => console.log('Koneksi database berhasil'))
  .catch((err) => console.error('Koneksi database gagal:', err.message));

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});