class LoginService {
    constructor(dbRef, uniqueIdService) {
        this.accountsCollection = dbRef.collection("Accounts");
        this.uniqueIdService = uniqueIdService;
    }

    async createAcount(username, password, type) {
        var docRef = this.accountsCollection.doc(username);
        return docRef.get().then(doc => {
            if (doc.exists) {
                return [false, "ERROR: Username Exists already"];
            } else {
                docRef.set({
                    "password": password,
                    "type": type,
                    "uid": this.uniqueIdService.generateUniqueKey("Accounts","uid")
                });
                return [true, "OK: Account sucessfully created"];
            }
        }).catch(e => {
            console.log(e.message);
        });
    }

    async authenticate(username, password) {
        var docRef = this.accountsCollection.doc(username);
        return docRef.get().then(doc => {
            var data = doc.data();
            if (doc.exists && data.password === password) {
                return [true, data.uid];
            } else {
                return [false, "ERROR: Login Failed"];
            }
        })
    }
}

module.exports = {
    LoginService
}