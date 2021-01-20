# Grocery Shopping List

Live App: [https://grocery-shopping-list.vercel.app](url)

## Introduction

Grocery shopping list app is a app where user can create grocery  list. Manage expenses for each category and re-used same grocery list for next shopping

Grocery shopping list are divided into five categories main categories:

1. Vegetables
2. Fruits
3. Grains
4. Frozen
5. Miscellaneous  

After a user creates a Grocery Shopping List, they can find it in the "Pending list" column on their "Completed list" dashboard.

Once they've marked a list complete, it moves to the "Completed Lists" column so they can view their shopping list over time.

Both Pending and Completed Lists are visible on the "Grocery List Lists" dashboard if a user clicks on them. This will open up the lists so the user can see when it was created; it's also where users can update/edit their liss and delete them if necessary.

## Technologies

> Node and Express
> Authentication via JWT
> RESTful API

## Testing

> Supertest (integration)
> Mocha and Chai (unit)

## Database
> Postgres
> Knex.js

## Production

Deployed via Heroku

### API Endpoints
## User Router

`- /api/users`
`- - GET - gets all users`
`- - POST - creates a new user`

## Lists Router
`- /api/lists`
`- - GET - gets all lists`
`- - POST - creates a new list`

## Lists/:id Router
- /api/lists/:id 
- - GET - gets list by id 
- - DELETE - deletes a list by id 
- - PATCH - updates a list by id 
- - PUT - marks list complete or incomplete by id 

## Categories Router
`- /api/categories `
`- - GET - gets all categories `

## Categories/:id Router
`- /api/categories/:id`
`- - GET - gets categories by id `



