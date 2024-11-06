const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');

const mqttClient = mqtt.connect('mqtt://eb4d5208a7ea4b5ea2269b63abb4237c.s1.eu.hivemq.cloud');
const mongoUri = "mongodb+srv://anhtdh250603:<db_password>@cluster0.wkegb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    await client.connect();
    const database = client.db("iotData");
    const collection = database.collection("deviceReadings");

    mqttClient.on('connect', () => {
        console.log('Connected to HiveMQ');
        mqttClient.subscribe('IoT/Ourdoor', (err) => {
            if (!err) {
                console.log('Subscribed to topic');
            }
        });
    });

    mqttClient.on('message', async (topic, message) => {
        const data = JSON.parse(message.toString()); 
        await collection.insertOne(data); 
        console.log('Data stored:', data);
    });
}

run().catch(console.error);
