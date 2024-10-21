export type BaseInvoice = {
  id: string; // Belegnummer
  name: string;
  documentDate: Date; // Belegdatum
  amount: number;
  contact?: string; // Optional contact info
};

export type SelfCreatedInvoice = BaseInvoice & {
  lineItems: Array<{ description: string; quantity: number; price: number }>;
  createdDate: Date;
  editDate?: Date;
  deleteDate?: Date;
};

export type ReceivedInvoice = BaseInvoice & {
  uploadedDocument: string; // Path or URL to the uploaded file
  receivedDate: Date;
};
