const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { BorrowingRecord, Book, Borrower } = require('../models');
const { formatError, formatResponse } = require('../utils/jsonApiFormatter');

const router = express.Router();

// CREATE: Menambahkan record peminjaman baru
router.post(
	'/',
	[
		body('bookId').isInt().withMessage('Book ID must be an integer'),
		body('borrowerId').isInt().withMessage('Borrower ID must be an integer'),
		body('borrowDate').isISO8601().withMessage('Valid borrow date is required'),
		body('returnDate')
			.optional()
			.isISO8601()
			.withMessage('Valid return date is required'),
		body('status')
			.isIn(['Borrowed', 'Returned'])
			.withMessage('Status must be either Borrowed or Returned'),
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
			const book = await Book.findByPk(req.body.bookId);
			const borrower = await Borrower.findByPk(req.body.borrowerId);

			if (!book || !borrower) {
				return res
					.status(400)
					.json(
						formatError(
							'400',
							'Invalid Reference',
							'Invalid bookId or borrowerId'
						)
					);
			}

			const borrowingRecord = await BorrowingRecord.create(req.body);
			res.status(201).json(formatResponse('borrowingRecords', borrowingRecord));
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

// READ: Mendapatkan semua record peminjaman
router.get('/', async (req, res) => {
	try {
		const borrowingRecords = await BorrowingRecord.findAll({
			include: [
				{ model: Book, attributes: ['id', 'title'] },
				{ model: Borrower, attributes: ['id', 'name'] },
			],
		});

		const response = {
			data: borrowingRecords.map((record) => ({
				type: 'borrowingRecords',
				id: record.id,
				attributes: {
					borrowDate: record.borrowDate,
					returnDate: record.returnDate,
					status: record.status,
				},
				book: {
					data: {
						id: record.Book.id,
						type: 'books',
						title: record.Book.title,
					},
				},
				borrower: {
					data: {
						id: record.Borrower.id,
						type: 'borrowers',
						name: record.Borrower.name,
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

// READ: Mendapatkan record peminjaman berdasarkan ID
router.get(
	'/:id',
	[param('id').isInt().withMessage('Borrowing Record ID must be an integer')],
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
			const borrowingRecord = await BorrowingRecord.findByPk(req.params.id, {
				include: [
					{ model: Book, attributes: ['id', 'title'] },
					{ model: Borrower, attributes: ['id', 'name'] },
				],
			});

			if (!borrowingRecord) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Borrowing Record not found'));
			}

			const response = {
				data: {
					type: 'borrowingRecords',
					id: borrowingRecord.id,
					attributes: {
						borrowDate: borrowingRecord.borrowDate,
						returnDate: borrowingRecord.returnDate,
						status: borrowingRecord.status,
					},

					book: {
						data: {
							id: borrowingRecord.Book.id,
							type: 'books',
							title: borrowingRecord.Book.title,
						},
					},
					borrower: {
						data: {
							id: borrowingRecord.Borrower.id,
							type: 'borrowers',
							name: borrowingRecord.Borrower.name,
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

// UPDATE: Memperbarui record peminjaman berdasarkan ID
router.put(
	'/:id',
	[
		param('id').isInt().withMessage('Borrowing Record ID must be an integer'),
		body('bookId').optional().isInt().withMessage('Book ID must be an integer'),
		body('borrowerId')
			.optional()
			.isInt()
			.withMessage('Borrower ID must be an integer'),
		body('borrowDate')
			.optional()
			.isISO8601()
			.withMessage('Valid borrow date is required'),
		body('returnDate')
			.optional()
			.isISO8601()
			.withMessage('Valid return date is required'),
		body('status')
			.optional()
			.isIn(['Borrowed', 'Returned'])
			.withMessage('Status must be either Borrowed or Returned'),
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
			const borrowingRecord = await BorrowingRecord.findByPk(req.params.id);
			if (!borrowingRecord) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Borrowing Record not found'));
			}

			if (req.body.bookId) {
				const book = await Book.findByPk(req.body.bookId);
				if (!book) {
					return res
						.status(400)
						.json(formatError('400', 'Invalid Reference', 'Invalid bookId'));
				}
			}

			if (req.body.borrowerId) {
				const borrower = await Borrower.findByPk(req.body.borrowerId);
				if (!borrower) {
					return res
						.status(400)
						.json(
							formatError('400', 'Invalid Reference', 'Invalid borrowerId')
						);
				}
			}

			await borrowingRecord.update(req.body);

			const updatedRecord = await BorrowingRecord.findByPk(req.params.id, {
				include: [
					{ model: Book, attributes: ['id', 'title'] },
					{ model: Borrower, attributes: ['id', 'name'] },
				],
			});

			const response = {
				data: {
					type: 'borrowingRecords',
					id: updatedRecord.id,
					attributes: {
						borrowDate: updatedRecord.borrowDate,
						returnDate: updatedRecord.returnDate,
						status: updatedRecord.status,
					},

					book: {
						data: {
							id: updatedRecord.Book.id,
							type: 'books',
							title: updatedRecord.Book.title,
						},
					},
					borrower: {
						data: {
							id: updatedRecord.Borrower.id,
							type: 'borrowers',
							name: updatedRecord.Borrower.name,
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

// DELETE: Menghapus record peminjaman berdasarkan ID
router.delete(
	'/:id',
	[param('id').isInt().withMessage('Borrowing Record ID must be an integer')],
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
			const borrowingRecord = await BorrowingRecord.findByPk(req.params.id);
			if (!borrowingRecord) {
				return res
					.status(404)
					.json(formatError('404', 'Not Found', 'Borrowing Record not found'));
			}

			await borrowingRecord.destroy();

			res
				.status(200)
				.json({ message: 'Borrowing Record successfully deleted' });
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
