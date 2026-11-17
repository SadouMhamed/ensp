import { Toaster } from "@/components/ui/sonner";

// Login stays light even when the dashboard is set to dark (see data-force-light in globals.css).
export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return (
    <>
      <div data-force-light className="flex flex-1 flex-col">
        {children}
      </div>
      <Toaster richColors theme="light" />
    </>
  );
}
