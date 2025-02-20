import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from "bcryptjs";
import verifyJWT from './auth.js';
import rateLimit from 'express-rate-limit';

import supabase from './db.js';
import { createToken } from './auth.js';
dotenv.config();

const app = express();
const PORT =  process.env.PORT || 5000;
const saltRounds = 12;

const getFullTime = () => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const time = `${hour}:${minute}`;
    const fullTime = `${date.getDate()}/${date.getUTCMonth()}/${date.getFullYear()} ${time}`;
    return fullTime;
}
// MiddleWares
app.set('trust proxy', 1);
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
}));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 150,
    message: { error: "Please wait you made too much request!" }
  });


app.use("/api/", limiter);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/api/check-auth", verifyJWT, (req, res) => {
    res.status(200).json({message: "success"});
});

// Get all the notes for user
app.get('/api/get-all-notes', verifyJWT, async (req, res) => {
    const id = req.id;
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', id)
            .order('id', { ascending: false });

        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error fetching notes', error: error.message });
        }

        if (data.length === 0) {
            return res.status(200).json({ message: "0", notes: [] });
        } else {
            return res.status(200).json({ message: "Success", notes: data });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});


app.patch('/api/update-note/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    const userId = req.id;
    const { title, content } = req.body;
    const fullTime = getFullTime();
    try {
        await supabase.from('notes').update({ title: title, content: content, date: fullTime }).eq('id', id).eq('user_id', userId);
        return res.status(200).json({message: "Success", date: fullTime});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server error!"});
    }
});

app.post('/api/add-note', verifyJWT, async (req, res) => {
    const userId = req.id;
    const { title, color, content } = req.body;
    const fullTime = getFullTime();
    try {
        const { data } = await supabase
            .from('notes')
            .insert([{ user_id: userId, title: title, content: content, color: color, date: fullTime }])
            .select('id');
        return res.status(200).json({message: "Success", id: data[0].id, date: fullTime});
    } catch {
        return res.status(500).json({error: "Server error!"});
    }
});

app.delete('/api/delete-note/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    const userId = req.id;
    try {
        await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        return res.status(200).json({message: "Success"});
    } catch(err) {
        return res.status(500).json({error: "Server error!"});
    }
});

app.post("/api/logout", async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    });
    res.status(200).json({message: "success"});
});

// API Login route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data } = await supabase.from('users').select('id, hashed_password').eq('email', email);
        if (data.length === 0)
            return res.status(400).json({error: "User does not exist!"});
        else {
            const hashedPassword = data[0].hashed_password;
            const isMatch = await bcrypt.compare(password, hashedPassword);
            if (isMatch)
            {
                try {
                    const id = data[0].id;
                    const {accessToken, refreshToken} = createToken(email, id);
                    await supabase.from('users').update({ refresh_token: refreshToken }).eq('email', email);

                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
                        sameSite: "none",
                    });
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 15 * 60 * 1000, // 15 minutes
                        sameSite: "none",
                    });
                    return res.status(200).json({message: "success"});
                } catch (err) {
                    return res.status(500).json({error: "Server error!"});
                }
            }
            else {
                return res.status(400).json({error: "Password is incorrect!"});
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server error!"});
    }
});

// API Register route
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data } = await supabase.from('users').select('*').eq('email', email);
        if (data.length > 0) {
            return res.status(400).json({error: "User already exists!"});
        }
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const { data } = await supabase.from('users').insert([{ email: email, hashed_password: hashedPassword }]).select('id');
            const id = data[0].id;
            const {accessToken, refreshToken} = createToken(email, id);
            await supabase.from('users').update({ refresh_token: refreshToken }).eq('email', email);
            res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
                    sameSite: "none",
                });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000, // 15 minutes
                sameSite: "none",
            });
            return res.status(200).json({message: "success"});
        } catch(err) {
            console.log(err);
            return res.status(500).json({error: "Server error!"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server error!"});
    }
});

// listen to the port!
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
