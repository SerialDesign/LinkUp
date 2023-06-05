const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express()

// TODO Check if the newly created UUIDs already exist in the database (add Library & Link)
// TODO Check again.. if the user exists in all endpoints --> function checkIfUserIdHasValue(userId).. or how to check in endpoint?

// Instantiate the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const DB_FILE = 'database.json'

// Check if the database file exists, if not create an empty array
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '[]')
}

// Health check endpoint
app.get('/health', (_req, res) => {
  console.log('Health check requested')
  res.send('OK')
})

// Create a new library, get ID back
app.post('/:userId/library/create', (req, res) => {
  const newLibrary = req.body
  // Dani suggests:
  // const newLibrary = {
  //   ...req.body,
  //   libraryId: uuidv4()
  // }

  newLibrary.links = []
  newLibrary.libraryId = uuidv4()

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)
    console.log(newLibrary)

    database.push(newLibrary)

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`New library created with ID: ${newLibrary.libraryId}`)
    })
  })
})

// Add links to a library
app.post('/:userId/library/:libraryId/links/add', (req, res) => {
  // const newLinks = req.body.links

  const newLinks = req.body.links.map((link) => ({
    ...link,
    linkId: uuidv4() // Generate a unique linkId using uuidv4
  }))

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)

    const filteredDatabase = database.filter(
      (library) => library.libraryId === req.params.libraryId
    )

    if (filteredDatabase.length === 0) {
      return res.status(404).send('Library not found')
    }

    const library = filteredDatabase[0]

    library.links.push(...newLinks)

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`Links added to library with ID: ${library.libraryId}`)
    })
  })
})

// Get a library by ID
app.get('/:userId/library/:libraryId', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    const database = JSON.parse(data)
    const filteredDatabase = database.filter(
      (library) => library.libraryId === req.params.libraryId
    )

    if (filteredDatabase.length === 0) {
      return res.status(404).send('Library not found')
    }

    res.send(filteredDatabase[0])
  })
})

// Get all libraries by user ID
app.get('/:userId/libraries', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    const database = JSON.parse(data)
    const filteredDatabase = database.filter((library) => library.userId === req.params.userId)

    res.send(filteredDatabase)
  })
})

// Get all links in a library
app.get('/:userId/library/:libraryId/links', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    const database = JSON.parse(data)
    const filteredDatabase = database.filter(
      (library) => library.libraryId === req.params.libraryId
    )

    if (filteredDatabase.length === 0) {
      return res.status(404).send('Library not found')
    }

    res.send(filteredDatabase[0].links)
  })
})

app.get('/:userId/libraries/search', (req, res) => {
  const query = req.query.query.toLowerCase()

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    const database = JSON.parse(data)
    const filteredDatabase = database.filter((library) => {
      return (
        library.userId === req.params.userId && library.libraryName.toLowerCase().includes(query)
      )
    })

    if (filteredDatabase.length === 0) {
      return res.status(404).send('Library not found')
    }

    res.send(filteredDatabase)
  })
})

app.put('/userId/library/:libraryId/links', (req, res) => {
  const newLinks = req.body.links

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)

    const library = database.find((library) => library.libraryId === req.params.libraryId)

    if (!library) {
      return res.status(404).send('Library not found')
    }

    library.links.push(...newLinks)

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`Links added to library with ID: ${library.libraryId}`)
    })
  })
})

app.delete('/:userId/library/:libraryId/links', (req, res) => {
  const removeLinks = req.body.links // Expecting an array of link IDs to remove

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)

    const library = database.find((library) => library.libraryId === req.params.libraryId)

    if (!library) {
      return res.status(404).send('Library not found')
    }

    library.links = library.links.filter((link) => !removeLinks.includes(link.id))

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`Links removed from library with ID: ${library.libraryId}`)
    })
  })
})
app.delete('/:userId/library/:libraryId/links/delete', (req, res) => {
  console.log('is in delete link endpoint')
  const linkId = req.params.linkId // Retrieve linkId from URL parameter
  console.log('🚀 ~ file: app.js:245 ~ app.delete ~ linkId:', linkId)

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)

    const library = database.find((library) => library.libraryId === req.params.libraryId)

    if (!library) {
      return res.status(404).send('Library not found')
    }

    const linkIndex = library.links.findIndex((link) => link.id === linkId)

    if (linkIndex === -1) {
      return res.status(404).send('Link not found')
    }

    library.links.splice(linkIndex, 1)

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      const response = {
        message: `Link removed from library with ID: ${library.libraryId}`
      }

      res.json(response)
    })
  })
})

module.exports = app
