const sequelize = require('../config/database');
const Book = require('./book.model');
const Author = require('./author.model');
const Borrower = require('./borrower.model');
const BorrowingRecord = require('./borrowingRecord.model');

// Definisikan relasi antar model
Book.belongsTo(Author, { foreignKey: 'authorId' });
Author.hasMany(Book, { foreignKey: 'authorId' });

BorrowingRecord.belongsTo(Book, { foreignKey: 'bookId' });
Book.hasMany(BorrowingRecord, { foreignKey: 'bookId' });

BorrowingRecord.belongsTo(Borrower, { foreignKey: 'borrowerId' });
Borrower.hasMany(BorrowingRecord, { foreignKey: 'borrowerId' });

// Sinkronisasi dengan database
sequelize.sync({ force: false }).then(() => {
	console.log('Database & tables created!');
});

module.exports = {
	sequelize,
	Book,
	Author,
	Borrower,
	BorrowingRecord,
};
