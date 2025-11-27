require("dotenv").config({ path: __dirname + "/../.env" });
const db = require("../config/db");

async function run() {
  console.log("⏳ Running migration...");

  const queries = [
    `
   CREATE TABLE IF NOT EXISTS about_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'section_1', 'section_2'
  title_ar VARCHAR(255),
  title_en VARCHAR(255),
  content_ar TEXT,
  content_en TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

   `,
  ];
  //   CREATE TABLE IF NOT EXISTS about_sections (
  //   id INT AUTO_INCREMENT PRIMARY KEY,
  //   section_key VARCHAR(50) UNIQUE,
  //   content TEXT,
  //   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //     ON UPDATE CURRENT_TIMESTAMP
  // ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  // const queries = [
  //   `DROP TABLE IF EXISTS users`,

  //   `CREATE TABLE IF NOT EXISTS users (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     username VARCHAR(100) NOT NULL UNIQUE,
  //     password_hash VARCHAR(255) NOT NULL,
  //     role ENUM('owner','admin','editor','user') DEFAULT 'editor',
  //     display_name VARCHAR(255),
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  //   `CREATE TABLE IF NOT EXISTS settings (
  //     id INT PRIMARY KEY AUTO_INCREMENT,
  //     site_name VARCHAR(255) DEFAULT 'Post Offices',
  //     site_description TEXT,
  //     logo VARCHAR(255),
  //     logo_dark VARCHAR(255),
  //     phone VARCHAR(50),
  //     email VARCHAR(255),
  //     address VARCHAR(255),
  //     default_language VARCHAR(10) DEFAULT 'ar',
  //     dark_mode TINYINT(1) DEFAULT 0,
  //     google_ads_header TEXT,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  //   `INSERT INTO settings (site_name)
  //    SELECT 'Post Offices'
  //    WHERE NOT EXISTS (SELECT 1 FROM settings)`,

  //   `ALTER TABLE post_offices
  //     ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,

  //   `ALTER TABLE post_offices
  //     ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,

  //   `ALTER TABLE post_offices
  //     ADD FULLTEXT KEY ft_name_address (name, address)`
  // ];

  try {
    for (const q of queries) {
      console.log("➡️ Executing:", q.split("\n")[0]);
      await db.query(q);
    }

    console.log("✅ Migration executed successfully.");
  } catch (err) {
    console.error("❌ Migration Error:", err);
  } finally {
    db.end();
  }
}

run();
