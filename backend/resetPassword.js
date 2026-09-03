require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./config/db");

async function resetPassword() {
  try {
    const password = "Recruiter@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password = $1
       WHERE email = $2`,
      [hashedPassword, "recruiter@test.com"]
    );

    console.log("Password updated successfully");

    const result = await pool.query(
      `SELECT password
       FROM users
       WHERE email = $1`,
      ["recruiter@test.com"]
    );

    const matches = await bcrypt.compare(
      password,
      result.rows[0].password
    );

    console.log("Password verification:", matches);

    await pool.end();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

resetPassword();