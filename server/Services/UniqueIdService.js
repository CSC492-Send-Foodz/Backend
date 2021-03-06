
class UniqueIdService {
    constructor(DB) {
        this.DB = DB
    }

    generateUniqueKey(path) {
        let dbKeys = [];
        //get all keys in firebase and check they don't coincide with key
        let collection = this.DB.collection(path);

        collection.get().then(snapshot => {
            snapshot.forEach(doc => {
                dbKeys.push(doc.id);
            });
            return true;
        }).catch(err => {
            console.log("Error getting documents", err);
        });

        return this._getKeyUnique(dbKeys);
    }

    _getKeyUnique(listOfKeys) {
        //return key if unique; otherwise recurse
        let key = Math.ceil(Math.random() * (10000));

        if (listOfKeys.includes(key)) {
            return this._getKeyUnique(listOfKeys);
        } else {
            return key;
        }
    }

}

module.exports = {
    UniqueIdService
}