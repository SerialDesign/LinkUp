const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express()

// TODO Check again.. if the user exists in all endpoints --> function checkIfUserIdHasValue(userId).. or how to check in endpoint?

// Instantiate the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const DB_FILE = 'database.json'

// Helper method to check if UUID already exists in database
const checkifUUIDExists = (uuid, database) => {
  return database.some((library) => library.libraryId === uuid)
}

// Check if the database file exists, if not create an empty array
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '[]')
}

// POSTs
// Create a new library, get ID back
app.post('/:userId/library/create', (req, res) => {
  const newLibrary = req.body
  // Dani suggests:
  // const newLibrary = {
  //   ...req.body,
  //   libraryId: uuidv4()
  // }

  // Generate a new UUID
  newLibrary.libraryId = uuidv4()

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)

    // Check if UUID already exists in the database
    if (checkifUUIDExists(newLibrary.libraryId, database)) {
      console.log('couldnt create library - UUID already exists')
      //TODO- show visual feedback in app, if UUID does already exist..
      return res.status(400).send('UUID already exists')
    }

    newLibrary.links = []

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

app.put('/:userId/library/:libraryId', (req, res) => {
  const { userId, libraryId } = req.params
  const { libraryName, libraryDesc } = req.body

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)

    // Find the library in the database
    const libraryIndex = database.findIndex(
      (lib) => lib.userId === userId && lib.libraryId === libraryId
    )

    if (libraryIndex !== -1) {
      // Update the library data
      database[libraryIndex].libraryName = libraryName
      database[libraryIndex].libraryDesc = libraryDesc

      // Write the updated data back to the database
      fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
        if (err) {
          console.error(err)
          return res.status(500).send('Error writing to database')
        }

        // Return the updated library data as JSON
        res.json(database[libraryIndex])
      })
    } else {
      // Return a not found response if the library was not found
      res.status(404).send('Library not found')
    }
  })
})

app.put('/:userId/library/:libraryId/favorite', (req, res) => {
  const userId = req.params.userId
  const libraryId = req.params.libraryId

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)
    let libraryIndex = database.findIndex(
      (lib) => lib.libraryId === libraryId && lib.userId === userId
    )

    // Check if library exists in the database
    if (libraryIndex === -1) {
      return res.status(404).send('Library not found')
    }

    // Set the library as favorited
    database[libraryIndex].favorited = true

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`Library ${libraryId} was set as favorite`)
    })
  })
})

app.delete('/:userId/library/:libraryId/favorite', (req, res) => {
  const userId = req.params.userId
  const libraryId = req.params.libraryId

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)
    let libraryIndex = database.findIndex(
      (lib) => lib.libraryId === libraryId && lib.userId === userId
    )

    // Check if library exists in the database
    if (libraryIndex === -1) {
      return res.status(404).send('Library not found')
    }

    // Set the library as unfavorited
    database[libraryIndex].favorited = false

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`Library ${libraryId} was set as not favorite`)
    })
  })
})

// Add links to a library
app.post('/:userId/library/:libraryId/links/add', (req, res) => {
  // const newLinks = req.body.links

  const newLinks = req.body.links.map((link) => ({
    ...link,
    linkId: uuidv4()
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

    // Check if any of the linkIds already exist in the library
    const duplicateLinkIds = newLinks.filter((link) =>
      library.links.some((existingLink) => existingLink.linkId === link.linkId)
    )

    if (duplicateLinkIds.length > 0) {
      console.log('couldnt add link to library - Duplicate linkIds/UUID found')
      //TODO- show visual feedback in app, if linkId/UUID does already exist..
      return res.status(400).send('Duplicate linkIds found')
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

// GETs
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

app.get('/:userId/libraries/favorited', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    const database = JSON.parse(data)
    const filteredDatabase = database.filter(
      (library) => library.userId === req.params.userId && library.favorited === true
    )

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

/// ------------------ NOT IN USE YET ------------------
// Todo: get all favorite links in a library
// Get all favorited links in a library (NOT IN USE YET)
app.get('/:userId/library/:libraryId/links/favorited', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    const database = JSON.parse(data)
    const filteredLibrary = database.find(
      (library) =>
        library.libraryId === req.params.libraryId && library.userId === req.params.userId
    )

    if (!filteredLibrary) {
      return res.status(404).send('Library not found')
    }

    const favoritedLinks = filteredLibrary.links.filter((link) => link.favorited === true)

    res.send(favoritedLinks)
  })
})

// Todo: favorite a link
// Favorite a link (NOT IN USE YET)
app.put('/:userId/library/:libraryId/link/:linkId/favorite', (req, res) => {
  const userId = req.params.userId
  const libraryId = req.params.libraryId
  const linkId = req.params.linkId

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)
    let libraryIndex = database.findIndex(
      (lib) => lib.libraryId === libraryId && lib.userId === userId
    )

    // Check if library exists in the database
    if (libraryIndex === -1) {
      return res.status(404).send('Library not found')
    }

    let linkIndex = database[libraryIndex].links.findIndex((link) => link.linkId === linkId)

    // Check if link exists in the library
    if (linkIndex === -1) {
      return res.status(404).send('Link not found')
    }

    // Set the link as favorited
    database[libraryIndex].links[linkIndex].favorited = true

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`Link ${linkId} was set as favorite`)
    })
  })
})

// Todo: search libraries over backend (at the moment only frontend)
// search libraries
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
/// ------------------ NOT IN USE YET ------------------

// Health check endpoint
app.get('/health', (_req, res) => {
  console.log('Health check requested')
  res.send('OK')
})

// PUT
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

// DELETE

// Todo change endpoint to singular link instead of links
// DELETE Link
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

// DELETE Library
app.delete('/:userId/library/:libraryId', (req, res) => {
  const libraryId = req.params.libraryId // Retrieve libraryId from URL parameter
  // console.log('🚀 ~ file: app.js:245 ~ app.delete ~ libraryId:', libraryId)

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

    // remove lirary from database
    database = database.filter((library) => library.libraryId !== libraryId)

    fs.writeFile(DB_FILE, JSON.stringify(database), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error writing to database')
      }

      res.send(`Library removed with ID: ${libraryId}`)
    })
  })
})

app.delete('/:userId/library/:libraryId/links/:linkId/delete', (req, res) => {
  console.log('is in delete link endpoint')
  const linkId = req.params.linkId
  // console.log('🚀 ~ file: app.js:245 ~ app.delete ~ linkId:', linkId)

  fs.readFile(DB_FILE, (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading from database')
    }

    let database = JSON.parse(data)

    // Log the entire database
    // console.log('🚀 ~ Database: ', JSON.stringify(database, null, 2))

    // Convert libraryId to string before finding it in the database
    const libraryId = req.params.libraryId.toString()
    const library = database.find((library) => library.libraryId === libraryId)

    // Log libraryId and the found library
    // console.log('🚀 ~ Looking for libraryId: ', libraryId)
    // console.log('🚀 ~ Found library: ', JSON.stringify(library, null, 2))

    if (!library) {
      return res.status(404).send('Library not found')
    }

    // Add this line to log all links of the library
    // console.log('🚀 ~ Links in library: ', JSON.stringify(library.links, null, 2))

    const linkIndex = library.links.findIndex((link) => link.linkId === linkId)

    // Log the link index
    // console.log('🚀 ~ Found link at index: ', linkIndex)

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
