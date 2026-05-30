import { Loader as LoadingComponentFromUILibrary } from "@/components/retroui/Loader";

export const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingComponentFromUILibrary />
    </div>
  );
};
