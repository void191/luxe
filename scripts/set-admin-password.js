const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function setAdminPassword() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:marewan19@localhost:5432/luxe_db'
  });

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hashedPassword);
    
    const result = await pool.query(
      `UPDATE users SET password = $1, first_name = 'Admin', last_name = 'User' WHERE email = 'admin@example.com' RETURNING email`,
      [hashedPassword]
    );
    
    console.log('Updated user:', result.rows[0]);
    console.log('Admin password set to: admin123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

setAdminPassword();
