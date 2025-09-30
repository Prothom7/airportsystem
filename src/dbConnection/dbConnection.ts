import mongoose, { connection } from "mongoose";

export async function connect() {
    try{
        mongoose.connect(process.env.MONGO_URL!)
        const connecton = mongoose.connection

        connection.on('connected', () =>{
            console.log('MongoDB connected');
        })

        connection.on('error', (err) => {
            console.log("Mongodb connection error" + err);
            process.exit()
        })
    }
    catch(error){
        console.log('Something went wrong connection to Database');
        console.log(error);
    }
}