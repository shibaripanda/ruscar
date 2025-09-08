import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { MainPage } from "./pages/mainPage/MainPage";

export default function App() {
  return <MantineProvider theme={theme}>
    <MainPage/>
  </MantineProvider>;
}
