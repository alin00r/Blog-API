const express = require("express");
const Blog = require("../models/blog");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/blog", auth, async(req, res) => {
    const blog = new Blog({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await blog.save();
        res.status(201).send(blog);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.get("/blogs", auth, async(req, res) => {
    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: "blogs",
            options: {
                limit: parseInt(req.query.limit || 0),
                skip: parseInt(req.query.skip || 0),
                sort,
            },
        });
        res.send(req.user.blogs);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.post("/search", async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Blog.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { text: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            ],
        });
        res.send(data);
    } catch (error) {
        console.log(error);
    }
});

router.get("/blogs/:id", auth, async(req, res) => {
    const _id = req.params.id;
    try {
        const blog = await Blog.findOne({ _id, owner: req.user._id });
        if (!blog) {
            return res.status(404).send();
        }
        res.status(200).send(blog);
    } catch (e) {
        res.status(500).send();
    }
});
router.patch("/blogs/:id", auth, async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["text", "title"];
    const isVaildOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isVaildOperation) {
        return res.status(400).send({ error: "Invaild Updates!" });
    }

    try {
        const blog = await Blog.findOne({ _id, owner: req.user._id });

        if (!blog) {
            res.status(404).send();
        }
        updates.forEach((update) => (blog[update] = req.body[update]));
        blog.save();
        res.status(200).send(blog);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});
router.delete("/blogs/:id", auth, async(req, res) => {
    const _id = req.params.id;
    try {
        const blog = await Blog.findOneAndDelete({ _id, owner: req.user._id });
        if (!blog) {
            res.status(404).send();
        }
        res.send(blog);
    } catch (e) {
        res.status(400).send(e);
    }
});
module.exports = router;