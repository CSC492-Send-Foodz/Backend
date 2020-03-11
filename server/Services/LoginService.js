const TYPES = { "GroceryStores": "Grocery Store", "FoodBank": "Food Bank", "Drivers": "Driver" };

class LoginService {
    constructor(dbRef, uniqueIdService) {
        this.db = dbRef;
        this.uniqueIdService = uniqueIdService;
    }

    async createAcount(email, password, type) {
        if (TYPES[type] !== undefined) {
            if (await this._checkEmailInUse(email)) {
                return "ERROR: Email exists already";
            }
            var id = this.uniqueIdService.generateUniqueKey(type);
            var docRef = this.db.collection(type).doc(id.toString());
            return docRef.get().then(doc => {
                docRef.set({
                    "email":email,
                    "password": password,
                    "type": TYPES[type],
                }, { merge: true });
                return "OK: Account sucessfully created";
            }).catch(e => {
                console.log(e.message);
            });
        } else {
            return "ERROR: Type - " + type + " does not exist";
        }
    }

    async _checkEmailInUse(email) {
        var promises = [];
        for (let type in TYPES) {
            promises.push(this.db.collection(type).where("email", "==", email).get());
        }
        return Promise.all(promises).then(res => {
            for (var i = 0; i < res.length; i++) {
                if (res[i].docs.length !== 0) {
                    return true;
                }
            }
            return false;
        });
    }

    async authenticate(email, password) {
        var promises = [];
        for (let type in TYPES) {
            promises.push(this.db.collection(type).where("email", "==", email).get());
        }
        return Promise.all(promises).then(queryResults => {
            for (var i = 0; i < queryResults.length; i++) {
                var docs = queryResults[i].docs;
                if (docs.length === 1) {
                    if (docs[0].data().password === password) {
                        var path = docs[0].ref.path;
                        return [true, [docs[0].id, TYPES[path.substring(0, path.indexOf("/"))]]];
                    }
                }
            }
            return [false, "ERROR: Login Failed"];
        });
    }
}

module.exports = {
    LoginService
}