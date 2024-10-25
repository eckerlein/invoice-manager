import React, { useState, useEffect, useRef } from "react";
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
import { UploadIcon, FileIcon, TrashIcon } from "lucide-react";
import { Label } from "./label";
import { TauriDragDropEvent } from "@/lib/utils/tauri/types";
import {
  NestedPath,
  ensureNestedDirectoryExists,
} from "@/lib/utils/tauri/diskUtils";
import { sep } from "@tauri-apps/api/path";

// Utility function to copy dropped files into a cache directory
async function handleFileStore(
  filePath: string,
  fileName: string,
  nestedPath: NestedPath
): Promise<string> {
  const path = await ensureNestedDirectoryExists(nestedPath);
  if (!path) throw new Error("Failed to create directory");
  console.log({ path, filePath, fileName, nestedPath });

  const toPath = [path, fileName].join(sep());

  await copyFile(filePath, toPath, {
    fromPathBaseDir: BaseDirectory.AppData,
    toPathBaseDir: BaseDirectory.AppData,
  }).catch((err) => {
    throw new Error(
      `Failed to copy file ${fileName} to cache directory: ${err}`
    );
  });

  return fileName; // Return the new unique file name
}

interface FileUploadFieldProps {
  name: string;
  label?: string;
  accept?: string;
  nestedPath: NestedPath;
}

export function FileUploadField({
  name,
  label,
  accept,
  nestedPath,
}: FileUploadFieldProps) {
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
          const cachedFileName = await handleFileStore(
            filePath,
            fileName,
            nestedPath
          );
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
                const cachedFileName = await handleFileStore(
                  filePath,
                  fileName,
                  nestedPath
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
    onChange: (value: string[]) => void,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Stop the event from propagating to the parent
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
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div
                ref={dropZoneRef}
                className={`border-2 border-dotted items-center text-sm outline-border rounded-lg py-4 px-8 text-center cursor-pointer transition-colors flex flex-col gap-4
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

                <Label htmlFor={name} className="text-sm text-muted-foreground">
                  {files.length > 0
                    ? `${files.length} Dateien ausgewählt`
                    : "Keine Dateien ausgewählt"}
                </Label>

                {/* Display uploaded files */}
                {files.length > 0 && (
                  <ul className="space-y-2 w-full">
                    {files.map((file: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                        onClick={(e) => e.stopPropagation()} // Stop propagation when clicking inside the list
                      >
                        <div className="flex items-center space-x-2">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {file}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="destuctiveGhost"
                          size="sm"
                          onClick={(e) => removeFile(index, files, onChange, e)}
                        >
                          <TrashIcon />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
