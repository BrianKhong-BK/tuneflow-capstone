import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Adjust the path as needed

export const uploadPlaylistCover = async (file, playlistId) => {
  const storageRef = ref(storage, `playlist_covers/${playlistId}.jpg`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
