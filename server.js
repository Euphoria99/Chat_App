const mongoose = require('mongoose');
const Msg = require('./models/messages');
const io = require('socket.io')(3000)

require('dotenv/config');



mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('DB connected')
}).catch(err => console.log(err))
io.on('connection', (socket) => {
    Msg.find().then(result => {
        socket.emit('output-messages', result)
    })
    console.log('A User is connected');
    socket.emit('message', 'Hello world');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chatmessage', msg => {
        const message = new Msg({ msg });
        message.save().then(() => {
            io.emit('message', msg)
        })


    })
});

