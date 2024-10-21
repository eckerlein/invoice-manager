export type Contact = {
  id: string; // Kunden-Nr.
  address: Address;
  email?: Email[];
  phoneNumber?: PhoneNumber[];
  taxInfo?: TaxInfo;
  bankAccount?: BankAccount;
} & (
  | {
      type: "company";
      name: string; // Firmenname
      isGroupCustomer?: boolean; // Sammelkunde
    }
  | {
      type: "person";
      title?: string; // Anrede
      firstName: string; // Vorname
      lastName: string; // Nachname
    }
);

export type Address = {
  type: "billing" | "shipping"; // Rechnungadresse or Lieferadresse
  additionalInfo?: string; // Adresszusatz
  street: string;
  postalCode: string;
  city: string;
  country: string; // Land
};

export type Email = {
  emailAddress: string;
  type: "business" | "personal" | "office" | "other"; // Geschäftslich, Privat, Büro, Alternativ
};

export type PhoneNumber = {
  number: string;
  type: "business" | "mobile" | "fax" | "personal" | "office" | "other"; // Geschäftslich, Mobil, Fax, Privat, Büro, Alternativ
};

export type TaxInfo = {
  taxNumber?: string; // Steuernummer
  vatId?: string; // Umsatzsteuer-ID Nr.
  allowTaxFreeInvoices?: boolean; // Steuerfreie Rechnungen erlauben
};

export type Representative = {
  title?: string; // Anrede
  firstName: string;
  lastName: string;
  showOnInvoice?: boolean; // Ansprechpartner auf dem Beleg anzeigen
  phoneNumber?: string;
  email?: string;
};

export type BankAccount = {
  iban: string;
  bic: string;
  bankName: string;
  accountHolder: string;
};
