import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileIcon, XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface FileUploadFieldProps {
  name: string;
  label: string;
  accept?: string;
}

export function FileUploadField({ name, label, accept }: FileUploadFieldProps) {
  const { setValue, watch } = useFormContext();
  const files = watch(name) || [];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setValue(name, [...files, ...acceptedFiles], { shouldValidate: true });
    },
    [name, files, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple: true,
  });

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
            {...getRootProps()}
            className={`border-2 items-center text-sm border-dashed rounded-lg py-2 px-8 text-center cursor-pointer transition-colors flex gap-2
              ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 group hover:border-primary"}`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            {isDragActive ? (
              <p className="text-primary line-clamp-1 w-full">
                Legen Sie die <strong>Dateien</strong> hier ab ...
              </p>
            ) : (
              <p className="text-muted-foreground line-clamp-1 w-full">
                Hier klicken oder Dateien ablegen
              </p>
            )}
          </div>

          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((file: File, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {file.name}
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
