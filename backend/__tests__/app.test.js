const request = require('supertest')
const fs = require('fs')
const app = require('../app') // assuming the test directory is at the root of your project

const DB_FILE = 'database.json' // adjust the path according to your project structure

// beforeEach(() => {
//   // Reset the database before each test
//   fs.writeFileSync(DB_FILE, '[]')
// })

const express = require('express')

beforeEach(() => {
  // Reset the database before each test
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify([
      {
        userId: 'Test',
        libraryName: 'Tools',
        libraryDesc: '',
        libraryColor: '#FEFFE0',
        libraryId: '0c02906e-0aad-4bc6-a885-e2186da18781',
        links: [
          {
            url: 'Https://google.com',
            description: 'Google',
            linkId: '1ef8420d-f1a7-4392-b806-6d36adba98ae'
          }
        ]
      },
      {
        userId: 'Test',
        libraryName: 'Another Library',
        libraryDesc: '',
        libraryColor: '#FEFFE0',
        libraryId: '21e76158-44bd-442c-94d0-3456911aa477',
        links: []
      }
    ])
  )
})

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

describe('Test the root path', () => {
  test('It should respond to the GET method', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Hello, world!')
  })
})

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})

describe('Test the /:userId/library/create endpoint', () => {
  test('It should create a new library and return its ID', async () => {
    const newLibrary = {
      userId: 'Test',
      libraryName: 'New Library',
      libraryDesc: '',
      libraryColor: '#FEFFE0'
    }

    const response = await request(app).post('/Test/library/create').send(newLibrary)

    expect(response.statusCode).toBe(200)
    expect(response.text).toMatch(/^New library created with ID: /)

    // Check if the new library was added to the database
    const dbContent = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    const newLibraryId = response.text.replace('New library created with ID: ', '')
    const createdLibrary = dbContent.find((library) => library.libraryId === newLibraryId)
    expect(createdLibrary).toBeTruthy()
    expect(createdLibrary.userId).toBe(newLibrary.userId)
    expect(createdLibrary.libraryName).toBe(newLibrary.libraryName)
    expect(createdLibrary.libraryDesc).toBe(newLibrary.libraryDesc)
    expect(createdLibrary.libraryColor).toBe(newLibrary.libraryColor)
  })
})

describe('Test the /:userId/library/:libraryId/links/add endpoint', () => {
  test('It should add links to a library', async () => {
    const newLinks = [
      {
        url: 'https://example.com',
        description: 'Example'
      },
      {
        url: 'https://example.org',
        description: 'Example Org'
      }
    ]

    const response = await request(app)
      .post('/Test/library/0c02906e-0aad-4bc6-a885-e2186da18781/links/add')
      .send({ links: newLinks })

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(
      'Links added to library with ID: 0c02906e-0aad-4bc6-a885-e2186da18781'
    )

    // Check if the new links were added to the library
    const dbContent = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    const library = dbContent.find(
      (library) => library.libraryId === '0c02906e-0aad-4bc6-a885-e2186da18781'
    )
    expect(library).toBeTruthy()
    expect(library.links.length).toBe(3)
    expect(library.links[1].url).toBe(newLinks[0].url)
    expect(library.links[1].description).toBe(newLinks[0].description)
    expect(library.links[2].url).toBe(newLinks[1].url)
    expect(library.links[2].description).toBe(newLinks[1].description)
  })
})

describe('Test the /:userId/library/:libraryId endpoint', () => {
  test('It should return a library by ID', async () => {
    const response = await request(app).get('/Test/library/0c02906e-0aad-4bc6-a885-e2186da18781')
    expect(response.statusCode).toBe(200)
    expect(response.body.libraryId).toBe('0c02906e-0aad-4bc6-a885-e2186da18781')
    expect(response.body.libraryName).toBe('Tools')
  })
})

describe('Test the /:userId/libraries endpoint', () => {
  test('It should return all libraries by user ID', async () => {
    const response = await request(app).get('/Test/libraries')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(2)
    expect(response.body[0].userId).toBe('Test')
    expect(response.body[1].userId).toBe('Test')
  })
})

describe('Test the /:userId/library/:libraryId/links endpoint', () => {
  test('It should return all links in a library', async () => {
    const response = await request(app).get(
      '/Test/library/0c02906e-0aad-4bc6-a885-e2186da18781/links'
    )
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].url).toBe('Https://google.com')
    expect(response.body[0].description).toBe('Google')
  })
})

describe('Test the /:userId/libraries/search endpoint', () => {
  test('It should return libraries matching the search query', async () => {
    const response = await request(app).get('/Test/libraries/search?query=tools')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].libraryName).toBe('Tools')
  })
})

describe('Test the /health endpoint', () => {
  test('It should return OK', async () => {
    const response = await request(app).get('/health')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('OK')
  })
})

module.exports = app

// TODO Write your E2E tests here

// describe('Test the /health path', () => {
//   test('It should respond to the GET method', async () => {
//     // ? Jest cannot reach the health endpoint for some reason
//     const response = await request(app).get('/health')
//     expect(response.statusCode).toBe(200)
//   })
// })
