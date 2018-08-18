'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Note = require('../models/note');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;

  let filter = {};

  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: 'i' };

    // Mini-Challenge: Search both `title` and `content`
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{ 'title': re }, { 'content': re }];
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if(tagId) {
    filter.tags = tagId;
  }

  Note
      .find(filter)
      .populate('tags')
      .sort({ updatedAt: 'desc' })
      .then(results => {
        res.json(results);
    })
      .catch(err => {
        next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note
      .findById(id)
      .populate('tags')
      .then(result => {
        if (result) {
          res.json(result);
      } else {
        next();
      }
    })
      .catch(err => {
        next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newNote = { title, content };

	if (folderId)  {
		if (mongoose.Types.ObjectId.isValid(folderId)) {
			return newNote.folderId = folderId;
		} else {
			const err = new Error('The `id` is not valid');
			err.status = 400;
			return next(err);
		}
	}
	if (tags) {
		for (let i = 0; i < tags.length; i++) {
			if (!mongoose.Types.ObjectId.isValid(tags[i])) {
				const err = new Error('The `id` is not valid');
				err.status = 400;
				return next(err);
			}
		} newNote.tags = tags;
	}

  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateNote = { title, content };

	if (folderId)  {
		if (mongoose.Types.ObjectId.isValid(folderId)) {
			return updateNote.folderId = folderId;
		} else {
			const err = new Error('The `id` is not valid');
			err.status = 400;
			return next(err);
		}
	}

	if (tags) {
		for (let i = 0; i < tags.length; i++) {
			if (!mongoose.Types.ObjectId.isValid(tags[i])) {
				const err = new Error('The `id` is not valid');
				err.status = 400;
				return next(err);
			}
		} let tagsArray = [];
		for (let i = 0; i < tags.length; i++) {
			tagsArray.push(tags[i]);
		} updateNote.tags = tagsArray;
	}

  Note.findByIdAndUpdate(id, updateNote, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

