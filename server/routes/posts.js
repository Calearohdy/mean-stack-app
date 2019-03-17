const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer')
const authGuard = require('../middleware/checkAuth');

// GLOBAL
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// multer storing image uploads
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error('Invalid File Type');
        if(isValid) {
            error = null
        }

        callback(null, 'server/images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});


router.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize; // + parses to number
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    // selected posts
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            console.log(error)
        })
});

router.post('', authGuard, multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    })
})


router.put("/:id", authGuard, multer({storage: storage}).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');        
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    })
    Post.updateOne({_id: req.params.id}, post)
        .then(result => {
            res.status(200).json({message: "Update Successful"})
        })
})

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post noy found'})
        }
    })
})

router.delete("/:id", authGuard, (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result);
        })
    res.status(200).json({message: "Post deleted"})
});

module.exports = router;