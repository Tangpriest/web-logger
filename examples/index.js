/* eslint-disable no-unused-vars */
const Logger = new window.Logger({
	CollectionName  : 'logs',
	DatabaseName    : 'MyDatabase',
	ObjectStoreName : 'logs',
	UserId          : 'Huangliang',
	ClientId        : 'Huangliang-web',
	Modules         : [ 'User', 'Order' ],
	Mode            : 'development'
});

function generateRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);

		result += characters.charAt(randomIndex);
	}

	return result;
}

function writeLog() {
	Logger.User.info(generateRandomString(50))
	Logger.User.error(generateRandomString(50))
	Logger.User.warn(generateRandomString(50))
	Logger.User.debug(generateRandomString(50))
	Logger.Order.info(generateRandomString(50))
	Logger.Order.error(generateRandomString(50))
	Logger.Order.warn(generateRandomString(50))
	Logger.Order.debug(generateRandomString(50))
}

function getLog() {
	
	Logger.getFilteredLogEntries(null, (logs) => {
		console.log('Retrieved logs:', logs);
	}, (error) => {
		console.error('Error getting logs:', error);
	});
}