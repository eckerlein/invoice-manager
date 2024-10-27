import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import {
  IncomingInvoiceForm,
  IncomingInvoiceFormRef,
} from "@/features/invoices/incoming/incomingInvoiceForm";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/invoices/create")({
  component: () => {
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
                  const success = await formRef.current?.submit();
                  if (success) history.back();
                  // history.back();
                }}
              >
                Speichern
              </Button>
            </>
          }
        />
        <IncomingInvoiceForm
          formType="create"
          className="px-4 pt-4 pb-12"
          ref={formRef}
          showButton={false}
        />
      </main>
    );
  },
});
