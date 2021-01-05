function makeUsersArray() {
    return [
        {
            id: 1,
            username: "Demo_user1",
            password: "Pa$$123!",
            name: "John",
            date_created: "2020-01-03T00:00:00.000Z",
        },
        {
            id: 2,
            username: "Demo_user2",
            password: "Pa$$133!",
            name: "James",
            date_created: "2020-01-03T00:00:00.000Z",
        },
        {
            id: 3,
            username: "Demo_user3",
            password: "Pa$$143!",
            name: "Kevin",
            date_created: "2020-01-03T00:00:00.000Z",
        },
    ];
}

function seedUsers(db, users) {

}

module.exports = {
    makeUsersArray,
};