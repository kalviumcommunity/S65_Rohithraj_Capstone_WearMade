const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const postController = require('../controllers/postController');
const { upload, handleMulterError } = require('../config/uploadConfig');

router.post('/', auth, upload.array('images'), handleMulterError, postController.addPost);
router.put('/:postId', auth, upload.array('images'), handleMulterError, postController.editPost);
router.delete('/:postId', auth, postController.deletePost);
router.post('/:postId/like', auth, postController.likePost);
router.post('/:postId/comment', auth, postController.commentOnPost);
router.get('/:postId', auth, postController.getPost);
router.get('/user/:userId', postController.getPostsByUser);
router.get('/', postController.getExplorePosts);

module.exports = router;
