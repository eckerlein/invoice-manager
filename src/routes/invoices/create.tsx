import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import {
  IncomingInvoiceForm,
  IncomingInvoiceFormRef,
} from "@/features/invoices/incomingInvoiceForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/invoices/create")({
  component: () => {
    const navigate = useNavigate();
    const formRef = useRef<IncomingInvoiceFormRef>(null);

    return (
      <main>
        <PageHeader
          showBackButton={true}
          title="Eingehende Rechnung aufnehmen"
          actionBar={
            <>
              <Button
                variant="default"
                onClick={async () => {
                  await formRef.current?.submit();
                  // navigate({ to: "/contacts" });
                }}
              >
                Speichern
              </Button>
            </>
          }
        />
        <IncomingInvoiceForm
          className="px-4 pt-4 pb-12"
          ref={formRef}
          showButton={false}
        />
      </main>
    );
  },
});
