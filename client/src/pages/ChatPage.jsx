import { Box } from "@chakra-ui/react";
import { useState } from "react";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  const [fecthAgain, setFectchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p={"10px"}
      >
        {user && <MyChats fecthAgain={fecthAgain} />}
        {user && (
          <ChatBox fecthAgain={fecthAgain} setFectchAgain={setFectchAgain} />
        )}
      </Box>
    </div>
  );
};
export default ChatPage;
