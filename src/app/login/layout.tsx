import { ThemeProvider } from "@/components/theme-provider";

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return <ThemeProvider forcedTheme="light">{children}</ThemeProvider>;
}
