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
    <div className="relative w-full aspect-square bg-card rounded-lg border-border border overflow-hidden">
      <div className="flex flex-col">
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
        <div className="overflow-x-hidden overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
}
