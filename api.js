const os = require('os')
const crypto = require('crypto')

const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')

const PORT = 8080

const app = express()
app.use(express.json())

const db = new sqlite3.Database('./users.db')

app.post('/register', (req, res) => {
  const username = req.body.username
  const passwd = req.body.password

  const stmt = db.prepare(`
    INSERT INTO users(username, password, hashed, salted)
    VALUES(?, ?, ?, ?)
  `)

  stmt.run(username, passwd, passwd, passwd)
  stmt.finalize()

  res.status(201)
  res.json({ username: username })
})

app.listen(PORT, () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        username VARCHAR,
        password VARCHAR,
        hashed VARCHAR,
        salted VARCHAR
      )
    `)
  })
  console.log(`Server running at http://${os.hostname()}:${PORT}/`)
})
