import { RiChatSettingsLine } from "react-icons/ri";
import { SiGooglephotos } from "react-icons/si";
import { IoDownloadOutline, IoLogOutOutline } from "react-icons/io5";
import {
  MdOutlineFileOpen,
  MdBlockFlipped,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { auth, db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

function Detail() {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "user", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    /* DETAILS CONTAINER */
    <div className="flex flex-1 flex-col">
      {/* USER CONTAINER */}
      <div className="flex flex-col items-center gap-2 border-b border-slate-700 p-8">
        <img
          src={user?.avatar || "./avatar.png"}
          className="h-[90px] w-[90px] rounded-[50%] object-cover"
        />
        <h2 className="text-xl font-medium">{user?.username}</h2>
        <p className="text-xs font-light text-slate-400">
          Lorem, ipsum dolor sit !
        </p>
      </div>
      {/* END OF USER CONTAINER */}

      {/* INFO CONTAINER */}
      <div className="hide-scrollbar hover:show-scrollbar mt-2 flex flex-col gap-3 overflow-y-auto p-5">
        {/* CHAT OPTIONS */}
        <div className="rounded-xl p-2 text-slate-500 transition-all duration-300 ease-in-out hover:bg-[rgba(42,60,94,0.5)] hover:text-white">
          {/* TITLE */}
          <div className="flex cursor-pointer items-center justify-between">
            <div className="p-2">
              <RiChatSettingsLine className="text-[30px]" />
            </div>
            <span>Chat settings</span>
          </div>
        </div>

        {/* PRIVACY OPTIONS */}
        <div className="rounded-xl p-2 text-slate-500 transition-all duration-300 ease-in-out hover:bg-[rgba(42,60,94,0.5)] hover:text-white">
          {/* TITLE */}
          <div className="flex cursor-pointer items-center justify-between">
            <div className="p-2">
              <MdOutlinePrivacyTip className="text-[30px]" />
            </div>
            <span>Privacy & help</span>
          </div>
        </div>

        {/* PHOTO OPTIONS */}
        <div className="rounded-xl p-2 text-slate-500 transition-all duration-300 ease-in-out hover:bg-[rgba(42,60,94,0.5)] hover:text-white">
          {/* TITLE */}
          <div className="flex cursor-pointer items-center justify-between">
            <div className="p-2">
              <SiGooglephotos className="text-[30px]" />
            </div>
            <span>Shared photos</span>
          </div>
          {/* PHOTOS DIV */}
          <div className="mt-5 flex flex-col gap-5">
            {/* PHOTO ITEM DIV  */}
            <div className="flex items-center justify-between">
              {/* PHOTO DETAIL DIV */}
              <div className="flex items-center gap-5">
                <img
                  src="https://images.pexels.com/photos/19315391/pexels-photo-19315391/free-photo-of-orange-moskvitch-2140-on-sidewalk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="h-[40px] w-[40px] rounded-md object-cover"
                />
                <span className="text-[14px] font-light text-slate-500">
                  name_of_photo
                </span>
              </div>
              {/* DOWNLOAD ICON */}
              <div className="p-2">
                <IoDownloadOutline className="cursor-pointer text-[30px]" />
              </div>
            </div>

            {/* PHOTO ITEM DIV  */}
            <div className="flex items-center justify-between">
              {/* PHOTO DETAIL DIV */}
              <div className="flex items-center gap-5">
                <img
                  src="https://images.pexels.com/photos/19315391/pexels-photo-19315391/free-photo-of-orange-moskvitch-2140-on-sidewalk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="h-[40px] w-[40px] rounded-md object-cover"
                />
                <span className="text-[14px] font-light text-slate-500">
                  name_of_photo
                </span>
              </div>
              {/* DOWNLOAD ICON */}
              <div className="p-2">
                <IoDownloadOutline className="cursor-pointer text-[30px]" />
              </div>
            </div>
          </div>
          {/* END OF PHOTOS DIV */}
        </div>
        {/* END OF PHOTO OPTIONS */}

        {/* SHARED FILES OPTIONS */}
        <div className="rounded-xl p-2 text-slate-500 transition-all duration-300 ease-in-out hover:bg-[rgba(42,60,94,0.5)] hover:text-white">
          {/* TITLE */}
          <div className="flex cursor-pointer items-center justify-between">
            <div className="p-2">
              <MdOutlineFileOpen className="text-[30px]" />
            </div>
            <span>Shared files</span>
          </div>
        </div>

        {/* BLOCK USER BUTTON */}
        <button
          className="flex items-center justify-center gap-3 rounded-2xl bg-red-700 p-2 text-slate-500 transition-all duration-200 ease-in hover:bg-red-600 hover:text-white"
          onClick={handleBlock}
        >
          <div className="text-4xl">
            <MdBlockFlipped />
          </div>
          <span className="text-xl">
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isReceiverBlocked
                ? "User blocked"
                : "Block User"}
          </span>
        </button>

        {/* LOG OUT BUTTON */}
        <button
          className="mt-2 flex items-center justify-center gap-3 rounded-2xl bg-[rgba(42,60,94,0.3)] p-2 transition-all duration-200 ease-in hover:scale-[101%] hover:bg-[rgba(42,60,94,0.7)]"
          onClick={() => auth.signOut()}
        >
          <div className="text-4xl">
            <IoLogOutOutline />
          </div>
          <span className="text-xl">Log out</span>
        </button>
      </div>
      {/* END OF INFO CONTAINER */}
    </div>
    /* END OF DETAILS CONTAINER */
  );
}

export default Detail;
