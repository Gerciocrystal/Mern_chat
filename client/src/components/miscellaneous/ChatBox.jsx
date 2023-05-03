// import React from 'react';
import PropTypes from "prop-types";

import { Box } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fecthAgain, setFectchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "73%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fecthAgain={fecthAgain} setFectchAgain={setFectchAgain} />
    </Box>
  );
};

ChatBox.propTypes = {
  fecthAgain: PropTypes.bool.isRequired,
  setFectchAgain: PropTypes.func.isRequired,
};

export default ChatBox;
