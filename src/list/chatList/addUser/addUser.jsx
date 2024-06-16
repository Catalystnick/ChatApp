import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../../lib/firebase";
import { TailSpin } from "react-loader-spinner";
import { useUserStore } from "../../../lib/userStore";

function AddUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUserStore();

  /* Logic to search for user that we want to add */
  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "user");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      toast.error("Unable to find user");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        /* Add elements to array only if they are not present */
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }
  return (
    /* ADD USER CONTAINER */
    <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-max w-max rounded-xl bg-[rgba(17,25,40,0.9)] p-6">
      {/* FORM */}
      <form onSubmit={handleSearch} className="flex gap-5">
        <input
          type="text"
          name="username"
          id=""
          placeholder="Username"
          className="rounded-xl border-none bg-[rgba(42,60,94)] p-5 outline-none"
        />
        <button className="cursor-pointer rounded-xl border-none bg-[#1a73e8] p-5 text-white">
          {loading ? (
            <TailSpin height={20} width={20} color="white" />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {user && (
        /* USER DIV */
        <div className="mt-12 flex items-center justify-between">
          {/* DETAIL */}
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "./avatar.png"}
              alt=""
              className="h-[50px] w-[50px] rounded-[50%] object-cover"
            />
            <span>{user.username}</span>
          </div>
          {/* ADD USER BUTTON */}
          <button
            className="cursor-pointer rounded-xl border-none bg-[#1a73e8] p-2 text-white"
            onClick={handleAdd}
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
