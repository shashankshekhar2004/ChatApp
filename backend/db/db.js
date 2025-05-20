
import mongoose from "mongoose";


const DbCon=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MONGODB IS CONNECTED')
    } catch (error) {
        console.log('mongodb connection error',error)
    }
}

export default DbCon