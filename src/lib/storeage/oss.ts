import OSS from 'ali-oss';
import axios from 'axios';

interface OSSconfig {
  accessKeyId: string;
  accessKeySecret: string;
  SecurityToken: string;
  bucket: string;
  region: string;
}

class OSSClient {
	private client: any;
	private Console: boolean;
	private StoragePath: string;
	private Config!: OSSconfig;

	constructor({ StroagePath }: { StroagePath: string }) {
		this.Console = true;
		this.StoragePath = StroagePath;
	}

	async initClient(initSuccess?: () => void) {
		try {
			const config = await this.getUploadInfo();

			const { region, accessKeyId, accessKeySecret, SecurityToken, bucket } = config;

			this.client = new OSS({
				region          : region,
				accessKeyId     : accessKeyId,
				accessKeySecret : accessKeySecret,
				stsToken        : SecurityToken,
				refreshSTSToken : async () => {
					const info = await this.getUploadInfo();

					return {
						accessKeyId     : info.accessKeyId,
						accessKeySecret : info.accessKeySecret,
						stsToken        : info.SecurityToken
					};
				},
				refreshSTSTokenInterval : 300000,
				bucket                  : bucket
			});

			if (initSuccess) {
				initSuccess();
			}
		}
		catch (error) {}
	}

	async upload(logs: any, path: string) {
		const file = new Blob(logs, { type : 'text/plain' });

		await this.client.put(path, file);
	}

	async getUploadInfo(): Promise<OSSconfig> {
		const getInfoPath = `${this.StoragePath}/app/v1/logger/upload/info`;
		const response = await axios.post(getInfoPath);

		if (response.data.code === 0) {
			const {
				region,
				AccessKeyId: accessKeyId,
				AccessKeySecret: accessKeySecret,
				SecurityToken,
				bucket
			} = response.data.data.config;

			const config = {
				region,
				bucket,
				accessKeyId,
				accessKeySecret,
				SecurityToken
			};

			this.Config = config;

			return config;
		}
		else {
			throw `init oss client error: ${response.data.message}`;
		}
	}

	getConfig() {
		return this.Config;
	}
}

export default OSSClient;
