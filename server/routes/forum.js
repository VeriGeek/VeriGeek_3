const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

// Get all questions with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;
    const search = req.query.search;
    const sort = req.query.sort || '-createdAt';
    const unanswered = req.query.unanswered === 'true';

    let query = {};

    // Apply tag filter
    if (tag) {
      query.tags = tag;
    }

    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply unanswered filter
    if (unanswered) {
      query.$or = [
        { comments: { $size: 0 } },
        { comments: { $exists: false } }
      ];
    }

    // Get total count for pagination
    const total = await Question.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Determine the sort order
    let sortOptions = {};
    if (sort === 'likes') {
      // Special handling for likes - sort by number of likes
      sortOptions = { 'likes.length': -1 };
    } else if (sort.startsWith('-')) {
      sortOptions[sort.substring(1)] = -1;
    } else {
      sortOptions[sort] = 1;
    }

    // Get questions with pagination
    const questions = await Question.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .populate('comments.author', 'name');

    res.json({
      questions,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.author', 'name email');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new question
router.post('/', auth, async (req, res) => {
  try {
    const question = new Question({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      codeSnippet: req.body.codeSnippet,
      author: req.user._id,
    });

    const newQuestion = await question.save();
    await newQuestion.populate('author', 'name');
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a comment to a question
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.comments.push({
      content: req.body.content,
      codeSnippet: req.body.codeSnippet,
      author: req.user._id,
    });

    await question.save();
    await question.populate('comments.author', 'name');
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like a question
router.post('/:id/like', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const likeIndex = question.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      question.likes.push(req.user._id);
    } else {
      question.likes.splice(likeIndex, 1);
    }

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update question difficulty
router.patch('/:id/difficulty', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.difficulty = req.body.difficulty;
    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a question (only by author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is author or admin
    if (question.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 