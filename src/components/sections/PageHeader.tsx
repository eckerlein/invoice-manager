import React from "react";
import { Button } from "../ui/button";
import { cva } from "class-variance-authority";

const pageHeaderVariants = cva(
  "px-4 flex justify-between items-center sticky top-0 bg-background/50 backdrop-blur-sm border-b", // Base styles
  {
    variants: {
      size: {
        sm: "py-1 text-sm", // Small: smaller padding and font size
        md: "py-2 text-base", // Medium: slightly smaller padding and font size
        lg: "py-2 text-xl", // Large: original size, same as before
      },
    },
    defaultVariants: {
      size: "lg", // Default to large size
    },
  }
);

type PageHeaderProps = {
  title: React.ReactNode;
  showBackButton?: boolean;
  actionBar?: React.ReactNode;
  size?: "sm" | "md" | "lg"; // Accept size prop to define header size
};

export default function PageHeader({
  title,
  showBackButton,
  actionBar,
  size = "lg", // Default to "lg"
}: PageHeaderProps) {
  return (
    <header className={pageHeaderVariants({ size })}>
      <div className="flex gap-4 items-center">
        {showBackButton && (
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => window.history.back()}
          >
            Zurück
          </Button>
        )}
        <h1>{title}</h1>
      </div>

      <nav className="flex gap-4">{actionBar}</nav>
    </header>
  );
}
