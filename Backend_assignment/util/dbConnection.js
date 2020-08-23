const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

//const url = "mongodb+srv://login:LP9sTgjsyfuqI4Z6@cluster0.zoigy.mongodb.net/sso?retryWrites=true&w=majority";

dotenv.config();

const connect = async() => {
    try {
        const client = await MongoClient.connect(process.env.url, { useNewUrlParser: true});
        db = client.db("sso");
    } catch (error) {
        console.log('unable to connect', error);
    }
};

const getConnectionInstance = () => {
    return db || null;
};


module.exports = {
    getConnectionInstance: getConnectionInstance,
    connectToDb: connect,
};