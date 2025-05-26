import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        duration: 2500, // thời gian hiển thị ngắn (2.5 giây)
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border group-[.toaster]:border-gray-300 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-600",
          actionButton: "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-300 group-[.toast]:text-gray-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
