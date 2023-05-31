const request = require('supertest')
const fs = require('fs')
const app = require('../app') // assuming the test directory is at the root of your project

const DB_FILE = 'database.json' // adjust the path according to your project structure

beforeEach(() => {
  // Reset the database before each test
  fs.writeFileSync(DB_FILE, '[]')
})

// describe('Sample Test', () => {
//   it('should test that true === true', () => {
//     expect(true).toBe(true)
//   })
// })

// TODO Write your E2E tests here

// describe('Test the /health path', () => {
//   test('It should respond to the GET method', async () => {
//     // ? Jest cannot reach the health endpoint for some reason
//     const response = await request(app).get('/health')
//     expect(response.statusCode).toBe(200)
//   })
// })
