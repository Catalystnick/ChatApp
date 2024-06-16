import React from "react";
import { IoIosMore } from "react-icons/io";
import { CiUser, CiVideoOn } from "react-icons/ci";
import { HiOutlinePencil } from "react-icons/hi2";
import { useUserStore } from "../../lib/userStore";

function UserInfo() {
  const { currentUser } = useUserStore();
  return (
    /* User Info container */
    <div className="flex items-center justify-between p-5">
      {/* User avatar and name contianer */}
      <div className="flex items-center gap-2">
        <img
          src={currentUser.avatar || "./avatar.png"}
          className="h-16 w-16 rounded-[50%]"
        />
        <h2>{currentUser.username}</h2>
      </div>

      {/* Icons container */}
      <div className="flex gap-2">
        {/* More icon */}
        <div className="flex cursor-pointer items-center justify-center rounded-[50%] p-2 text-2xl text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white">
          <IoIosMore />
        </div>
        {/* Video icon */}
        <div className="flex cursor-pointer items-center justify-center rounded-[50%] p-2 text-2xl text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white">
          <CiVideoOn />
        </div>
        {/* Edit icon */}
        <div className="flex cursor-pointer items-center justify-center rounded-[50%] p-2 text-2xl text-slate-500 transition-all duration-300 ease-in hover:scale-125 hover:text-white">
          <HiOutlinePencil />
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
