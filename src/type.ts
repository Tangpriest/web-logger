export interface LoggerProps {
	CollectionName?: string
	DatabaseName?: string
	ObjectStoreName?: string
	UserId?: string
	ClientId?: string
	Modules?: string[],
	Mode?: 'development' | 'production'
}

export interface FilterProps {
	userId?: string;
	clientId?: string;
	module?: string;
	level?: string;
	startTime?: string;
	endTime?: string;
}