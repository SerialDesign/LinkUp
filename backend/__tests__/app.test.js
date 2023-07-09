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
  // fs.writeFileSync(
  //   DB_FILE,
  //   JSON.stringify([
  //     {
  //       userId: 'Test',
  //       libraryName: 'Tools',
  //       libraryDesc: '',
  //       libraryColor: '#FEFFE0',
  //       libraryId: '0c02906e-0aad-4bc6-a885-e2186da18781',
  //       links: [
  //         {
  //           url: 'Https://google.com',
  //           description: 'Google',
  //           linkId: '1ef8420d-f1a7-4392-b806-6d36adba98ae'
  //         }
  //       ]
  //     },
  //     {
  //       userId: 'Test',
  //       libraryName: 'Another Library',
  //       libraryDesc: '',
  //       libraryColor: '#FEFFE0',
  //       libraryId: '21e76158-44bd-442c-94d0-3456911aa477',
  //       links: []
  //     }
  //   ])
  // )
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
      },
      {
        userId: 'Cyrill',
        libraryName: 'SAE',
        libraryDesc: 'Enthält Links, welche ich für mein Studium bei der SAE benötige',
        libraryColor: '#C0E5C6',
        libraryId: 'd5f9a570-f9bd-40a2-82a8-da896fc1c39e',
        links: [
          {
            url: 'https://sae.edu',
            description: 'SAE Institute',
            linkId: '1238420d-f1a7-4392-b806-6d36adba98ae'
          },
          {
            url: 'https://canvas.sae.edu/',
            description: 'Canvas',
            linkId: '1234420d-f1a7-4392-b806-6d36adba98ae'
          },
          {
            url: 'https://infoscreen.sae.ch/',
            description: 'Infoscreen',
            linkId: '1234520d-f1a7-4392-b806-6d36adba98ae'
          }
        ]
      },
      {
        userId: 'Cyrill',
        libraryName: 'Arbeit',
        libraryDesc: 'Links die ich für meinen Job benötige',
        libraryColor: '#FAFAA0',
        libraryId: '7a3798a8-31b2-4ebd-9bee-135ab091fd27',
        links: [
          {
            url: 'https://www.migros.ch/de/content/service-pickmup',
            description: 'PickMup',
            linkId: '3218420d-f1a7-4392-b806-6d36adba98ae'
          },
          {
            url: 'https://migros.ch/',
            description: 'Migros',
            linkId: '4321420d-f1a7-4392-b806-6d36adba98ae'
          },
          {
            url: 'https://visualstudio.microsoft.com/de/',
            description: 'Visual Studio Website',
            linkId: '5432120d-f1a7-4392-b806-6d36adba98ae'
          }
        ]
      },
      {
        userId: 'Cyrill',
        libraryName: 'Tools',
        libraryDesc: 'Meine meistverwendeten Tools',
        libraryColor: '#CFECFE',
        libraryId: '039b9fe8-8d5a-4933-a98c-7ed2bc7426a8',
        links: [
          {
            url: 'https://figma.com',
            description: 'Figma',
            linkId: '0218420d-f1a7-4392-b806-6d36adba98ae'
          },
          {
            url: 'https://trello.com',
            description: 'Trello',
            linkId: '0321420d-f1a7-4392-b806-6d36adba98ae'
          },
          {
            url: 'https://reactnative.dev',
            description: 'React Native',
            linkId: '0432120d-f1a7-4392-b806-6d36adba98ae'
          },
          {
            url: 'https://radiooooo.com',
            description: 'Radio',
            linkId: '0321420d-f1a7-4392-b806-6d36adba98ae'
          }
        ]
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
      libraryColor: '#FAFAA0'
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

// describe('Test the /:userId/library/create endpoint with multiple libraries for userId Cyrill', () => {
//   const libraries = [
//     {
//       userId: 'Cyrill',
//       libraryName: 'SAE',
//       libraryDesc: 'Enthält Links, welche ich für mein Studium bei der SAE benötige',
//       libraryColor: '#C0E5C6'
//     },
//     {
//       userId: 'Cyrill',
//       libraryName: 'Arbeit',
//       libraryDesc: 'Links die ich für meinen Job benötige',
//       libraryColor: '#FAFAA0'
//     },
//     {
//       userId: 'Cyrill',
//       libraryName: 'Tools',
//       libraryDesc: 'Meine meistverwendeten Tools',
//       libraryColor: '#CFECFE'
//     }
//   ]

//   libraries.forEach((library, index) => {
//     test(`It should create library ${index + 1} and return its ID`, async () => {
//       const response = await request(app).post(`/${library.userId}/library/create`).send(library)

//       expect(response.statusCode).toBe(200)
//       expect(response.text).toMatch(/^New library created with ID: /)

//       // Check if the new library was added to the database
//       const dbContent = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
//       const newLibraryId = response.text.replace('New library created with ID: ', '')
//       const createdLibrary = dbContent.find((library) => library.libraryId === newLibraryId)

//       expect(createdLibrary).toBeTruthy()
//       expect(createdLibrary.userId).toBe(library.userId)
//       expect(createdLibrary.libraryName).toBe(library.libraryName)
//       expect(createdLibrary.libraryDesc).toBe(library.libraryDesc)
//       expect(createdLibrary.libraryColor).toBe(library.libraryColor)
//     })
//   })
// })

// describe('Test library creation and adding links', () => {
//   let libraryIds = []

//   const libraries = [
//     {
//       userId: 'Cyrill',
//       libraryName: 'SAE',
//       libraryDesc: 'Enthält Links, welche ich für mein Studium bei der SAE benötige',
//       libraryColor: '#C0E5C6'
//     },
//     {
//       userId: 'Cyrill',
//       libraryName: 'Arbeit',
//       libraryDesc: 'Links die ich für meinen Job benötige',
//       libraryColor: '#FEFFE0'
//     },
//     {
//       userId: 'Cyrill',
//       libraryName: 'Tools',
//       libraryDesc: 'Meine meistverwendeten Tools',
//       libraryColor: '#CFECFE'
//     }
//   ]

//   libraries.forEach((library, index) => {
//     test(`It should create library ${index + 1} and return its ID`, async () => {
//       const response = await request(app).post(`/${library.userId}/library/create`).send(library)

//       expect(response.statusCode).toBe(200)
//       expect(response.text).toMatch(/^New library created with ID: /)

//       // Store the ID of the created library for future tests
//       const newLibraryId = response.text.replace('New library created with ID: ', '')
//       libraryIds.push(newLibraryId)

//       // Check if the new library was added to the database
//       const dbContent = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
//       const createdLibrary = dbContent.find((library) => library.libraryId === newLibraryId)

//       expect(createdLibrary).toBeTruthy()
//       expect(createdLibrary.userId).toBe(library.userId)
//       expect(createdLibrary.libraryName).toBe(library.libraryName)
//       expect(createdLibrary.libraryDesc).toBe(library.libraryDesc)
//       expect(createdLibrary.libraryColor).toBe(library.libraryColor)
//     })
//   })

//   const newLinks = [
//     {
//       url: 'https://example1.com',
//       description: 'Example 1'
//     },
//     {
//       url: 'https://example2.org',
//       description: 'Example 2'
//     },
//     {
//       url: 'https://example3.net',
//       description: 'Example 3'
//     }
//   ]

//   libraryIds.forEach((id, index) => {
//     test(`It should add links to library ${index + 1}`, async () => {
//       const response = await request(app)
//         .post(`/Cyrill/library/${id}/links/add`)
//         .send({ links: newLinks })

//       expect(response.statusCode).toBe(200)
//       expect(response.text).toBe(`Links added to library with ID: ${id}`)

//       // Check if the new links were added to the library
//       const dbContent = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
//       const library = dbContent.find((library) => library.libraryId === id)
//       expect(library).toBeTruthy()
//       expect(library.links.length).toBe(newLinks.length)
//       newLinks.forEach((link, linkIndex) => {
//         expect(library.links[linkIndex].url).toBe(link.url)
//         expect(library.links[linkIndex].description).toBe(link.description)
//       })
//     })
//   })
// })

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
