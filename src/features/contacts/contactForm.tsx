import React from "react";
import { FormHelper } from "../forms/formService";
import { Contact, contactSchema } from "./contactSchema";

export function ContactForm() {
  function onSubmit(data: Contact) {
    console.log("Submit");
    console.log(data);
  }

  return <FormHelper schema={contactSchema} onSubmit={onSubmit} />;
}
