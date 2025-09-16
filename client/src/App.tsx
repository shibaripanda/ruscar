import "@mantine/core/styles.css";
import { Center, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { MainPage } from "./pages/mainPage/MainPage";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createSocket } from "./socket/socket";

export default function App() {

  const [searchParams] = useSearchParams();
  const startToken = searchParams.get("token");
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const socketRef = useRef<any>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const navigate = useNavigate()
  

  useEffect(() => {
    if (startToken) {
      auth(startToken);
    }
  }, [startToken]);

  useEffect(() => {
    if (token) {
      const socket = createSocket(token);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected", socket.id);
        setIsSocketConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected", socket.id);
        setIsSocketConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
      });
    }
  }, [token]);

  const auth = async (startToken: string) => {
    await axios.get(`${import.meta.env.VITE_WEB_URL}/access/${startToken}`)
    .then((res) => {
      sessionStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      navigate("/")
    })
    .catch(() => {
      sessionStorage.removeItem("token")
      setToken(null)
    })
  }

  if (isSocketConnected){
    return <MantineProvider theme={theme}>
      <MainPage socket={socketRef.current} isSocketConnected={isSocketConnected}/>
    </MantineProvider>;
  }
  return <MantineProvider theme={theme}>
      <Center>Доступ закрыт</Center>
    </MantineProvider>;
  
}
