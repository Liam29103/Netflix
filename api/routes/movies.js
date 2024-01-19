const router = require("express").Router();
const verify = require("../verifyToken");
const Movie = require("../models/Movie");

//Tạo

router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        try {
            const savedMovie = await newMovie.save();
            res.status(200).json(savedMovie);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!");
    }
});

// Cập nhật
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {
                new: true,
            }
        );
        try {
            const savedMovie = await newMovie.save();
            res.status(200).json(updatedMovie);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!");
    }
});
//Xóa
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        await Movie.findByIdAndDelete(req.params.id);
        try {
            const savedMovie = await newMovie.save();
            res.status(200).json("The movie has been delete...");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!");
    }
});

// Lấy

router.get("/find/:id", verify, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});
// Lấy random

router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === "series") {
            movie = await Movie.aggregate([{$match: {isSeries: true}}, {$sample: {size: 1}}]);
        } else {
            movie = await Movie.aggregate([{$match: {isSeries: false}}, {$sample: {size: 1}}]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Lấy all

router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!");
    }
});
module.exports = router;
