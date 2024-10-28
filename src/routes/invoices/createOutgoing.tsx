import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import {
  OutgoingInvoiceForm,
  OutgoingInvoiceFormRef,
} from "@/features/invoices/outgoing/outgoingInvoiceForm";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/invoices/createOutgoing")({
  component: () => {
    const formRef = useRef<OutgoingInvoiceFormRef>(null);

    return (
      <main>
        <PageHeader
          showBackButton={true}
          title="Ausgehende Rechnung erstellen"
          actionBar={
            <>
              <Button
                variant="default"
                onClick={async () => {
                  const success = await formRef.current?.submit();
                  if (success) history.back();
                }}
              >
                Speichern
              </Button>
            </>
          }
        />
        <OutgoingInvoiceForm
          formType="create"
          className="px-4 pt-4 pb-12"
          ref={formRef}
          showButton={false}
        />
      </main>
    );
  },
});
