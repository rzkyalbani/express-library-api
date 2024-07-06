const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Borrower = sequelize.define(
	'Borrower',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		membershipDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);

module.exports = Borrower;
