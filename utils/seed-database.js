'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tags');

console.log(MONGODB_URI);

const seedNotes = require('../db/seed/notes');
const seedFolders = require('../db/seed/folders');
const seedTags = require('../db/seed/tags');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Note.insertMany(seedNotes);
  })
    .then(() => {
    	return Folder.insertMany(seedFolders);
    })
	.then(() => {
		return Tag.insertMany(seedTags);
	})
	.then(() => {
		console.info('Indexing the Database');
		return Folder.createIndexes();
	})
	.then(() => {
		return Tag.createIndexes();
	})
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
    db.disconnect();
  });
