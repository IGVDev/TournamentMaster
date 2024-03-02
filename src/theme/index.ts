import { ThemeConfig, extendBaseTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
}

export const theme = extendBaseTheme({ config })