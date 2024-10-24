
export const getContactName = (
  contact: Contact | Omit<Contact, "id">
): string => {
  {
    return contact.baseInfo?.type === "person"
      ? `${contact.baseInfo.firstName} ${contact.baseInfo.lastName}`
      : contact.baseInfo?.companyName;
  }
};
