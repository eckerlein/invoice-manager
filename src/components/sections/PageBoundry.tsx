import React from "react";
import PageHeader from "./PageHeader";

type PageBoundaryProps = {
  children?: React.ReactNode;
};

export const PageBoundary = ({ children }: PageBoundaryProps) => (
  <main>
    <PageHeader showBackButton={true} title="" />
    <div className="p-4">{children}</div>
  </main>
);

type PageBoundaryErrorProps = {
  children?: React.ReactNode;
};

PageBoundary.Error = ({ children }: PageBoundaryErrorProps) => (
  <PageBoundary>
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <pre className="whitespace-pre-wrap font-mono">{children}</pre>
    </div>
  </PageBoundary>
);
