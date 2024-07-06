const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define(
	'Book',
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		authorId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Authors', // Nama tabel yang direferensikan
				key: 'id',
			},
		},
		publishedDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isbn: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		genre: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		availableCopies: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		deletedAt: DataTypes.DATE,
	},
	{ paranoid: true }
);

module.exports = Book;
