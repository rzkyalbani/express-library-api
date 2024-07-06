const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { Book, Author } = require('../models');
const { formatError, formatResponse } = require('../utils/jsonApiFormatter');

const router = express.Router();

// Route untuk menambahkan buku baru
router.post(
	'/',
	[
		body('title').notEmpty().withMessage('Title is required'),
		body('authorId').isInt().withMessage('Author ID must be an integer'),
		body('publishedDate')
			.isISO8601()
			.withMessage('Published Date must be a valid date'),
		body('isbn').notEmpty().withMessage('ISBN is required'),
		body('genre').notEmpty().withMessage('Genre is required'),
		body('availableCopies')
			.isInt({ min: 0 })
			.withMessage('Available Copies must be a non-negative integer'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(
				formatError(
					'400',
					'Validation Error',
					errors
						.array()
						.map((e) => e.msg)
						.join(', ')
				)
			);
		}

		try {
			const author = await Author.findByPk(req.body.authorId);
			if (!author) {
				return res
					.status(400)
					.json(formatError('400', 'Invalid Reference', 'Invalid authorId'));
			}

			const book = await Book.create(req.body);
			res.status(201).json(formatResponse('books', book));
		} catch (error) {
			console.error('Error:', error);
			res
				.status(500)
				.json(
					formatError(
						'500',
						'Internal Server Error',
						'An unexpected error occurred'
					)
				);
		}
	}
);

// Route untuk mendapatkan semua buku
router.get('/', async (req, res) => {
	try {
		const books = await Book.findAll({
			include: {
				model: Author,
				attributes: ['id', 'name', 'bio'],
			},
		});

		const response = {
			data: books.map((book) => ({
				type: 'books',
				id: book.id,
				attributes: {
					title: book.title,
					publishedDate: book.publishedDate,
					isbn: book.isbn,
					genre: book.genre,
					availableCopies: book.availableCopies,
				},
				author: {
					data: {
						id: book.Author.id,
						attributes: {
							name: book.Author.name,
							bio: book.Author.bio,
						},
					},
				},
			})),
		};

		res.status(200).json(response);
	} catch (error) {
		console.error('Error:', error);
		res
			.status(500)
			.json(
				formatError(
					'500',
					'Internal Server Error',
					'An unexpected error occurred'
				)
			);
	}
});

// Route untuk mendapatkan buku berdasarkan ID
router.get(
	'/:id',
	[param('id').isInt().withMessage('Book ID must be an integer')],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(
				formatError(
					'400',
					'Validation Error',
					errors
						.array()
						.map((e) => e.msg)
						.join(', ')
				)
			);
		}

		try {
			const book = await Book.findByPk(req.params.id, {
				include: {
					model: Author,
					attributes: ['id', 'name', 'bio'],
				},
			});

			if (!book) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Book not found'));
			}

			const response = {
				data: {
					type: 'books',
					id: book.id,
					attributes: {
						title: book.title,
						publishedDate: book.publishedDate,
						isbn: book.isbn,
						genre: book.genre,
						availableCopies: book.availableCopies,
					},
					author: {
						data: {
							id: book.Author.id,
							attributes: {
								name: book.Author.name,
								bio: book.Author.bio,
							},
						},
					},
				},
			};

			res.status(200).json(response);
		} catch (error) {
			console.error('Error:', error);
			res
				.status(500)
				.json(
					formatError(
						'500',
						'Internal Server Error',
						'An unexpected error occurred'
					)
				);
		}
	}
);

// Route untuk memperbarui buku berdasarkan ID
router.put(
	'/:id',
	[
		param('id').isInt().withMessage('Book ID must be an integer'),
		body('title').optional().notEmpty().withMessage('Title cannot be empty'),
		body('authorId')
			.optional()
			.isInt()
			.withMessage('Author ID must be an integer'),
		body('publishedDate')
			.optional()
			.isISO8601()
			.withMessage('Published Date must be a valid date'),
		body('isbn').optional().notEmpty().withMessage('ISBN cannot be empty'),
		body('genre').optional().notEmpty().withMessage('Genre cannot be empty'),
		body('availableCopies')
			.optional()
			.isInt({ min: 0 })
			.withMessage('Available Copies must be a non-negative integer'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(
				formatError(
					'400',
					'Validation Error',
					errors
						.array()
						.map((e) => e.msg)
						.join(', ')
				)
			);
		}

		try {
			const book = await Book.findByPk(req.params.id);
			if (!book) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Book not found'));
			}

			if (req.body.authorId) {
				const author = await Author.findByPk(req.body.authorId);
				if (!author) {
					return res
						.status(400)
						.json(formatError('400', 'Invalid Reference', 'Invalid authorId'));
				}
			}

			await book.update(req.body);

			const updatedBook = await Book.findByPk(req.params.id, {
				include: {
					model: Author,
					attributes: ['id', 'name', 'bio'],
				},
			});

			const response = {
				data: {
					type: 'books',
					id: updatedBook.id,
					attributes: {
						title: updatedBook.title,
						publishedDate: updatedBook.publishedDate,
						isbn: updatedBook.isbn,
						genre: updatedBook.genre,
						availableCopies: updatedBook.availableCopies,
					},
					relationships: {
						author: {
							data: {
								type: 'authors',
								id: updatedBook.Author.id,
								attributes: {
									name: updatedBook.Author.name,
									bio: updatedBook.Author.bio,
								},
							},
						},
					},
				},
			};

			res.status(200).json(response);
		} catch (error) {
			console.error('Error:', error);
			res
				.status(500)
				.json(
					formatError(
						'500',
						'Internal Server Error',
						'An unexpected error occurred'
					)
				);
		}
	}
);

// Route untuk menghapus buku berdasarkan ID
router.delete(
	'/:id',
	[param('id').isInt().withMessage('Book ID must be an integer')],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(
				formatError(
					'400',
					'Validation Error',
					errors
						.array()
						.map((e) => e.msg)
						.join(', ')
				)
			);
		}

		try {
			const book = await Book.findByPk(req.params.id);
			if (!book) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Book not found'));
			}

			await book.destroy();

			res.status(200).json({ message: 'Book successfully deleted' });
		} catch (error) {
			console.error('Error:', error);
			res
				.status(500)
				.json(
					formatError(
						'500',
						'Internal Server Error',
						'An unexpected error occurred'
					)
				);
		}
	}
);

module.exports = router;
