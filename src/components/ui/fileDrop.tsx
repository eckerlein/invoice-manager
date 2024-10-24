import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { uid } from "uid";
import { TauriEvent, listen } from "@tauri-apps/api/event";
import { BaseDirectory, writeFile, copyFile } from "@tauri-apps/plugin-fs";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileIcon, XIcon } from "lucide-react";
import { Label } from "./label";
import { ensureDirectoryExists } from "@/features/invoices/invoiceFileCache";

// Utility function to copy dropped files into a cache directory
async function handleFileCache(
  filePath: string,
  fileName: string
): Promise<string> {
  const uuidFileName = `${uid()}-${fileName}`;
  const cachedFilePath = `fileUploadCache/${uuidFileName}`;

  await ensureDirectoryExists();
  // Copy file to AppData folder under 'fileUploadCache'
  await copyFile(filePath, cachedFilePath, {
    fromPathBaseDir: BaseDirectory.AppData,
    toPathBaseDir: BaseDirectory.AppData,
  });

  return uuidFileName; // Return the new unique file name
}

interface FileUploadFieldProps {
  name: string;
  label: string;
  accept?: string;
}

export function FileUploadField({ name, label, accept }: FileUploadFieldProps) {
  const { setValue, watch } = useFormContext();
  const files = watch(name) || [];
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection via input click
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event);
    const selectedFiles = Array.from(event.target.files || []);
    const updatedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        const cachedFileName = await handleFileCache(file.path, file.name);
        return cachedFileName;
      })
    );
    setValue(name, [...files, ...updatedFiles], { shouldValidate: true });
  };

  // Handle drag-and-drop event via Tauri's event listener
  useEffect(() => {
    const unlisten = listen(TauriEvent.DRAG_DROP, async (event: any) => {
      console.log("Dropped files:", event.payload.paths);

      const droppedFiles = event.payload.paths;
      const updatedFiles = await Promise.all(
        droppedFiles.map(async (filePath: string) => {
          const fileName = filePath.split("/").pop() ?? "unknown";
          const cachedFileName = await handleFileCache(filePath, fileName);
          return cachedFileName;
        })
      );

      setValue(name, [...files, ...updatedFiles], { shouldValidate: true });
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [files, name, setValue]);

  // Handle file removal
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setValue(name, updatedFiles, { shouldValidate: true });
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <div
            className={`border-2 items-center text-sm border-dashed rounded-lg py-2 px-8 text-center cursor-pointer transition-colors flex gap-2
              ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 group hover:border-primary"}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
          >
            <input
              type="file"
              multiple
              accept={accept}
              id={name}
              onChange={handleFileSelect}
              className="hidden"
            />
            <UploadIcon className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            {isDragging ? (
              <p className="text-primary line-clamp-1 w-full">
                Legen Sie die <strong>Dateien</strong> hier ab ...
              </p>
            ) : (
              <p className="text-muted-foreground line-clamp-1 w-full">
                Hier klicken oder Dateien ablegen
              </p>
            )}
          </div>

          {/* Display uploaded files */}
          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((file: string, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {file}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <XIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById(name)?.click()}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <Label htmlFor={name} className="text-sm text-muted-foreground">
              {files.length > 0
                ? `${files.length} files selected`
                : "No files chosen"}
            </Label>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
