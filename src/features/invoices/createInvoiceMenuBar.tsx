import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

type CreateInvoiceMenuBarProps = {
	triggerClassName?: string;
}

export function CreateInvoiceMenuBar({triggerClassName}: CreateInvoiceMenuBarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={ triggerClassName ?? buttonVariants({ ring: "none" })}>
        <Plus />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link to="/invoices/createIncoming">Einkaufsrechnung</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/invoices/createOutgoing">Verkaufsrechnung</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
