const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Author = sequelize.define(
	'Author',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		bio: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{}
);

module.exports = Author;
