const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const {
	sequelize,
	Book,
	Author,
	Borrower,
	BorrowingRecord,
} = require('./models/index');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

const booksRouter = require('./routes/books.route');
const authorsRouter = require('./routes/authors.route');
const borrowersRouter = require('./routes/borrowers.route');
const borrowingRecordsRouter = require('./routes/borrowingRecords.route');

app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/borrowers', borrowersRouter);
app.use('/api/borrowing-records', borrowingRecordsRouter);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
	sequelize
		.authenticate()
		.then(() => {
			console.log('Database connected...');
		})
		.catch((err) => {
			console.log('Error: ' + err);
		});
});
