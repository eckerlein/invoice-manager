import { PageBoundary } from "@/components/sections/PageBoundry";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import {
  OutgoingInvoiceForm,
  OutgoingInvoiceFormRef,
} from "@/features/invoices/outgoing/outgoingInvoiceForm";
import { OutgoingInvoice } from "@/features/invoices/outgoing/outgoingInvoiceSchema";
import OutgoingInvoiceStore from "@/features/invoices/outgoing/outgoingInvoiceStore";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/invoices/$outgoingId/edit")({
  component: () => {
    const { outgoingId } = useParams({
      from: "/invoices/$outgoingId/edit",
    });
    const [data, setData] = useState<OutgoingInvoice>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const navigate = useNavigate();
    const formRef = useRef<OutgoingInvoiceFormRef>(null);

    useEffect(() => {
      async function fetchInvoiceData() {
        try {
          const invoiceStore = await OutgoingInvoiceStore.getInstance();
          const invoiceData = await invoiceStore.get(outgoingId);
          setData(invoiceData);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching invoice data:", err);
          setError(err as Error);
          setLoading(false);
        }
      }

      fetchInvoiceData();
    }, [outgoingId]);

    if (loading) {
      return <PageBoundary />;
    }

    if (error) {
      return <PageBoundary.Error>Error: {error.message}</PageBoundary.Error>;
    }

    if (!data) {
      return <PageBoundary.Error>Keine Daten gefunden</PageBoundary.Error>;
    }

    return (
      <main>
        <PageHeader
          showBackButton={true}
          title={
            <>
              <span className="font-bold">{data.name}</span> anpassen:
            </>
          }
          actionBar={
            <>
              <Button
                variant="destuctiveOutline"
                onClick={async () => {
                  const invoiceStore = await OutgoingInvoiceStore.getInstance();
                  await invoiceStore.delete(outgoingId);
                  navigate({ to: "/invoices" });
                }}
              >
                Löschen
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  formRef.current?.submit();
                }}
              >
                Speichern
              </Button>
            </>
          }
        />
        <OutgoingInvoiceForm
          formType="update"
          className="px-4 pt-4 pb-12"
          defaultValues={data}
          ref={formRef}
          showButton={false}
        />
      </main>
    );
  },
});
