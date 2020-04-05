async function checkRequestAuth(admin, req, res, next) {
    // Check if there are auth tokens
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        unauthorized(res); // If there are none then return 403
        return;
    }

    //If there are then process the token
    try {
        req.user = await decodeAuth(admin, req);
        if (req.user) {
            next();
            return;
        }
    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
        return;
    }
}

function unauthorized(res) {
    console.log('Unothorized Request');
    res.status(403).send('<h1>403 Unauthorized</h1>' +
        'No Firebase ID token was passed as a Bearer token in the Authorization header.<br>' +
        'Make sure you authorize your request by providing the following HTTP header:<br>' +
        'Authorization: Bearer &ltFirebase ID Token&gt<br>' +
        'or by passing a "__session" cookie.');
}

async function decodeAuth(admin, req) {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    } else {
        // No cookie
        unauthorized(res);
        return;
    }
    return await admin.auth().verifyIdToken(idToken);
}

async function checkUserType(db, id, type) {
    return db.collection(type).doc(id).get().then(doc => {
        return doc.exists;
    }).catch(error => {
        console.log("Error getting doc");
        return false;
    });
}

module.exports = {
    checkRequestAuth, checkUserType
}