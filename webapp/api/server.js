require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const config = require("../../config.js");

const app = express()
app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Middleware to verify JWT
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) throw new Error('No token provided')
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// Discord OAuth endpoints
app.post('/auth/discord', async (req, res) => {
  try {
    const { code } = req.body
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
      scope: 'identify',
    })

    // Get user info from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
    })

    // Check if user is admin
    const [admins] = await pool.query('SELECT discord_id FROM user WHERE discord_id IN (?)', [config.bot.adminIDs])
    const isAdmin = admins.some(admin => admin.discord_id === userResponse.data.id)

    const token = jwt.sign(
      { 
        id: userResponse.data.id,
        username: userResponse.data.username,
        isAdmin 
      },
      process.env.JWT_SECRET
    )

    res.json({ token, user: { id: userResponse.data.id, username: userResponse.data.username, isAdmin } })
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' })
  }
})

// User wallet endpoints
app.get('/wallet/:userId', auth, async (req, res) => {
  try {
    const [user] = await pool.query('SELECT * FROM user WHERE discord_id = ?', [req.params.userId])
    if (!user.length) throw new Error('User not found')

    const [transactions] = await pool.query(`
      SELECT * FROM (
        SELECT * FROM deposits WHERE address = ? 
        UNION ALL 
        SELECT * FROM withdrawals WHERE discord_id = ?
        UNION ALL
        SELECT * FROM payments WHERE from_discord_id = ? OR to_discord_id = ?
      ) AS combined 
      ORDER BY datetime DESC LIMIT 10
    `, [user[0].deposit_address, req.params.userId, req.params.userId, req.params.userId])

    res.json({
      balance: user[0].balance,
      stakeBalance: user[0].stake_balance,
      depositAddress: user[0].deposit_address,
      transactions
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Admin endpoints
app.get('/admin/stats', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new Error('Unauthorized')

    const [[totalUsers]] = await pool.query('SELECT COUNT(*) as count FROM user')
    const [[totalBalance]] = await pool.query('SELECT SUM(balance) as sum FROM user')
    const [[totalStaked]] = await pool.query('SELECT SUM(stake_balance) as sum FROM user')
    
    const [recentTransactions] = await pool.query(`
      SELECT * FROM (
        SELECT * FROM deposits
        UNION ALL 
        SELECT * FROM withdrawals
        UNION ALL
        SELECT * FROM payments
      ) AS combined 
      ORDER BY datetime DESC LIMIT 10
    `)

    const [topHolders] = await pool.query(`
      SELECT * FROM user 
      ORDER BY (balance + stake_balance) DESC 
      LIMIT 10
    `)

    res.json({
      totalUsers: totalUsers.count,
      totalBalance: totalBalance.sum,
      totalStaked: totalStaked.sum,
      recentTransactions,
      topHolders
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})