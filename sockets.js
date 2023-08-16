let readyPlayerCount = 0

function listen(io){
    const pongNamespace = io.of('/pong');
    pongNamespace.on('connection', (socket) => {
        let room;

        console.log('a user connected', socket.id);

        socket.on('ready', () => {
            room = 'room' + Math.floor(readyPlayerCount / 2);
            socket.join(room);

            console.log('Player ready', socket.id, room);
            readyPlayerCount++;

            if(readyPlayerCount % 2 === 0 ) {
                pongNamespace.in(room).emit('startGame', socket.id) // sending back the id of the player who is the referee
            }
        });

        socket.on('paddleMove', (paddleData) => { // forewarding the data that we receive to all the clients except for the sender
            socket.to(room).emit('paddleMove', paddleData); 
        });

        socket.on('ballMove', (ballPosition) => {
            socket.to(room).emit('ballMove', ballPosition);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client: ${socket.id} disconnected due to: ${reason}`);
            socket.leave(room);
        })
    })
};

module.exports = {
    listen
}