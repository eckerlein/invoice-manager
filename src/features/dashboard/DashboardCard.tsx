import PageHeader from "@/components/sections/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export type DashboardCardProps = {
  title: string;
  link: string;
  children: React.ReactNode;
};

export function DashboardCard({ title, link, children }: DashboardCardProps) {
  return (
    <div className="relative w-full aspect-square bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex flex-col h-full">
        <PageHeader
          title={title}
          size="md"
          actionBar={
            <Link
              to={link}
              className={buttonVariants({ variant: "default", size: "xs" })}
            >
              <Plus />
            </Link>
          }
        />
        {/* Scroll container for the content */}
        <div className="flex-1 p-2 overflow-y-auto overflow-x-hidden min-w-0">
          <div className="w-full">{children}</div>{" "}
          {/* Ensure children don't exceed container width */}
        </div>
      </div>
    </div>
  );
}
