const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
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
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
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
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [], ingredients: [] },
      { name: 'cake', directions: [], ingredients: [] },
      { name: 'pie', directions: [], ingredients: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
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
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
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
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
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
      });
  });

  it('Finds all logs associated with a given Recipe by Recipe ID via GET', async() => {

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

    await Promise.all([
      { dateOfEvent: '2020-10-10', notes: 'Low bake', rating: 4, recipeId: recipe.id },
      { dateOfEvent: '2020-10-10', notes: 'Low bake', rating: 4, recipeId: recipe.id },
      { dateOfEvent: '2020-10-10', notes: 'High bake', rating: 4, recipeId: recipe.id }
    ].map(log => Log.insert(log)));

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => { 
        expect(res.body).toEqual({
          ...recipe,
          logs: expect.arrayContaining([
            { id: '1', dateOfEvent: '2020-10-10', notes: 'Low bake', rating: 4, recipeId: recipe.id },
            { id: '2', dateOfEvent: '2020-10-10', notes: 'Low bake', rating: 4, recipeId: recipe.id },
            { id: '3', dateOfEvent: '2020-10-10', notes: 'High bake', rating: 4, recipeId: recipe.id }      
          ])
        });
      });
  });

  // id: expect.any(String),
  // name: 'cookies',
  // directions: [
  //   'preheat oven to 375',
  //   'mix ingredients',
  //   'put dough on cookie sheet',
  //   'bake for 10 minutes'
  // ],  
  // ingredients: [
  //   {
  //     name: 'flour', 
  //     measurement: 'cup', 
  //     amount: 1
  //   }
  // ]    


  it('Deletes a recipe by id', async() => {
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
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
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
      });

  });

});
