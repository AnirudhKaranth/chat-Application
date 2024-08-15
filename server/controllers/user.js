import { eq } from "drizzle-orm";
import { db } from "../db/drizzle.config.js";
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({"msg":"Please provide all values"})
        }
        
        const userExists = await db.select().from(users).where(eq(users.email, email));
        console.log(name)
        if (userExists[0]) {
            return res.status(400).json({"msg":"user already exists"})

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(password, salt);

        const newUser = await db.insert(users).values({ name, email, password: hashedPasword });
        console.log("newUser: ",newUser)
        // const token = jwt.sign({ userId: userExists[0].id, userName: userExists[0].name , email:userExists[0].email}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_LIFETIME })

        res.status(201).json({
            // User:{
            //     id:newUser.id,
            //     email:newUser.email,
            //     name:newUser.name
            // },
            // token
            "msg":"alo"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"something went wrong"
        })
    }
}


export const login = async(req, res)=>{
    try {
        const {  email, password } = req.body;

        if ( !email || !password) {
            return res.status(400).json({"msg":"Please provide all values"})
        }

        const userExists = await db.select().from(users).where(eq(users.email, email));
        if (!userExists[0]) {
            return res.status(400).json({"msg":"user does not exists"})

        }

        const isPasswordCorrect = await bcrypt.compare(password, userExists[0].password);

        if(!isPasswordCorrect){
            return res.status(400).json({"msg":"Incorrect password"})
        }

        const token = jwt.sign({ userId: userExists[0].id, userName: userExists[0].name , email:userExists[0].email}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_LIFETIME })

        res.status(201).json({
            User:{
                id:userExists[0].id,
                email:userExists[0].email,
                name:userExists[0].name
            },
            token
        })

    } catch (error) {
        res.status(500).json({
            msg:"something went wrong"
        })
    }
}