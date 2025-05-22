const express = require('express');
const request = require('supertest');
const router = require('../../router/general').general;
const books = require('../../router/booksdb.js');

const app = express();
app.use(express.json());
app.use('/', router);

describe('GET /', () => {
  it('should return all books', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(books);
    expect(Object.keys(response.body).length).toBeGreaterThan(0);
  });
});

describe('GET /isbn/:isbn', () => {
  it('should return book details for a given ISBN', async () => {
    const isbn = Object.keys(books)[0];
    const response = await request(app).get(`/isbn/${isbn}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(books[isbn]);
  })
})

describe('GET /author/:author', () => {
  it('should return book details for a given author', async () => {
    const firstBook = books[Object.keys(books)[0]];
    const author = encodeURIComponent(firstBook.author);
    
    const response = await request(app).get(`/author/${author}`);
    expect(response.status).toBe(200);
  });
});

describe('GET /title/:title', () => {
  it('should return book details for a given title', async () => {
    const title = books[Object.keys(books)[0]].title;
    const response = await request(app).get(`/title/${title}`);
    expect(response.status).toBe(200);
    const matchedBooks = {};
    for (const [isbn, book] of Object.entries(books)) {
      if (book.title.toLowerCase() === title.toLowerCase()) {
        matchedBooks[isbn] = book;
      }
    }
    expect(response.body).toEqual(matchedBooks);
  })
})

describe('GET /review/:isbn', () => {
  it('should return book review for a given ISBN', async () => {
    const isbn = Object.keys(books)[0];
    const response = await request(app).get(`/review/${isbn}`);
    expect(response.status).toBe(200);
  })
})
