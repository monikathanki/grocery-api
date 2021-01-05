const express = require("express");
const CategoriesService = require("./categories-service");
const { requireAuth } = require("../middleware/jwt-auth");

const categoriesRouter = express.Router();

categoriesRouter
    .route("/")

    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get("db");
        CategoriesService.getAllCats(knexInstance)
            .then((cats) => {
                res.json(cats);
            })
            .catch(next);
    });

categoriesRouter.route("/:id").all(requireAuth, (req, res, next) => {
    CategoriesService.getById(req.app.get("db"), req.params.id)
        .then((cat) => {
            if (!cat) {
                return res.status(404).json({
                    error: { message: `cat doesn't exist` },
                });
            }
            res.cat = cat;
            next();
        })
        .catch(next);
});

module.exports = categoriesRouter;