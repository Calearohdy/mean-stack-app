const Post = require('../models/post');

exports.getAllPosts = (req, res, next) => {
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
            res.status(500).json({
                message: "Unable to retreive the posts"
            })
        })
}

exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post noy found'})
        }
    }).catch(error => res.status(500).json({
        message: "Unable to retrieve any posts"
    }));
}

exports.createNewPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
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
    .catch(error => {
        res.status(500).json({
            message: "Unable to create the post. Please try again"
        })
    })
}

exports.updatePost =  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');        
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({message: "Update Successful"})
            } else {
                res.status(401).json({message: "Not Authorized"})
            }
        }).catch(error => res.status(500).json({
            message: "Unable to update the post. Please try again"
        }
    ));
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
        if (result.n > 0) {
            res.status(200).json({message: "Post Successful Deleted"})
        } else {
            res.status(401).json({message: "Not Authorized"})
        }
    }).catch(error => res.status(500).json({
        message: "Unable to delete the post"
    }));
}