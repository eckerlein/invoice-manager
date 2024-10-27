import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import {
  IncomingInvoiceForm,
  IncomingInvoiceFormRef,
} from "@/features/invoices/incoming/incomingInvoiceForm";
import { IncomingInvoice } from "@/features/invoices/incoming/incomingInvoiceSchema";
import IncomingInvoiceStore from "@/features/invoices/incoming/incomingInvoiceStore"; // Update to use the singleton
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/invoices/$invoiceId")({
  component: () => {
    const { invoiceId } = useParams({ from: "/invoices/$invoiceId" });
    const [data, setData] = useState<IncomingInvoice>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const navigate = useNavigate();
    const formRef = useRef<IncomingInvoiceFormRef>(null);

    useEffect(() => {
      async function fetchInvoiceData() {
        try {
          const invoiceStore = await IncomingInvoiceStore.getInstance();
          const invoiceData = await invoiceStore.get(invoiceId);
          setData(invoiceData);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching invoice data:", err);
          setError(err as Error);
          setLoading(false);
        }
      }

      fetchInvoiceData();
    }, [invoiceId]);

    if (loading) {
      return <div></div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (!data) {
      return <div>Keine Daten gefunden</div>;
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
                  const invoiceStore = await IncomingInvoiceStore.getInstance();
                  await invoiceStore.delete(invoiceId);
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
        <IncomingInvoiceForm
          formType="update"
          className="px-4 pt-4 pb-12"
          defaultValues={data}
          ref={formRef}
          showButton={false}
          invoiceId={invoiceId}
        />
      </main>
    );
  },
});
