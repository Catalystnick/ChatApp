import List from "./list/list";
import Chat from "./chat/chat";
import Detail from "./detail/detail";
import Login from "./login/login";
import Toast from "./toast/toast";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { TailSpin } from "react-loader-spinner";
import { useChatStore } from "./lib/chatStore";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  /* using use effect to listen to auth status  */
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="rounded-xl bg-[rgba(42,60,94,0.5)] p-14">
        <TailSpin color="white" radius={2} />
      </div>
    );

 
  return (
    <div className="flex h-[90vh] w-[80vw] overflow-hidden rounded-[12px] border-2 border-[rgba(255,255,255,0.125)] bg-[rgba(17,25,40,0.75)] backdrop-blur-[10px] backdrop-saturate-[160%]">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Toast />
    </div>
  );
}

export default App;
