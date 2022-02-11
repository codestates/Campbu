import { Server } from "socket.io";
import { server } from "../../index";
import { chats } from "../../entity/chats";
import { posts } from "../../entity/posts";
import { reservation } from "../../entity/reservation";
import { getRepository } from "typeorm";

export default async () => {
  const io = await new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://campbu.cf",
        "http://www.campbu.cf",
        "https://d1l7um8b0honrd.cloudfront.net/",
      ],
      methods: ["GET", "POST"],
    },
  });

  await io.on("connection", async (socket) => {
    const jsonIds: any = socket.handshake.query.ids;
    if (jsonIds !== undefined) {
      const ids = JSON.parse(jsonIds);
      io.socketsJoin(ids);
    }
    socket.on("send-message", async (info) => {
      const id: string = info.chatRoomId;
      const message: string = info.chatMessage;
      const nickName: string = info.userNickName;
      const date = Date();
      const chatMessage = { message, sender: nickName, date };
      const chatRepository = getRepository(chats);
      const chat = await chatRepository
        .findOne({ id: Number(id) })
        .then((res: any) => {
          return JSON.parse(res.chat);
        });
      const newChat = JSON.stringify(chat.concat(chatMessage));
      chatRepository.update(Number(id), { chat: newChat });

      io.to(id).emit("receive-message", {
        message,
        sender: nickName,
        date,
        id,
      });
    });
  });
};
