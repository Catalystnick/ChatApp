import { CiVideoOn } from "react-icons/ci";
import {
  IoCallOutline,
  IoInformationCircleOutline,
  IoSendOutline,
  IoImageOutline,
  IoCameraOutline,
  IoMicOutline,
} from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

import React, { useEffect, useRef, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import upload from "../lib/upload";
import { toast } from "react-toastify";

function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);

  /* HANDLING SETTING EMOJIS TO CHAT */
  function handleEmoji(e) {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  }

  /* HANDLING SETTING IMAGES TO CHAT */
  function handleImg(e) {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behaviour: "smooth" });
  });

  /* MEMOISED EMOJI PICKER DUE TO PERFORMANCE ISSUES WHEN LOADING EMOJIS */
  const MemoEmojiPicker = React.memo(EmojiPicker);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  async function handleSend() {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
    } catch (error) {
      return null;
    }

    /* ADDING CHATS TO THE CHAT ARRAY */
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapShot = await getDoc(userChatsRef);

        if (userChatsSnapShot.exists()) {
          const userChatsData = userChatsSnapShot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId,
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      toast.error("Something went wrong! Try again.");
    } finally {
      setText("");
    }

    setImg({
      file: null,
      url: "null",
    });
  }
  return (
    /* CHAT CONTAINER */
    <div className="border-slate-70 flex h-full flex-[2] flex-col border-l border-r border-slate-700">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between border-b border-slate-700 p-5">
        {/* USER INFORMATION */}
        <div className="flex w-fit items-center gap-5">
          {/* USER ICON */}
          <div className="">
            <img
              src={user?.avatar || "./avatar.png"}
              className="h-16 w-16 rounded-[50%] object-cover"
            />
          </div>

          {/* TEXTS */}
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold">{user?.username}</span>
            <p className="text-xs font-light text-slate-300">
              Lorem ipsum dolor sit natus!
            </p>
          </div>
        </div>
        {/* END OF INFORMATION */}

        {/* ICONS */}
        <div className="flex w-fit gap-2 text-2xl">
          <div className="p-2">
            <CiVideoOn className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white" />
          </div>
          <div className="p-2">
            <IoCallOutline className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white" />
          </div>
          <div className="p-2">
            <IoInformationCircleOutline className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white" />
          </div>
        </div>
      </div>
      {/* END OF TOP SECTION */}

      {/* CENTER SECTION */}
      <div className="hide-scrollbar hover:show-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        {chat?.messages?.map((message) => (
          <div
            className={`${message.senderId === currentUser.id ? "flex self-end" : "self-start"}`}
            key={message.createdAt}
          >
            {/* TEXTS */}
            <div className="flex flex-col">
              {message.img && (
                <img
                  src={message.img}
                  className="h-[250px] w-full rounded-xl object-cover"
                />
              )}
              <p
                className={`${message.senderId === currentUser.id ? "w-fit self-end rounded-lg bg-[rgba(42,60,94,0.5)] p-4" : "w-fit rounded-lg bg-slate-300 p-4 text-black"}`}
              >
                {message.text}
              </p>
              <span
                className={`${message.senderId === currentUser.id ? "self-end text-sm text-slate-400" : "text-sm text-slate-400"}`}
              >
                1 min ago
              </span>
            </div>
          </div>
        ))}

        {img.url && (
          <div className="self-end">
            <div className="flex flex-col">
              <img
                src={img.url}
                alt=""
                className="h-[250px] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        )}

        {/* THIS REF MAKES CHAT SCROLL TO BOTTOM ON PAGE LOAD */}
        <div ref={endRef}></div>
      </div>
      {/* END OF CENTER SECTION */}

      {/* START BOTTOM SECTION */}
      <div className="flex items-center justify-between gap-5 border-t border-slate-500 p-5">
        {/* ICONS */}
        <div className="flex gap-2 text-xl">
          <div className="p-2">
            <label htmlFor="file">
              <IoImageOutline className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white" />
            </label>
            <input
              type="file"
              name=""
              id="file"
              style={{ display: "none" }}
              onChange={handleImg}
            />
          </div>
          <div className="p-2">
            <IoCameraOutline className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white" />
          </div>
          <div className="p-2">
            <IoMicOutline className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white" />
          </div>
        </div>
        {/* END OF ICONS */}

        {/* TEXT INPUT */}
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot write to this user"
              : "Type a message..."
          }
          className="h-full flex-1 rounded-xl border-none bg-transparent p-1 py-3 text-[16px] outline-none transition-all duration-300 ease-in focus:bg-[rgba(42,60,94,0.5)]"
          onChange={(e) => setText(e.target.value)}
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        {/* EMOJI CONTAINER */}
        <div className="">
          {/* EMOJI BUTTON */}
          <div className="relative text-2xl">
            <MdOutlineEmojiEmotions
              className="cursor-pointer text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white"
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            />

            {/* EMOJI PICKER CONTAINER */}
            <div className="absolute bottom-7 left-0">
              <MemoEmojiPicker
                open={open}
                onEmojiClick={handleEmoji}
                lazyLoadEmojis={true}
                preload
              />
            </div>
          </div>
        </div>
        {/* END OF EMOJI CONTAINER */}

        {/* SEND BUTTON */}
        <button
          className="flex items-center justify-center rounded-[50%] bg-[rgba(42,60,94,0.5)] p-2 text-2xl transition-all duration-150 ease-in hover:scale-110"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          <IoSendOutline className="cursor-pointer text-slate-500 transition-all duration-150 ease-in hover:-rotate-12 hover:text-white" />
        </button>
      </div>
      {/* END OF BOTTOM SECTION */}
    </div>
    /* END OF CHAT CONTAINER */
  );
}

export default Chat;
