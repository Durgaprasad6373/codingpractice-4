const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

app.use(express.json())

const path = require('path')

const databasePath = path.join(__dirname, 'cricketTeam.db')

const database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log(`Server Running at http:/localhost:3000/ `),
    )
  } catch (error) {
    console.log(`DB Error : ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `
        SELECT * FROM cricket_team`

  const playerArray = await db.all(getPlayerQuery)
  response.send(
    playerArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = '${playerId}'`
  const player = await db.get(getPlayerQuery)
  response.send(convertDbObjectToResponseObject(player))
})

app.post('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const postPlayerQuery = `INSERT INTO cricket_team 
        (player_name, jersey_number, role)
    VALUES ('${playerName}', '${jerseyNumber}', '${role}')`

  const player = await db.run(postPlayerQuery)
  response.send('Player Added to Team')
})

app.put('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = request.body
  const updatePlayerQuery = `UPDATE cricket_team 
  SET 
    player_name : '${playerName}',
    jersey_number : '${jerseyNumber}',
    role : '${role}'
  WHERE 
    player_id = '${playerId}'; `

  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = '${playerId}'`

  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
