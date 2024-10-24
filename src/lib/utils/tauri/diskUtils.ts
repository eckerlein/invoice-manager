import { mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";
import { sep } from "@tauri-apps/api/path";

export async function ensureAnyDirectoryExists(dir: string) {
  try {
    await mkdir(dir, {
      baseDir: BaseDirectory.AppData,
      recursive: true, // Create any missing parent directories
    });
  } catch (err) {
    console.error(`Failed to create directory ${dir}:`, err);
  }
}

export async function ensureDirectoryExists(
  dir: (typeof Directories)[keyof typeof Directories]
) {
  return ensureAnyDirectoryExists(dir);
}

export async function ensureNestedDirectoryExists(
  dir: (typeof Directories)[keyof typeof Directories],
  subPath: string
) {
  return ensureAnyDirectoryExists(dir + sep() + subPath);
}

const Directories = {
  UPLOAD_CACHE_DIR: "fileUploadCache",
} as const;
