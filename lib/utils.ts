import { clsx, type ClassValue } from "clsx"
import { useId } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useFormId(name: string) {
	return `${name}-${useId()}`
}