import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors";
import helmet from "helmet";
import compression from "compression"; 

import { createNotification } from "./app/utils/notification.js";
import sql from "./config/database.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    path: "/sskpi/",
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Client connection with socket id = " + socket.id);

    socket.on("push_notification", (data) => {
        console.log("req", data);
        createNotification(data)

        socket.emit("res_notification", data);
    })
})

httpServer.listen(PORT);

app.get("/api/node/notifications", (_req, res) => {
        sql.query("SELECT * FROM notifications", (err, results, fields) => {
        if(err) throw err;

        res.json(results);
    })
})

// app.get("/candidate", (_req, res) => {
//     sql.query("SELECT * FROM candidates", (err, results, fields) => {
//         if(err) throw err;

//         res.json(results);
//     })
// })

// app.get("*", (_req, res) => {
//     res.send("Not found page");
// });


