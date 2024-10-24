import React from "react";
import { Button } from "../ui/button";

type PageHeaderProps = {
  title: React.ReactNode;
  showBackButton?: boolean;
  actionBar?: React.ReactNode;
};

export default function PageHeader({
  title,
  showBackButton,
  actionBar,
}: PageHeaderProps) {
  return (
    <header className="px-4 flex justify-between items-center sticky top-0 bg-background/50 backdrop-blur-sm py-2 border-b">
      <div className="flex gap-4 items-center">
        {showBackButton && (
          <Button variant="outline" onClick={() => window.history.back()}>
            Zurück
          </Button>
        )}
        <h1 className="text-xl">{title}</h1>
      </div>

      <nav className="flex gap-4 ">{actionBar}</nav>
    </header>
  );
}
