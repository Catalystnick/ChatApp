import React, { useEffect, useState } from "react";
import { IoSearchOutline, IoAddOutline, IoRemove } from "react-icons/io5";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "user", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      },
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  async function handleSelect(chat) {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;

      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId,
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  }

  const filteredChat = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase()),
  );
  return (
    /* Chat list container */
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* search container */}
      <div className="flex items-center gap-5 p-5">
        {/* Search bar */}
        <div className="flex flex-1 items-center gap-5 rounded-xl bg-[rgba(42,60,94,0.5)] p-2">
          {/* Search Icon */}
          <div className="">
            <IoSearchOutline
              size={20}
              className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-110 hover:text-white"
            />
          </div>
          {/* Search input text */}
          <input
            type="text"
            placeholder="Search"
            className="flex-1 rounded-lg bg-transparent py-1 text-center outline-none transition-all duration-300 ease-in-out focus:border-b-[1px]"
            onChange={(e) => setInput(e.target.value)}
          ></input>
        </div>
        <div
          className="rounded-lg bg-[rgba(42,60,94,0.5)] p-1"
          onClick={() => setAddMode((prev) => !prev)}
        >
          {!addMode ? (
            <IoAddOutline
              size={30}
              className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-110 hover:text-white"
            />
          ) : (
            <IoRemove
              size={30}
              className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-110 hover:text-white"
            />
          )}
        </div>
      </div>

      {/* Extra div for handling scroll bar >_> */}
      <div className="hide-scrollbar hover:show-scrollbar overflow-y-auto">
        {filteredChat?.map((chat) => (
          <div
            className={`flex cursor-pointer items-center gap-5 border-b-[1px] border-slate-700 p-5 transition-all ease-in hover:bg-[rgba(42,60,94,0.30)] ${chat?.isSeen ? "bg-transparent" : "bg-[#5183fe]"}`}
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
          >
            {/* user image icon */}
            <div>
              <img
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? "./avatar.png"
                    : chat.user.avatar || "./avatar.png"
                }
                className="h-16 w-16 rounded-[50%]"
              />
            </div>
            {/* Texts */}
            <div className="flex flex-col gap-2">
              <span>
                {chat.user.blocked.includes(currentUser.id)
                  ? "User"
                  : chat.user.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
