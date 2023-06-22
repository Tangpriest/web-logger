/* eslint-disable no-unused-vars */
const Logger = new window.Logger({
	CollectionName  : 'logs',
	DatabaseName    : 'MyDatabase',
	ObjectStoreName : 'logs',
	UserId          : 'Huangliang',
	ClientId        : 'Huangliang-web',
	Modules         : [ 'User', 'Order' ]
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
	Logger.User.info(generateRandomString())
	Logger.Order.info(generateRandomString())
}

function getLog() {
	
	Logger.getLogs(null, (logs) => {
		console.log('Retrieved logs:', logs);
	}, (error) => {
		console.error('Error getting logs:', error);
	});
}