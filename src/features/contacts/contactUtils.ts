import { Contact } from "./contactSchema";

export const getContactName = (
  contact: Contact | Omit<Contact, "id">
): string => {
  {
    return contact.baseInfo?.type === "person"
      ? `${contact.baseInfo.firstName} ${contact.baseInfo.lastName}`
      : contact.baseInfo?.companyName;
  }
};

// {contact.address?.map((address) => address.city).join(", ")}

export const getContactCities = (
  contact: Contact | Omit<Contact, "id">
): string => {
  {
    return contact.address?.map((address) => address.city).join(", ") ?? "";
  }
};
