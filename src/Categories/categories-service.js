const CategoriesService = {
    getAllCats(knex) {
        return knex.select("*").from("categories");
    },
    getById(knex, id) {
        return knex.from("categories").select("*").where("id", id).first();
    },
};

module.exports = CategoriesService;