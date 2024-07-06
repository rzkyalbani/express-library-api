const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BorrowingRecord = sequelize.define(
	'BorrowingRecord',
	{
		bookId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Books', // Nama tabel yang direferensikan
				key: 'id',
			},
		},
		borrowerId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Borrowers', // Nama tabel yang direferensikan
				key: 'id',
			},
		},
		borrowDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		returnDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM('Borrowed', 'Returned'),
			allowNull: false,
		},
	},
	{}
);

module.exports = BorrowingRecord;
