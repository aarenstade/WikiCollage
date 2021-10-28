import * as functions from 'firebase-functions';

exports.mergeMural = functions.https.onCall(async (data, context) => {
    const {url} = data;
    
});