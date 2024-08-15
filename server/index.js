import express from "express"
import cors from "cors"
import "dotenv/config"
import userRouter from "./routes/user.js"
const port = 8000
const app = express()

app.use(cors());
app.use(express.json());
app.use("/api/v1/user",userRouter)


app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})