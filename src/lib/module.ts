import Utils from './utils';

class LoggerModule {
	private moduleName: string;
	private Logger: any;
	private Console: boolean;
	private prefix: string;

	constructor({ moduleName, Logger, Console }: { moduleName: string, Logger: any, Console:boolean }) {
		this.moduleName = moduleName;
		this.Logger = Logger;
		this.Console = Console;
		this.prefix = '[LogModule] : ';
	}

	info(message: string, extra?:any) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`${ timestamp } - ${ this.prefix }[Info] [${ this.moduleName }] ${ message}`);
		this.Logger(this.moduleName, 'Info', message, timestamp, extra);
	}

	warn(message: string, extra?:any) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`%c${ timestamp } - ${ this.prefix }[Warn] [${ this.moduleName }] ${ message}`, 'color: orange');
		this.Logger(this.moduleName, 'Warn', message, timestamp, extra);
	}

	error(message: string, extra?:any) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`%c${ timestamp } - ${ this.prefix }[Error] [${ this.moduleName }] ${ message}`, 'color: red');
		this.Logger(this.moduleName, 'Error', message, timestamp, extra);
	}

	debug(message: string, extra?:any) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`%c${ timestamp } - ${ this.prefix }[Debug] [${ this.moduleName }] ${ message}`, 'color: blue');
		this.Logger(this.moduleName, 'Debug', message, timestamp, extra);
	}
}

export default LoggerModule;