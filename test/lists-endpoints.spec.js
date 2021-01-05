const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')
const { makeUsersArray } = require('./users.fixtures');
const { makeCatArray } = require('./categories.fixtures');
const { makeListsArray } = require('./lists.fixtures')


describe(`lists service object`, function () {
    let db;
    let authToken


    before(`setup db`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set("db", db);
    });

    beforeEach("register and login", () => {
        let users = makeUsersArray();
        return supertest(app)
            .post("/api/users")
            .send(users[0]).then((res) => {
                return supertest(app)
                    .post("/api/auth/login")
                    .send(users[0])
                    .then((res2) => {
                        authToken = res2.body.authToken;

                    });
            });

    });
    function makeAuthHeader(user) {
        const testUser = { password: user.password, username: user.username };
        return supertest(app)
            .post('/login')
            .set('Authorization', `Bearer ${authToken}`)
            .send(testUser);
    }
    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db.raw("TRUNCATE users, categories, lists RESTART IDENTITY CASCADE"));

    afterEach('cleanup', () =>
        db.raw('TRUNCATE users, categories, lists RESTART IDENTITY CASCADE')
    );
    describe(`GET/api/lists`, () => {
        context(`Given no lists`, () => {
            it(`responds with 200 and and empty list`, () => {
                return supertest(app)
                    .get("/api/lists")
                    .set("Authorization", `Bearer ${authToken}`)
                    .expect(200, []);
            });
        });
        context("Given there are lists in db", () => {
            const testUsers = makeUsersArray();
            const testLists = makeListsArray();
            const testCats = makeCatArray();

            beforeEach("insert lists", () => {
                return db
                    .into("users").insert(testUsers)
                    .then(() => {
                        return db.into("categories").insert(testCats);
                    })
                    .then(() => {
                        return db.into("lists").insert(testLists);
                    });

            });
            it("Responds with 200 and all of the lists", () => {
                return supertest(app)
                    .get("/api/list")
                    .set("Authorization", `Bearer ${authToken}`)
                    .expect(200, testLists)
            });
        });
    });
    describe(`GET /api/lists/:id`, () => {
        context(`Given no lists`, () => {
            it(`responds with 404`, () => {
                const listId = 123456;
                return supertest(app)
                    .get(`/api/lists/${listId}`).set("Authorization", `Bearer ${authToken}`).expect(404, { error: { message: `List doesn't exict` } });
            });
        });
        context("Given there are lists in the database", () => {
            const testUsers = makeUsersArray();
            const testLists = makeListsArray();
            const testCats = makeCatArray();

            beforeEach("insert lists", () => {
                return db
                    .into("users")
                    .insert(testUsers)
                    .then(() => {
                        return db.into("categories").insert(testCats);
                    })
                    .then(() => {
                        return db.into("lists").insert(testLists)
                    });
            });
            it("responds with 200 and the specified list", () => {
                const listId = 2;
                const expectedList = testLists[listId - 1];
                return supertest(app)
                    .get(`/api/lists/${listId}`).set("Authorization", `Bearer ${authToken}`).expect(200, expectedList);
            });

        });
    });
    describe(`POST /api/lists`, () => {
        const testUsers = makeUsersArray();
        const testCats = makeCatArray();
        beforeEach("insert list", () => {
            return db
                .into("users")
                .insert(testUsers)
                .then(() => {
                    return db.into("categories").insert(testCats)
                });
        });
        it(`create a list, responding with 201 and the new list`, () => {
            const newList = {
                id: 1,
                category: "Vegetables",
                name: "test new list",
                note: "test list note",
                price: "2.05",
                weight: "2 lbs",
                checked: false,
                category_id: 1,
                user_id: 1,

            };
            return supertest(app)
                .post("/api/lists")
                .set("Authorization", `Bearer ${authToken}`)
                .send(newList)
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).to.eql(newList.id);
                    expect(res.body.category).to.eql(newList.category);
                    expect(res.body.name).to.eql(newList.name);
                    expect(res.body.note).to.eql(newList.note);
                    expect(res.body.price).to.eql(newList.price);
                    expect(res.body.weight).to.eql(newList.weight);
                    expect(res.body.checked).to.eql(newList.checked);
                    expect(res.body.category_id).to.eql(newList.category_id);
                    expect(res.body.user_id).to.eql(newList.user_id);
                    expect(res.body).to.have.property("id");
                    expect(res.header.location).to.eql(`/api/lists/${res.body.id}`);
                    const expected = new Intl.DateTimeFormat("en-US").format(new Date());
                    const actual = new Intl.DateTimeFormat("en-US").format(
                        new Date(res.body.start_date)
                    );
                    expect(actual).to.eql(expected);

                })
                .then((res) =>
                    supertest(app).get(`/api/lists/${res.body.id}`)
                        .set("Authorization", `Bearer ${authToken}`)
                        .expect(res.body)
                );
        });
        const requireFields = [
            "category",
            "name",
            "note",
            "price",
            "weight",
            "checked",
            "category_id",
            "user_id",
        ];

        requireFields.forEach((field) => {
            const newList = {
                category: "Vegetables",
                name: "Tomato",
                note: "next week new deal",
                price: "$2.50",
                weight: "2 lbs",
                checked: false,
                category_id: 1,
                user_id: 1,
            };

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newList[field];

                return supertest(app)
                    .post("/api/lists")
                    .set("Authorization", `Bearer ${authToken}`)
                    .send(newList).expect(400, {
                        error: { message: `Missing '${field}' in request body` },
                    });
            });
        });
    });
    describe(`DELETE /api/lists/:id`, () => {
        context(`Given no lists`, () => {
            it(`responds with 404`, () => {
                const listId = 123456;
                return supertest(app)
                    .post("/api/lists")
                    .set("Authorization", `Bearer ${authToken}`).expect(404, { error: { message: `List doesn't exist` } });
            });
        });
        context("Given there are lists in the database", () => {
            const testUsers = makeUsersArray();
            const testCats = makeCatArray();
            const testLists = makeListsArray();

            beforeEach("insert list", () => {
                return db
                    .into("users")
                    .insert(testUsers)
                    .then(() => {
                        return db.into("categories").insert(testCats);
                    })
                    .then(() => {
                        return db.into("lists").insert(testLists);
                    });
            });
            it("responds with 204 and removes the list", () => {
                const idToRemove = 2;
                const expectedList = testLists.filter(
                    (list) => list.id !== idToRemove
                );
                return supertest(app)
                    .delete(`/api/lists/${idToRemove}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .expect(204)
                    .then((res) => {
                        supertest(app).get(`/api/lists`).expect(expectedList);
                    });
            });
        });
    });
    describe(`PATCH /api/lists/:id`, () => {
        context(`Given no lists`, () => {
            it(`responds with 404`, () => {
                const testId = 123456;
                return supertest(app)
                    .delete(`/api/lists/${testId}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .expect(404, { error: { message: `List doesn't exist` } });
            });
        });

        context("Given there are lists in the database", () => {
            const testUsers = makeUsersArray();
            const testCats = makeCatArray();
            const testLists = makeListsArray();

            beforeEach("insert lists", () => {
                return db
                    .into("users")
                    .insert(testUsers)
                    .then(() => {
                        return db.into("categories").insert(testCats);
                    })
                    .then(() => {
                        return db.into("lists").insert(testLists);
                    });
            });
            it("responds with 204 and updates the lists", () => {
                const idToUpdate = 2;
                const updateList = {
                    category: "Vegetables",
                    name: "Tomato",
                    note: "next week new deal",
                    price: "$2.50",
                    weight: "2 lbs",
                    checked: false,
                    category_id: 1,
                    user_id: 1,
                };
                const expectedList = {
                    ...testLists[idToUpdate - 1],
                    ...updateList,
                };
                return supertest(app)
                    .patch(`/api/lists/${idToUpdate}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .send(updateList)
                    .expect(204)
                    .then((res) =>
                        supertest(app)
                            .get(`/api/lists/${idToUpdate}`)
                            .set("Authorization", `Bearer ${authToken}`)
                            .expect(expectedList)
                    );
            });
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2;
                return supertest(app)
                    .patch(`/api/lists/${idToUpdate}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .send({ irrelevantField: "foo" })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'name' or 'note'`,
                        },
                    });
            });
            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2;
                const updateList = {
                    title: "updated list name",
                };
                const expectedList = {
                    ...testLists[idToUpdate - 1],
                    ...updateList,
                };
                return supertest(app)
                    .patch(`/api/lists/${idToUpdate}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .send({
                        ...updateList,
                        fieldToIgnore: "should not be in GET response",
                    })
                    .expect(204)
                    .then((res) =>
                        supertest(app)
                            .get(`/api/lists/${idToUpdate}`)
                            .set("Authorization", `Bearer ${authToken}`)
                            .expect(expectedList)
                    );
            });
        });
    });
    describe(`PUT /api/lists/:id`, () => {
        context(`Given no lists`, () => {
            it(`responds with 404`, () => {
                const testId = 123456;
                return supertest(app)
                    .delete(`/api/lists/${testId}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .expect(404, { error: { message: `List doesn't exist` } });
            });
        });
        context("Given there are lists in the database", () => {
            const testUsers = makeUsersArray();
            const testCats = makeCatArray();
            const testLists = makeListsArray();

            beforeEach("insert lists", () => {
                return db
                    .into("users")
                    .insert(testUsers)
                    .then(() => {
                        return db.into("categories").insert(testCats);
                    })
                    .then(() => {
                        return db.into("lists").insert(testLists);
                    });
            });
            it("responds with 204 and updates the list", () => {
                const idToUpdate = 2;
                const updateList = {
                    id: 2,
                    checked: false,
                };
                const expectedList = {
                    ...testLists[idToUpdate - 1],
                    ...updateList,
                };

                return supertest(app)
                    .patch(`/api/lists/${idToUpdate}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .send(updateList)
                    .expect(204)
                    .then((res) =>
                        supertest(app)
                            .get(`/api/lists/${idToUpdate}`)
                            .set("Authorization", `Bearer ${authToken}`)
                            .expect(expectedList)
                    );
            });
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2;
                return supertest(app)
                    .patch(`/api/lists/${idToUpdate}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .send({ irrelevantField: "foo" })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'note' or 'name'`,
                        },
                    });
            });

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2;
                const updateList = {
                    checked: true,
                };
                const expectedList = {
                    ...testLists[idToUpdate - 1],
                    ...updateList,
                };

                return supertest(app)
                    .patch(`/api/lists/${idToUpdate}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .send({
                        ...updateList,
                        fieldToIgnore: "should not be in GET response",
                    })
                    .expect(204)
                    .then((res) =>
                        supertest(app)
                            .get(`/api/lists/${idToUpdate}`)
                            .set("Authorization", `Bearer ${authToken}`)
                            .expect(expectedList)
                    );
            });
        });
    });
});
