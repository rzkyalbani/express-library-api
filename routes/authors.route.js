const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { Author, Book } = require('../models');
const { formatError, formatResponse } = require('../utils/jsonApiFormatter');

const router = express.Router();

// Route untuk menambahkan penulis baru
router.post(
	'/',
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('bio').optional().isString().withMessage('Bio must be a string'),
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
			const author = await Author.create(req.body);
			res.status(201).json(formatResponse('authors', author));
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

// Route untuk mendapatkan semua penulis
router.get('/', async (req, res) => {
	try {
		const authors = await Author.findAll({
			include: {
				model: Book,
				attributes: ['id', 'title'],
			},
		});

		const response = {
			data: authors.map((author) => ({
				type: 'authors',
				id: author.id,
				attributes: {
					name: author.name,
					bio: author.bio,
				},
				books: {
					data: author.Books.map((book) => ({
						id: book.id,
						title: book.title,
					})),
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

// Route untuk mendapatkan penulis berdasarkan ID
router.get(
	'/:id',
	[param('id').isInt().withMessage('Author ID must be an integer')],
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
			const author = await Author.findByPk(req.params.id, {
				include: {
					model: Book,
					attributes: ['id', 'title'],
				},
			});

			if (!author) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Author not found'));
			}

			const response = {
				data: {
					type: 'authors',
					id: author.id,
					attributes: {
						name: author.name,
						bio: author.bio,
					},
					books: {
						data: author.Books.map((book) => ({
							id: book.id,
							title: book.title,
						})),
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

// Route untuk memperbarui penulis berdasarkan ID
router.put(
	'/:id',
	[
		param('id').isInt().withMessage('Author ID must be an integer'),
		body('name').optional().notEmpty().withMessage('Name cannot be empty'),
		body('bio').optional().isString().withMessage('Bio must be a string'),
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
			const author = await Author.findByPk(req.params.id);
			if (!author) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Author not found'));
			}

			await author.update(req.body);

			const updatedAuthor = await Author.findByPk(req.params.id, {
				include: {
					model: Book,
					attributes: ['id', 'title'],
				},
			});

			const response = {
				data: {
					type: 'authors',
					id: updatedAuthor.id,
					attributes: {
						name: updatedAuthor.name,
						bio: updatedAuthor.bio,
					},
					books: {
						data: updatedAuthor.Books.map((book) => ({
							id: book.id,
							title: book.title,
						})),
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

// Route untuk menghapus penulis berdasarkan ID
router.delete(
	'/:id',
	[param('id').isInt().withMessage('Author ID must be an integer')],
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
			const author = await Author.findByPk(req.params.id);
			if (!author) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Author not found'));
			}

			await author.destroy();

			res.status(200).json({ message: 'Author successfully deleted' });
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
