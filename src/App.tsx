import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import CropAverages from "./../components/CropAverages.tsx";
import FetchData from "./../components/FetchData.tsx";


export default function App() {
  return (
  <>
    <MantineProvider theme={theme}>
      <FetchData />
      <CropAverages />
    </MantineProvider>
  </>
  )
}
