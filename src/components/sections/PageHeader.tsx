import React from "react";

type PageHeaderProps = {
  title: React.ReactNode;
  actionBar?: React.ReactNode;
};

export default function PageHeader({ title, actionBar }: PageHeaderProps) {
  return (
    <header className="px-4 flex justify-between items-center sticky top-0 bg-background/50 backdrop-blur-sm py-2 border-b">
      <h1 className="text-xl">{title}</h1>
      <nav className="flex gap-4 ">{actionBar}</nav>
    </header>
  );
}
