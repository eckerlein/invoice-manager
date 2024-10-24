import React, { useState, useEffect, useRef } from "react";
import { uid } from "uid";
import { TauriEvent, listen } from "@tauri-apps/api/event";
import { BaseDirectory, copyFile } from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileIcon, XIcon } from "lucide-react";
import { ensureDirectoryExists } from "@/features/invoices/invoiceFileCache";
import { Label } from "./label";
import { TauriDragDropEvent } from "@/lib/utils/tauri/types";

// Utility function to copy dropped files into a cache directory
async function handleFileCache(
  filePath: string,
  fileName: string
): Promise<string> {
  const uuidFileName = `${uid()}-${fileName}`;
  const cachedFilePath = `fileUploadCache/${uuidFileName}`;

  await ensureDirectoryExists();
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
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // Handle file selection via Tauri's file dialog
  const handleFileSelect = async (
    onChange: (value: string[]) => void,
    files: string[]
  ) => {
    const selectedFiles = await open({
      multiple: true,
      filters: accept
        ? [
            {
              name: "Files",
              extensions: accept.split(","),
            },
          ]
        : undefined,
    });

    if (Array.isArray(selectedFiles)) {
      const updatedFiles = await Promise.all(
        selectedFiles.map(async (filePath) => {
          const fileName = filePath.split("/").pop() ?? "unknown";
          const cachedFileName = await handleFileCache(filePath, fileName);
          return cachedFileName;
        })
      );
      onChange([...files, ...updatedFiles]);
    }
  };

  // Check if cursor is over the drop zone
  const isCursorOverDropZone = (x: number, y: number) => {
    const dropZoneRect = dropZoneRef.current?.getBoundingClientRect();
    if (!dropZoneRect) return false;
    return (
      x >= dropZoneRect.left &&
      x <= dropZoneRect.right &&
      y >= dropZoneRect.top &&
      y <= dropZoneRect.bottom
    );
  };

  // Handle drag-and-drop event via Tauri's event listener
  const handleTauriDragDrop = (
    onChange: (value: string[]) => void,
    files: string[]
  ) => {
    useEffect(() => {
      // Listen to the drag drop event
      const unlistenDragDrop = listen(
        TauriEvent.DRAG_DROP,
        async (event: TauriDragDropEvent) => {
          const {
            position: { x, y },
            paths,
          } = event.payload;

          if (isCursorOverDropZone(x, y)) {
            const updatedFiles = await Promise.all(
              paths.map(async (filePath: string) => {
                const fileName = filePath.split("/").pop() ?? "unknown";
                const cachedFileName = await handleFileCache(
                  filePath,
                  fileName
                );
                return cachedFileName;
              })
            );
            onChange([...files, ...updatedFiles]);
          }

          setIsDragging(false); // Reset dragging state after files are dropped
        }
      );

      const unlistenDragEnter = listen(TauriEvent.DRAG_ENTER, () => {
        setIsDragging(true);
      });
      const unlistenDragOver = listen(TauriEvent.DRAG_OVER, () => {
        setIsDragging(true);
      });
      const unlistenDragLeave = listen(TauriEvent.DRAG_LEAVE, () => {
        setIsDragging(false);
      });

      return () => {
        // Clean up all the listeners when the component unmounts
        unlistenDragDrop.then((fn) => fn());
        unlistenDragEnter.then((fn) => fn());
        unlistenDragOver.then((fn) => fn());
        unlistenDragLeave.then((fn) => fn());
      };
    }, [files, onChange]);
  };

  // Handle file removal
  const removeFile = (
    index: number,
    files: string[],
    onChange: (value: string[]) => void
  ) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  return (
    <FormField
      name={name}
      render={({ field: { onChange, value: files = [] } }) => {
        // Call Tauri drag-and-drop listener when the component renders
        handleTauriDragDrop(onChange, files);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div
                  ref={dropZoneRef}
                  className={`border-2 items-center text-sm border-dashed rounded-lg py-2 px-8 text-center cursor-pointer transition-colors flex gap-2
                    ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 group hover:border-primary"}`}
                  onClick={() => handleFileSelect(onChange, files)}
                >
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
                          onClick={() => removeFile(index, files, onChange)}
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
                    onClick={() => handleFileSelect(onChange, files)} // Trigger Tauri dialog
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                  <Label
                    htmlFor={name}
                    className="text-sm text-muted-foreground"
                  >
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
      }}
    />
  );
}
