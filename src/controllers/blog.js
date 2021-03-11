const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog');

exports.createBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Input value tidak sesuai!');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if (!req.file) {
        const err = new Error('Image harus diupload!');
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: { uid: 1, name: 'Bintang Ramadhan' }
    })

    Posting.save()
        .then(result => {
            res.status(201).json({
                message: "Create Blog Post Success",
                data: result
            });
        })
        .catch(err => {
            console.log('err: ', err)
        })

}

exports.getAllBlogPost = (req, res, next) => {
    BlogPost.find()
        .then(result => {
            res.status(200).json({
                message: 'Data Blog Post Berhasil Dipanggil',
                data: result
            })
        })
        .catch(err => {
            next(err);
        })
}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
        .then(result => {
            if (!result) {
                const err = new Error('Blog Post tidak ditemukan!');
                err.errorStatus = 404;
                throw err;
            }
            res.status(200).json({
                message: 'Data Blog Berhasil dipanggil!',
                data: result,
            })
        })
        .catch(err => {
            next(err)
        })
}

exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Input value tidak sesuai!');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if (!req.file) {
        const err = new Error('Image harus diupload!');
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const postId = req.params.postId;

    BlogPost.findById(postId)
        .then(post => {
            if (!post) {
                const err = new Error('Blog Post tidak ditemukan!');
                err.errorStatus = 404;
                throw err;
            }

            post.title = title;
            post.body = body;
            post.image = image;

            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Update Success',
                data: result,
            })
        })
        .catch(err => {
            next(err);
        })

}