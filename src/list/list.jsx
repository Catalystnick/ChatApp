import React from "react";
import ChatList from "./chatList/chatList";
import UserInfo from "./userInfo/userInfo";

function List() {
  return (
    <div className="flex flex-1 flex-col">
      <UserInfo />
      <ChatList />
    </div>
  );
}

export default List;
