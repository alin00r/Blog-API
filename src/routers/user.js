const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/users", async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});
router.post("/users/login", async(req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});
router.post("/users/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});
router.post("/users/logoutAll", auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});
router.get("/users/me", auth, async(req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch("/users/me", auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isVaildOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isVaildOperation) {
        return res.status(400).send({ error: "Invaild Updates!" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        req.user.save();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.delete("/users/me", auth, async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            res.status(404).send({ error: "User not found" });
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/users/:username", async(req, res) => {
    try {
        const user = await User.findOne({
                username: req.params.username,
            })
            .select("-_id")
            .select("-email");

        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|gif|jepg)$/)) {
            return cb(new Error("please upload an image!"));
        }
        cb(undefined, true);
    },
});

router.post(
    "/upload/me/avatar",
    auth,
    upload.single("avatar"),
    async(req, res) => {
        const buffer = await sharp(req.file.buffer)
            .resize({
                width: 250,
                height: 250,
            })
            .png()
            .toBuffer();

        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

router.delete(
    "/upload/me/avatar",
    auth,
    async(req, res) => {
        if (req.user.avatar) {
            req.user.avatar = undefined;
            await req.user.save();
            res.send();
        } else {
            return res.send({ error: "No photo connected to this profile" });
        }
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

router.get("/users/:id/avatar", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            return new Error("404 Not Found!!");
        }
        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});
module.exports = router;