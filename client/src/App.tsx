import "@mantine/core/styles.css";
import { Center, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { MainPage } from "./pages/mainPage/MainPage";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function App() {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<boolean>(false)

  useEffect(() => {
    if(token){
      auth()
      return;
    }
    if(sessionStorage.getItem('token')){
      setStatus(true)
      return;
    }
    setStatus(false)
  }, [])

  const auth = async () => {
    await axios.get(`${import.meta.env.VITE_WEB_URL}/access/${token}`)
    .then((res) => {
      sessionStorage.setItem('token', res.data.token)
    })
    .catch(() => {
      sessionStorage.removeItem('token');
    })
  }
  if (status){
    return <MantineProvider theme={theme}>
      <MainPage/>
    </MantineProvider>;
  }
  return <MantineProvider theme={theme}>
      <Center>Доступ закрыт</Center>
    </MantineProvider>;
  
}
