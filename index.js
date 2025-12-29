const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // This allows your dashboard to connect from a different URL

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allows connections from any frontend (like Vercel)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A device connected:', socket.id);

    // 1. Listen for data coming FROM the remote phone
    socket.on('upstream_data', (data) => {
        console.log('Received data from phone:', data);
        // 2. Broadcast that data to your Admin Dashboard
        io.emit('display_logs', data);
    });

    socket.on('disconnect', () => {
        console.log('Device disconnected');
    });
});

// Use the port Render provides, or 5000 for local testing
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Relay Server is active on port ${PORT}`);
});
