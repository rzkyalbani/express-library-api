const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { Borrower, BorrowingRecord, Book } = require('../models');
const { formatError, formatResponse } = require('../utils/jsonApiFormatter');

const router = express.Router();

// Route untuk menambahkan peminjam baru
router.post(
	'/',
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('email').isEmail().withMessage('Valid email is required'),
		body('membershipDate')
			.isISO8601()
			.withMessage('Valid membership date is required'),
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
			if (!req.body.membershipDate || req.body.membershipDate.trim() === '')
				delete req.body.membershipDate;

			const borrower = await Borrower.create(req.body);
			res.status(201).json(formatResponse('borrowers', borrower));
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

// Route untuk mendapatkan semua peminjam
router.get('/', async (req, res) => {
	try {
		const borrowers = await Borrower.findAll({
			include: {
				model: BorrowingRecord,
				include: {
					model: Book,
					attributes: ['id', 'title'],
				},
			},
		});

		const response = {
			data: borrowers.map((borrower) => ({
				type: 'borrowers',
				id: borrower.id,
				attributes: {
					name: borrower.name,
					email: borrower.email,
					membershipDate: borrower.membershipDate,
				},
				borrowingRecords: {
					data: borrower.BorrowingRecords.map((record) => ({
						id: record.id,
						book: {
							id: record.Book.id,
							title: record.Book.title,
						},
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

// Route untuk mendapatkan peminjam berdasarkan ID
router.get(
	'/:id',
	[param('id').isInt().withMessage('Borrower ID must be an integer')],
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
			const borrower = await Borrower.findByPk(req.params.id, {
				include: {
					model: BorrowingRecord,
					include: {
						model: Book,
						attributes: ['id', 'title'],
					},
				},
			});

			if (!borrower) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Borrower not found'));
			}

			const response = {
				data: {
					type: 'borrowers',
					id: borrower.id,
					attributes: {
						name: borrower.name,
						email: borrower.email,
						membershipDate: borrower.membershipDate,
					},
					borrowingRecords: {
						data: borrower.BorrowingRecords.map((record) => ({
							id: record.id,
							book: {
								id: record.Book.id,
								title: record.Book.title,
							},
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

// Route untuk memperbarui peminjam berdasarkan ID
router.put(
	'/:id',
	[
		param('id').isInt().withMessage('Borrower ID must be an integer'),
		body('name').optional().notEmpty().withMessage('Name cannot be empty'),
		body('email').optional().isEmail().withMessage('Valid email is required'),
		body('membershipDate')
			.optional()
			.isISO8601()
			.withMessage('Valid membership date is required'),
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
			const borrower = await Borrower.findByPk(req.params.id);
			if (!borrower) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Borrower not found'));
			}

			await borrower.update(req.body);

			const updatedBorrower = await Borrower.findByPk(req.params.id, {
				include: {
					model: BorrowingRecord,
					include: {
						model: Book,
						attributes: ['id', 'title'],
					},
				},
			});

			const response = {
				data: {
					type: 'borrowers',
					id: updatedBorrower.id,
					attributes: {
						name: updatedBorrower.name,
						email: updatedBorrower.email,
						membershipDate: updatedBorrower.membershipDate,
					},
					borrowingRecords: {
						data: updatedBorrower.BorrowingRecords.map((record) => ({
							id: record.id,
							book: {
								id: record.Book.id,
								title: record.Book.title,
							},
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

// Route untuk menghapus peminjam berdasarkan ID
router.delete(
	'/:id',
	[param('id').isInt().withMessage('Borrower ID must be an integer')],
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
			const borrower = await Borrower.findByPk(req.params.id);
			if (!borrower) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Borrower not found'));
			}

			await borrower.destroy();

			res.status(200).json({ message: 'Borrower successfully deleted' });
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
