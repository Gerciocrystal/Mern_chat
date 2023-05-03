// import React from "react";
// import PropTypes from "prop-types";

import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBagde, { Effect } from "react-notification-badge";
const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const btnRef = React.useRef()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Preencha a field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: user.token,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha no processo de procura do utilizador",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: user.token,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        // caso procure por um chat que ja esta aqui
        //simplismente acione a lista
        setChats([data, ...chats]);
      }
      setLoadingChat(false);
      setSelectedChat(data);
      onClose(); // fecha o mambo da drawer
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha no processo de procura do utilizador",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px "
        borderWidth="5px"
      >
        <Tooltip label="Procure um utilizador" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <AiOutlineSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Procure utilizador
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work sans">
          Chat-FET
        </Text>
        <div>
          <Menu>
            {/* as={Button} rightIcon={<ChevronDownIcon /> */}
            <MenuButton p={1}>
              <NotificationBagde
                count={notification.length}
                effect={Effect.SCLALE}
              ></NotificationBagde>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "Sem Notificacoes"}
              {notification.map((notf) => (
                <MenuItem
                  key={notf._id}
                  onClick={() => {
                    setSelectedChat(notf.chat);
                    setNotification(notification.filter((n) => n !== notf));
                  }}
                >
                  {notf.chat.isGroupChat
                    ? `Nova mensagen no ${notf.chat.chatName}`
                    : `Nova mensagen de ${getSender(user, notf.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Meu Perfil</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              Procurar Utilizador
            </DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="procure pelo nome ou email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>

              {loading ? (
                <ChatLoading />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

// SideDrawer.propTypes = {};

export default SideDrawer;
