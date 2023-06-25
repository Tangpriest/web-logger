export interface LoggerProps {
	CollectionName?: string
	DatabaseName?: string
	ObjectStoreName?: string
	UserId?: string
	ClientId?: string
	Modules?: string[],
	Terminal : string,
	Mode?: 'development' | 'production',
	StoragePath : string,
	UploadIntervalTimes : number,
	InitSuccess : () => void
}

export interface FilterProps {
	userId?: string;
	clientId?: string;
	module?: string;
	level?: string;
	startTime?: string;
	endTime?: string;
}