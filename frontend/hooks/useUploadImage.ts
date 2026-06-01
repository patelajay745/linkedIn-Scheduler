import { api } from "@/lib/api";

export const uploadImage = async (file: File) => {
  const { data } = (await api.post("/upload/presign", {
    fileName: file.name,
    contentType: file.type,
  })) as { data: { url: string; fileKey: string; publicUrl: string } };

  await fetch(data.url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  return data.publicUrl;
};
