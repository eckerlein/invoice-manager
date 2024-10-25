import { mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";
import { sep } from "@tauri-apps/api/path";

export async function ensureAnyDirectoryExists(path: string) {
  try {
    await mkdir(path, {
      baseDir: BaseDirectory.AppData,
      recursive: true, // Create any missing parent directories
    });
    return path;
  } catch (err) {
    console.error(`Failed to create directory ${path}:`, err);
  }
}

export async function ensureDirectoryExists(
  dir: (typeof Directories)[keyof typeof Directories]
) {
  return ensureAnyDirectoryExists(dir);
}

export async function ensureNestedDirectoryExists(path: NestedPath) {
  return ensureAnyDirectoryExists(path.join(sep()));
}

export const Directories = {
  UPLOAD_CACHE_DIR: "fileUploadCache",
  INVOICES_DIR: "invoices",
} as const;

export type NestedPath = [
  (typeof Directories)[keyof typeof Directories],
  ...string[],
];
