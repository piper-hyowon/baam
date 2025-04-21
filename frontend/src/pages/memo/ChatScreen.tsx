import { useCallback, useEffect, useState } from "react";
import styled from "@emotion/native";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import useAuthStore from "../../store/UserAuthStore";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import RNFS from "react-native-fs";
import { launchCamera, launchImageLibrary, Asset } from "react-native-image-picker";
import { VectorLeft, FriendsIcon, IconPlus, SendIcon, CameraIcon, AlbumIcon, Hamburger } from "../../assets/assets";

const MessageItem = ({ message, isOwnMessage }: any) => {
  if (!message) return null;
  if (!message.sender) {
    // return <Text>{message.content}</Text>;
    return null;
  }
  return (
    <View style={[styles.messageContainer2, { justifyContent: isOwnMessage ? "flex-end" : "flex-start" }]}>
      {!isOwnMessage && (
        <Image
          source={
            message.sender ? { uri: message.sender.profileImageUrl } : require("../../assets/images/dummyprofile.png")
          }
          style={styles.avatar}
        />
      )}
      {isOwnMessage ? (
        <>
          <Text style={styles.timestamp}>{new Date(message.sentAt).toLocaleTimeString()}</Text>
          {message.type === MessageType.TEXT ? (
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: "#8A7EFF",
                  height: 38
                }
              ]}
            >
              <Text style={[styles.messageContent, styles.white]}>{message.content}</Text>
            </View>
          ) : (
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: "#8A7EFF"
                }
              ]}
            >
              <Image source={{ uri: message.file.url }} style={{ height: 120, width: 120, borderRadius: 12 }} />
              {/* <Text>{message.file}</Text> */}
            </View>
          )}
        </>
      ) : (
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.senderName}>{message.sender.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: "#E9E9E9" // Custom color
                }
              ]}
            >
              {message.type === MessageType.TEXT ? (
                <Text style={[styles.messageContent, styles.black]}>{message.content}</Text>
              ) : (
                //   <FileMessage file={message.file} />
                <View
                  style={[
                    styles.messageBubble,
                    {
                      backgroundColor: "#E9E9E9"
                    }
                  ]}
                >
                  <Image source={{ uri: message.file.url }} style={{ height: 120, width: 120, borderRadius: 12 }} />
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{new Date(message.sentAt).toLocaleTimeString()}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

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

function ChatScreen({ navigation, route }: any) {
  const { token } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTextState, setIsTextState] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  // 전체 메시지 저장 함수
  const storeAllMessages = async (chatRoomId: string, messages: Message[]) => {
    const path = `${RNFS.DocumentDirectoryPath}/chat_room_${chatRoomId}_messages.json`;
    const jsonValue = JSON.stringify(messages);

    try {
      await RNFS.writeFile(path, jsonValue, "utf8");
      console.log("All messages saved", messages);
    } catch (e) {
      console.log("Error saving all messages", e);
    }
  };

  // 전체 메시지 불러오기 함수
  const loadAllMessages = async (chatRoomId: string) => {
    const path = `${RNFS.DocumentDirectoryPath}/chat_room_${chatRoomId}_messages.json`;

    try {
      const jsonValue = await RNFS.readFile(path, "utf8");
      // return jsonValue ? JSON.parse(jsonValue) : [];
      const parsedMessages: Message[] = JSON.parse(jsonValue);
      setMessages(parsedMessages);
      return parsedMessages;
    } catch (e) {
      console.log("Error loading all messages", e);
      return [];
    }
  };
  // 이미지나 파일들만 저장하는 함수
  const storeFilesOnly = async (chatRoomId: string, files: File[]) => {
    const path = `${RNFS.DocumentDirectoryPath}/chat_room_${chatRoomId}_files.json`;
    const jsonValue = JSON.stringify(files);

    try {
      await RNFS.writeFile(path, jsonValue, "utf8");
      console.log("Files only saved", files);
    } catch (e) {
      console.log("Error saving files only", e);
    }
  };

  // 이미지나 파일들만 불러오기 함수
  const loadFilesOnly = async (chatRoomId: string) => {
    const path = `${RNFS.DocumentDirectoryPath}/chat_room_${chatRoomId}_files.json`;

    try {
      const jsonValue = await RNFS.readFile(path, "utf8");
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.log("Error loading files only", e);
      return [];
    }
  };
  const convertToFile = async (asset: Asset): Promise<File> => {
    const response = await fetch(asset.uri as string);
    const blob = await response.blob();
    const fileName = asset.fileName || "unknown";
    const fileType = asset.type || "image/jpeg";
    return new File([blob], fileName, { type: fileType });
  };

  const getPhotos = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 400,
        maxWidth: 400
      },
      async (response) => {
        if (response.didCancel) {
          console.log("cancled");
        } else if (response.errorCode) {
          console.log(response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const fileData = response.assets[0];
          const convertedFile = await convertToFile(fileData); // 파일로 변환
          setFile(convertedFile); // 파일 설정
        }
      }
    );
  };

  // 카메라 실행
  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        includeBase64: false
      },
      async (response) => {
        if (response.didCancel) {
          Alert.alert("카메라 사용이 취소되었습니다.");
        } else if (response.errorCode) {
          Alert.alert("카메라 에러", response.errorMessage || "카메라를 사용할 수 없습니다.");
        } else if (response.assets && response.assets.length > 0) {
          const photoData = response.assets[0];
          const convertedFile = await convertToFile(photoData); // 파일로 변환
          setFile(convertedFile); // 파일 설정
        }
      }
    );
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [connectSocket]);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // 모달의 가시성을 토글
  };
  const leaveRoom = useCallback(() => {
    if (socket && currentRoom) {
      console.log(`Leaving room: ${currentRoom}`);
      socket.emit(ChatEvents.FromClient.LeaveRoom, { roomId: currentRoom });
      setCurrentRoom(null);
      setMessages([]);
      navigation.goBack();
    }
  }, [socket, currentRoom]);

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socket && roomId) {
        if (currentRoom) {
          leaveRoom();
        }
        console.log(`Joining room: ${roomId}`);
        socket.emit(ChatEvents.FromClient.JoinRoom, { roomId });
        setCurrentRoom(roomId);
        setMessages([]);
      }
    },

    [socket, currentRoom, leaveRoom]
  );

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
      setFiles((prevFiles) => [...prevFiles, file]);
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

  const exitChatApplication = async () => {
    if (socket) {
      socket.disconnect();
    }
    setChatRooms([]);
    setCurrentRoom(null);
    setMessages([]);
    setIsConnected(false);
    setCurrentUser(null);
    setFiles([]);
    console.log("Exited chat application");
  };
  const handleExit = async () => {
    await storeAllMessages(route.params.roomId, messages);
    await storeFilesOnly(route.params.roomId, files);
    await exitChatApplication();

    navigation.goBack();
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
    console.log("roomId", route.params.roomId);
    // console.log("불러오기: ", loadAllMessages(route.params.roomId));
    // console.log("불러오기: ", loadFilesOnly(route.params.roomId));
  }, []);

  useEffect(() => {
    sendFileMessage();
  }, [file]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && ( // 로딩 상태면 인디케이터 표시
        <LoadingContainer>
          <View
            style={{ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flex: 1, width: "100%" }}
          >
            <Text style={{ color: "#000" }}>채팅에 참여하시겠습니까?</Text>
            <Button
              title="예"
              onPress={() => {
                joinRoom(route.params.roomId);
                loadAllMessages(route.params.roomId);
                loadFilesOnly(route.params.roomId);
                setLoading(false);
              }}
            />
          </View>
        </LoadingContainer>
      )}
      <Header style={{ zIndex: 2 }}>
        <BackButton onPress={handleExit}>
          <BackIcon source={VectorLeft} />
        </BackButton>

        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 26,
              fontWeight: "600",
              fontFamily: "Pretendard",
              color: "#262626",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 272,
              height: 28
            }}
          >
            {route.params.roomName}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() =>
              navigation.navigate("ParticipantsList", { roomName: route.params.roomName, roomId: route.params.roomId })
            }
          >
            <Image source={FriendsIcon} style={{ width: 20, height: 20 }} />
            <Text>{route.params.roomCount}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FileList", { roomName: route.params.roomName, roomId: route.params.roomId })
          }
        >
          <Image source={Hamburger} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </Header>
      <View style={styles.messageContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <MessageItem message={item} isOwnMessage={item.sender && currentUser?.id === item.sender.id} />
          )}
        />
      </View>
      {isModalVisible && (
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1, justifyContent: "flex-end" }} // 하단에 고정
      >
        <View
          style={{
            backgroundColor: "#fff",
            flexDirection: "row",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderTopWidth: 1, // 위쪽에만 border 추가
            borderTopColor: "#e9e9e9"
          }}
        >
          <TouchableOpacity style={{ justifyContent: "center", paddingRight: 16 }} onPress={toggleModal}>
            {/* 파일 추가 */}
            <Image style={{ width: 24, height: 24 }} source={IconPlus} />
          </TouchableOpacity>
          <View
            style={{
              borderRadius: 20,
              borderColor: "#e9e9e9",
              borderWidth: 1,
              flexDirection: "row",
              paddingHorizontal: 12,
              paddingVertical: 8,
              gap: 8,
              width: "90%",
              justifyContent: "space-between"
            }}
          >
            <TextInput placeholder="메시지 보내기" value={inputMessage} onChangeText={setInputMessage} />

            {/* {file && <Text>선택된 파일: {file.name}</Text>} */}
            <TouchableOpacity
              style={{ justifyContent: "center", alignContent: "flex-end" }}
              onPress={() => {
                sendTextMessage();
              }}
            >
              <Image source={SendIcon} style={{ width: 28, height: 28 }} />
            </TouchableOpacity>
          </View>
        </View>

        {isModalVisible && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* 카메라 버튼 */}
              <TouchableOpacity onPress={openCamera}>
                <View style={{ alignItems: "center" }}>
                  <Image source={CameraIcon} style={{ width: 40, height: 40 }} />
                  <Text style={styles.modalText}>카메라</Text>
                </View>
              </TouchableOpacity>

              {/* 앨범 버튼 */}
              <TouchableOpacity onPress={getPhotos}>
                <View style={{ alignItems: "center" }}>
                  <Image source={AlbumIcon} style={{ width: 40, height: 40 }} />
                  <Text style={styles.modalText}>앨범</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export default ChatScreen;
const styles = StyleSheet.create({
  white: {
    color: "#fff"
  },
  black: {
    color: "#434343"
  },
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
    paddingVertical: 0
  },
  messageContainer: {
    // display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
    maxHeight: 604
  },
  messageContainer2: {
    // display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8
  },
  messageBubble: {
    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8
  },
  modalTriggerText: {
    fontSize: 24,
    textAlign: "center"
  },
  senderName: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "Pretendard",
    color: "#555",
    textAlign: "left",
    marginBottom: 8,
    marginHorizontal: 8
  },
  messageContent: {
    fontSize: 16
  },
  timestamp: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Pretendard",
    color: "#9d9d9d",
    textAlign: "left",
    marginHorizontal: 8
  },
  modalContainer: {
    justifyContent: "flex-end"
  },
  modalContent: {
    paddingLeft: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: "row",
    gap: 32,
    paddingBottom: 64
  },
  modalText: {
    alignSelf: "stretch",
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "Pretendard",
    color: "#9d9d9d",
    textAlign: "center"
  },
  modalOverlay: {
    flex: 1 // 모달 뒤에 있는 영역
  },
  container: {
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold"
  },
  fileSize: {
    color: "#555",
    marginVertical: 5
  },
  downloadButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#007bff",
    borderRadius: 4
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center"
  },
  errorText: {
    color: "red",
    marginTop: 10
  }
});
const LoadingContainer = styled(View)`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  align-items: "center";
  justify-content: "center";
  background-color: "rgba(0, 0, 0, 0.5)";
  z-index: 1000;
`;
const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 10px;
  padding-horizontal: 16px;
`;
const BackButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const BackIcon = styled(Image)`
  width: 8.5px;
  height: 15px;
`;
