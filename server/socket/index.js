const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const waitingQueue = [];
  const activeRooms = new Map(); 

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("peer:join_queue", ({ userId, type, difficulty }) => {

      const matchIndex = waitingQueue.findIndex(
        (w) =>
          w.userId !== userId && w.type === type && w.difficulty === difficulty,
      );

      if (matchIndex !== -1) {
        const partner = waitingQueue.splice(matchIndex, 1)[0];
        const roomId = `room_${Date.now()}`; // Good for 100 to 500 users for now

        socket.join(roomId);
        io.sockets.sockets.get(partner.socketId)?.join(roomId);

        activeRooms.set(roomId, {
          users: [userId, partner.userId],
          sockets: [socket.id, partner.socketId],
          turn: 0, 
          questionIndex: 0,
        });

        io.to(roomId).emit("peer:matched", {
          roomId,
          users: [userId, partner.userId],
          interviewerIndex: 0,
        });
      } else {
        waitingQueue.push({ socketId: socket.id, userId, type, difficulty });
        socket.emit("peer:waiting", { position: waitingQueue.length });
      }
    });

    socket.on("peer:leave_queue", () => {
      const idx = waitingQueue.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) waitingQueue.splice(idx, 1);
    });


    socket.on("peer:send_question", ({ roomId, question }) => {
      socket.to(roomId).emit("peer:receive_question", { question });
    });

    socket.on("peer:send_answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("peer:receive_answer", { answer });
    });

    socket.on("peer:send_feedback", ({ roomId, feedback }) => {
      socket.to(roomId).emit("peer:receive_feedback", { feedback });
    });

    socket.on("peer:next_turn", ({ roomId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        room.turn = room.turn === 0 ? 1 : 0;
        room.questionIndex += 1;
        io.to(roomId).emit("peer:turn_changed", {
          interviewerIndex: room.turn,
          questionIndex: room.questionIndex,
        });
      }
    });

    socket.on("peer:end_session", ({ roomId }) => {
      io.to(roomId).emit("peer:session_ended");
      activeRooms.delete(roomId);
    });

  
    socket.on("peer:typing", ({ roomId }) => {
      socket.to(roomId).emit("peer:partner_typing");
    });

    socket.on("disconnect", () => {
    
      const idx = waitingQueue.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) waitingQueue.splice(idx, 1);

      activeRooms.forEach((room, roomId) => {
        if (room.sockets.includes(socket.id)) {
          socket.to(roomId).emit("peer:partner_disconnected");
          activeRooms.delete(roomId);
        }
      });

      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
