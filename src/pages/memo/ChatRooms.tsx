import axios from "axios";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Button, FlatList, TextInput } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Korean } from "../../assets/assets";
import { io, Socket } from "socket.io-client";
import useAuthStore from "@/store/UserAuthStore";
// import useUserStore from "@/store/UserStore";

export const ChatEvents = {
  FromClient: {
    SendTextMessage: "sendTextMessage",
    SendFileMessage: "sendFileMessage",
    JoinRoom: "joinRoom",
    LeaveRoom: "leaveRoom"
  },
  FromServer: {
    NewMessage: "newMessage",
    NewMessages: "newMessages",
    Exception: "exception"
  }
};
export enum UserStatus {
  ACTIVE = "active",
  INCOMPLETE_PROFILE = "incomplete_profile"
}

export enum SignInProvider {
  KAKAO = "kakao",
  APPLE = "apple"
}

export enum UserGrade {
  First = 1,
  Second = 2,
  Third = 3
}

export interface User {
  id: number;
  status: UserStatus;
  provider: SignInProvider;
  schoolId: number;
  schoolName: number;
  grade: UserGrade;
  className: string;
  fullName: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  isClassPublic: boolean;
  isTimetablePublic: boolean;
  notificationsEnabled: boolean;
}
export enum MessageType {
  TEXT = "text",
  FILE = "file"
}

interface ChatRoom {
  id: string;
  name: string;
  participantsCount: number;
  unreadMessageCount: number;
  lastMessage: string;
  timeAgo: string;
}

interface Message {
  type: MessageType;
  sender: {
    id: number;
    name: string;
    profileImageUrl?: string | null;
  };
  content?: string | null;
  file?: {
    url: string;
    name: string;
    size: number;
  } | null;
  sentAt: Date;
}

const API_URL = "https://b-site.site";
const SOCKET_URL = "https://b-site.site";

const ChatRooms = ({ navigation }: { navigation: any }) => {
  // const { accessToken: token } = useUserStore();
  const { token } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const connectSocket = useCallback(() => {
    console.log("Attempting to connect socket with token:", token);

    const newSocket = io(`${SOCKET_URL}/chat`, {
      auth: { token: token },
      transports: ["websocket"]
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    newSocket.on(ChatEvents.FromServer.NewMessage, (message: Message) => {
      console.log("New message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on(ChatEvents.FromServer.NewMessages, (newMessages: Message[]) => {
      console.log("New messages 여러명:", newMessages);
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    });

    newSocket.on(ChatEvents.FromServer.Exception, (error: any) => {
      console.log("Exception:", error);
    });

    setSocket(newSocket);
  }, []);
  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatRooms(response.data.list);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const leaveRoom = useCallback(() => {
    if (socket && currentRoom) {
      console.log(`Leaving room: ${currentRoom}`);
      socket.emit(ChatEvents.FromClient.LeaveRoom, { roomId: currentRoom });
      setCurrentRoom(null);
      setMessages([]);
    }
  }, [socket, currentRoom]);

  const sendTextMessage = () => {
    if (socket && inputMessage && currentRoom) {
      console.log("Attempting to send message:", {
        roomId: currentRoom,
        content: inputMessage
      });

      socket.emit(
        ChatEvents.FromClient.SendTextMessage,
        {
          roomId: currentRoom,
          content: inputMessage
        },
        (response: any) => {
          console.log("Server acknowledged message:", response);
        }
      );

      setInputMessage("");
    }
  };

  const sendFileMessage = useCallback(() => {
    if (socket && file && currentRoom) {
      console.log("Attempting to send file message:", {
        roomId: currentRoom,
        fileName: file.name,
        fileSize: file.size
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const arrayBuffer = e.target.result as ArrayBuffer;

          socket.emit(
            ChatEvents.FromClient.SendFileMessage,
            {
              roomId: currentRoom,
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              fileData: arrayBuffer
            },
            (acknowledgement: any) => {
              console.log("Server acknowledged file message:", acknowledgement);
            }
          );

          setFile(null);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [socket, file, currentRoom]);

  const exitChatApplication = () => {
    if (socket) {
      socket.disconnect();
    }
    setChatRooms([]);
    setCurrentRoom(null);
    setMessages([]);
    setIsConnected(false);
    setCurrentUser(null);
    console.log("Exited chat application");
  };
  return (
    <View>
      <ScrollView>
        {chatRooms.map((room) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatScreen", {
                roomId: room.id,
                roomName: room.name,
                roomCount: room.participantsCount
              })
            }
            key={room.id}
            style={[styles.content2, styles.groupFlexBox]}
          >
            <View style={styles.text}>
              <View style={[styles.parent, styles.groupFlexBox]}>
                <Image style={styles.icon} resizeMode="cover" source={Korean} />
                <Text style={styles.text1}>{room.name}</Text>
                <Text style={[styles.text2, styles.textTypo]}>{room.participantsCount}</Text>
              </View>
              <View style={[styles.group, styles.groupFlexBox]}>
                <Text
                  numberOfLines={1} // 한 줄로 표시
                  ellipsizeMode="tail" // 끝부분에 '...'을 표시
                  style={[styles.text3, styles.textClr]}
                >
                  {room.lastMessage}
                </Text>
                <Text style={[styles.text4, styles.textClr]}>{room.timeAgo}</Text>
              </View>
            </View>
            <View style={[styles.alarmText, styles.groupFlexBox]}>
              <Text style={[styles.text5, styles.textTypo]}>+{room.unreadMessageCount}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ChatRooms;
const styles = StyleSheet.create({
  groupFlexBox: {
    alignItems: "center",
    flexDirection: "row"
  },
  textTypo: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Pretendard"
  },
  textClr: {
    color: "#7b7b7b",
    textAlign: "left"
  },
  icon: {
    width: 24,
    height: 24,
    overflow: "hidden"
  },
  text1: {
    fontSize: 18,
    lineHeight: 26,
    color: "#262626",
    textAlign: "left",
    fontFamily: "Pretendard",
    fontWeight: "600"
  },
  text2: {
    lineHeight: 22,
    color: "#c4c4c4",
    fontWeight: "600",
    fontSize: 16
  },
  parent: {
    gap: 4
  },
  text3: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21,
    fontFamily: "Inter-Medium",
    width: 172,
    fontWeight: "500"
  },
  text4: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Pretendard",
    color: "#7b7b7b"
  },
  group: {
    gap: 8
  },
  text: {
    justifyContent: "center",
    gap: 4
  },
  text5: {
    color: "#8a7eff",
    fontWeight: "500"
  },
  alarmText: {
    shadowColor: "rgba(107, 110, 116, 0.04)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 16,
    elevation: 16,
    shadowOpacity: 1,
    borderRadius: 100,
    backgroundColor: "#fff",
    padding: 10
  },
  content2: {
    alignSelf: "stretch",
    borderRadius: 12,
    backgroundColor: "rgba(207, 186, 240, 0.12)",
    borderStyle: "solid",
    borderColor: "#cfbaf0",
    borderLeftWidth: 6,
    flex: 1,
    width: "100%",
    height: 100,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 0,
    marginBottom: 8
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
    backgroundColor: "#000"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%"
  },
  senderName: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4
  },
  messageContent: {
    fontSize: 16
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    textAlign: "right",
    marginTop: 4
  }
});
