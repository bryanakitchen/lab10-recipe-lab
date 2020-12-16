const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('Log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  it('creates a log', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          name: 'flour', 
          measurement: 'cup', 
          amount: 1
        }
      ]
    });
  
    return request(app)
      .post('/api/v1/logs')
      .send({
        dateOfEvent: '2020-10-10',
        notes: 'test',
        rating: 4,
        recipeId: recipe.id
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: expect.any(String),
          notes: 'test',
          rating: 4,
          recipeId: recipe.id
        });
      });
  });
  
  it('gets all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          name: 'flour', 
          measurement: 'cup', 
          amount: 1
        }
      ]
    });
  
    
    const logs = await Promise.all([
      { dateOfEvent: '2020-10-10', notes: 'Low bake', rating: 4, recipeId: recipe.id },
      { dateOfEvent: '2020-10-10', notes: 'Low bake', rating: 4, recipeId: recipe.id },
      { dateOfEvent: '2020-10-10', notes: 'High bake', rating: 4, recipeId: recipe.id }
    ].map(log => Log.insert(log)));
  
    const res = await request(app)
      .get('/api/v1/logs');

    // expect(res.body).toEqual(expect.arrayContaining(logs));
    expect(res.body).toHaveLength(logs.length);

    //   .then(res => {
    //     logs.forEach(log => {
    //       expect(res.body).toContainEqual(log);
    //     });
    //   });
  });
  //   return request(app)
  //   .get('/api/v1/logs')
  //   .then(res => expect(res.body).toEqual(expect.arrayContaining(logs)));
  
  it('updates a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          name: 'flour', 
          measurement: 'cup', 
          amount: 1
        }
      ]
    });
        
    const log = await Log.insert({
      dateOfEvent: '2020-10-10',
      notes: 'test',
      rating: 4,
      recipeId: recipe.id
    });
      
    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        dateOfEvent: '2020-11-01',
        notes: 'bake at 350 degrees',
        rating: 4,
        recipeId: recipe.id
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: expect.any(String),
          notes: 'bake at 350 degrees',
          rating: 4,
          recipeId: recipe.id
        });
      });
  });
  
  it('Gets a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          name: 'flour', 
          measurement: 'cup', 
          amount: 1
        }
      ]
    });
        
    const log = await Log.insert({
      dateOfEvent: '2020-10-10',
      notes: 'test',
      rating: 4,
      recipeId: recipe.id
    });
        
    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: expect.any(String),
          notes: 'test',
          rating: 4,
          recipeId: recipe.id
        });
      });
  });
  
  it('Deletes a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          name: 'flour', 
          measurement: 'cup', 
          amount: 1
        }
      ]
    });
  
    const log = await Log.insert({
      dateOfEvent: '2020-10-10',
      notes: 'test',
      rating: 4,
      recipeId: recipe.id
    });
  
    return request(app)
      .delete(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: expect.any(String),
          notes: 'test',
          rating: 4,
          recipeId: recipe.id
        });
      });
  });
  
});
