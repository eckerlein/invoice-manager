import { mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";

export async function ensureDirectoryExists() {
  try {
    await mkdir("fileUploadCache", {
      baseDir: BaseDirectory.AppData,
      recursive: true, // Create any missing parent directories
    });
  } catch (err) {
    console.error("Failed to create directory:", err);
  }
}
