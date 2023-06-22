class Utils {
	static getFormattedDate() {
		const currentDate = new Date();

		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
		const day = String(currentDate.getDate()).padStart(2, '0');
		const hours = String(currentDate.getHours()).padStart(2, '0');
		const minutes = String(currentDate.getMinutes()).padStart(2, '0');
		const seconds = String(currentDate.getSeconds()).padStart(2, '0');
		const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

		const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

		return formattedDate

	}

	static generateRandomString(length) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
  
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);

			result += characters.charAt(randomIndex);
		}
  
		return result;
	}
}

module.exports = Utils