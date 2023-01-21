import fetch from "node-fetch";

import { userId, pat, appId, modelId, modelVersionId } from "./init.js";

const clarifyFetch = async (imgUrl) => {
  const raw = JSON.stringify({
    user_app_id: {
      user_id: userId,
      app_id: appId,
    },
    inputs: [
      {
        data: {
          image: {
            url: imgUrl,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + pat,
    },
    body: raw,
  };

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id
  try {
    const response = await fetch(
      "https://api.clarifai.com/v2/models/" +
        modelId +
        "/versions/" +
        modelVersionId +
        "/outputs",
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      if (data.status.code === 10000) {
        const imgBox = data.outputs[0].data.regions[0].region_info.bounding_box;
        return imgBox;
      } else {
        throw new Error(
          `clarify data status ${data.status.code} ${data.status.description}`
        );
      }
    } else {
      throw new Error(
        `clarify server status ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
};

export default clarifyFetch;
