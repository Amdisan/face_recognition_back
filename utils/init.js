import * as dotenv from "dotenv";

dotenv.config();

const connectConfig = JSON.parse(process.env.CONNECT_CONFIG);

const userId = process.env.USER_ID;

const pat = process.env.PAT;

const appId = process.env.APP_ID;

const modelId = process.env.MODEL_ID;

const modelVersionId = process.env.MODEL_VERSION_ID;

const port = process.env.PORT || 3001;

export { connectConfig, userId, pat, appId, modelId, modelVersionId, port };
