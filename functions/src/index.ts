import * as functions from "firebase-functions";
var jwt = require('jsonwebtoken');
const keys = require('./keys');

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const getToken = functions.https.onRequest((request, response) => {
  const payload = request.body.data;
  functions.logger.info("Payload log", { payload: payload, request: request});
  if (payload === undefined) {
    response.send({ data: { error: "no body data" } });
    return;
  }
  const userId = payload.user_id;
  if (userId === undefined) {
    response.send({ data: { error: "data.user_id is required!" } });
    return;
  }

  const expiresIn = payload.expires_in || '1h';
  const algorithm = payload.algorithm || 'RS256';

  // https://github.com/auth0/node-jsonwebtoken#readme
  const dataPayload = {
    data: 'foobar'
  }
  const options = {
    expiresIn: expiresIn,
    algorithm: algorithm
  }
  const token = jwt.sign(dataPayload, keys.privateKey1, options);

  const genData = {
    token: token,
    user: userId,
    options: options,
    dataPayload: dataPayload
  }
  functions.logger.info("Generated jwt token", genData);

  response.send({ data: { token: token, meta: genData } });
});
