const formatError = (status, title, detail) => ({
	errors: [
		{
			status,
			title,
			detail,
		},
	],
});

const formatResponse = (type, data) => ({
	data: {
		type,
		id: data.id,
		attributes: data,
	},
});

module.exports = {
	formatError,
	formatResponse,
};
