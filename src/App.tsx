import * as React from "react"
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
import {
  ChakraProvider,
  Box
} from "@chakra-ui/react"
import { HelmetProvider } from "react-helmet-async";
import theme from "./theme"
import '@fontsource/lato'
import '@fontsource/roboto'
import '@fontsource/roboto-mono'
import '@fontsource/jost'
import Header from "./components/header/Header"
import Home from "./pages/Home";
import PokemonDetail from "./pages/PokemonDetail";

export const App = () => (
    <BrowserRouter>
        <HelmetProvider>
            <ChakraProvider theme={theme}>
                <Box minH='100vh'>
                    <Header></Header>
                    <Box marginTop={20}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/pokemon/:name" element={<PokemonDetail />} />
                        </Routes>
                    </Box>
                </Box>
            </ChakraProvider>
        </HelmetProvider>
    </BrowserRouter>

)
