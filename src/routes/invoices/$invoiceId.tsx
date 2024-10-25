import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import {
  IncomingInvoiceForm,
  IncomingInvoiceFormRef,
} from "@/features/invoices/incomingInvoiceForm";
import { IncomingInvoice } from "@/features/invoices/invoiceSchema";
import incomingInvoiceStore from "@/features/invoices/incomingInvoiceStore";
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
      incomingInvoiceStore
        .get(invoiceId)
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
          setLoading(false);
        });
    }, [invoiceId]);

    if (loading) {
      return <div>Loading...</div>;
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
                onClick={() => {
                  incomingInvoiceStore.delete(invoiceId);
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
