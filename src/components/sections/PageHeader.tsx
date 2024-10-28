import React from "react";
import { Button } from "../ui/button";
import { cva } from "class-variance-authority";

const variants = {
  size: {
    sm: "py-1 h-10 text-sm", // Small: smaller padding and font size
    md: "py-1 h-12 text-base", // Medium: slightly smaller padding and font size
    lg: "py-2 h-16 text-xl", // Large: original size, same as before
  },
  position: {
    sticky: "sticky top-0", // Sticky position
    static: "",
  },
};

const pageHeaderVariants = cva(
  "px-4 flex justify-between items-center bg-baclground/50 backdrop-blur-sm border-b z-10", // Base styles
  {
    variants,
    defaultVariants: {
      size: "lg", // Default to large size
      position: "sticky",
    },
  }
);

type PageHeaderProps = {
  title: React.ReactNode;
  showBackButton?: boolean;
  actionBar?: React.ReactNode;
  // size?: "sm" | "md" | "lg"; // Accept size prop to define header size
  variants?: {
    size?: keyof typeof variants.size;
    position?: keyof typeof variants.position;
  };
};

export default function PageHeader({
  title,
  showBackButton,
  actionBar,
  variants,
}: PageHeaderProps) {
  return (
    <header className={pageHeaderVariants(variants)}>
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
