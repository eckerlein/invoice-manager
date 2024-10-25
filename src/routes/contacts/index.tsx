import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/sections/PageHeader";
import { Plus } from "lucide-react";
import ContactTable from "@/features/contacts/contactTable";

export const Route = createFileRoute("/contacts/")({
  component: () => (
    <main className="relative w-full h-full">
      <PageHeader
        title={"Kontakte"}
        actionBar={
          <Link
            to="/contacts/create"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus />
          </Link>
        }
      />
      <ContactTable />
    </main>
  ),
});
