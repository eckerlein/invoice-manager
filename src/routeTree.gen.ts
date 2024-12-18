/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as IndexImport } from "./routes/index";
import { Route as InvoicesIndexImport } from "./routes/invoices/index";
import { Route as ContactsIndexImport } from "./routes/contacts/index";
import { Route as InvoicesCreateOutgoingImport } from "./routes/invoices/createOutgoing";
import { Route as InvoicesCreateIncomingImport } from "./routes/invoices/createIncoming";
import { Route as InvoicesIncomingInvoiceIdImport } from "./routes/invoices/$incomingInvoiceId";
import { Route as ContactsCreateImport } from "./routes/contacts/create";
import { Route as ContactsContactIdImport } from "./routes/contacts/$contactId";
import { Route as InvoicesOutgoingIdEditImport } from "./routes/invoices/$outgoingId/edit";

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

const InvoicesIndexRoute = InvoicesIndexImport.update({
  id: "/invoices/",
  path: "/invoices/",
  getParentRoute: () => rootRoute,
} as any);

const ContactsIndexRoute = ContactsIndexImport.update({
  id: "/contacts/",
  path: "/contacts/",
  getParentRoute: () => rootRoute,
} as any);

const InvoicesCreateOutgoingRoute = InvoicesCreateOutgoingImport.update({
  id: "/invoices/createOutgoing",
  path: "/invoices/createOutgoing",
  getParentRoute: () => rootRoute,
} as any);

const InvoicesCreateIncomingRoute = InvoicesCreateIncomingImport.update({
  id: "/invoices/createIncoming",
  path: "/invoices/createIncoming",
  getParentRoute: () => rootRoute,
} as any);

const InvoicesIncomingInvoiceIdRoute = InvoicesIncomingInvoiceIdImport.update({
  id: "/invoices/$incomingInvoiceId",
  path: "/invoices/$incomingInvoiceId",
  getParentRoute: () => rootRoute,
} as any);

const ContactsCreateRoute = ContactsCreateImport.update({
  id: "/contacts/create",
  path: "/contacts/create",
  getParentRoute: () => rootRoute,
} as any);

const ContactsContactIdRoute = ContactsContactIdImport.update({
  id: "/contacts/$contactId",
  path: "/contacts/$contactId",
  getParentRoute: () => rootRoute,
} as any);

const InvoicesOutgoingIdEditRoute = InvoicesOutgoingIdEditImport.update({
  id: "/invoices/$outgoingId/edit",
  path: "/invoices/$outgoingId/edit",
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/contacts/$contactId": {
      id: "/contacts/$contactId";
      path: "/contacts/$contactId";
      fullPath: "/contacts/$contactId";
      preLoaderRoute: typeof ContactsContactIdImport;
      parentRoute: typeof rootRoute;
    };
    "/contacts/create": {
      id: "/contacts/create";
      path: "/contacts/create";
      fullPath: "/contacts/create";
      preLoaderRoute: typeof ContactsCreateImport;
      parentRoute: typeof rootRoute;
    };
    "/invoices/$incomingInvoiceId": {
      id: "/invoices/$incomingInvoiceId";
      path: "/invoices/$incomingInvoiceId";
      fullPath: "/invoices/$incomingInvoiceId";
      preLoaderRoute: typeof InvoicesIncomingInvoiceIdImport;
      parentRoute: typeof rootRoute;
    };
    "/invoices/createIncoming": {
      id: "/invoices/createIncoming";
      path: "/invoices/createIncoming";
      fullPath: "/invoices/createIncoming";
      preLoaderRoute: typeof InvoicesCreateIncomingImport;
      parentRoute: typeof rootRoute;
    };
    "/invoices/createOutgoing": {
      id: "/invoices/createOutgoing";
      path: "/invoices/createOutgoing";
      fullPath: "/invoices/createOutgoing";
      preLoaderRoute: typeof InvoicesCreateOutgoingImport;
      parentRoute: typeof rootRoute;
    };
    "/contacts/": {
      id: "/contacts/";
      path: "/contacts";
      fullPath: "/contacts";
      preLoaderRoute: typeof ContactsIndexImport;
      parentRoute: typeof rootRoute;
    };
    "/invoices/": {
      id: "/invoices/";
      path: "/invoices";
      fullPath: "/invoices";
      preLoaderRoute: typeof InvoicesIndexImport;
      parentRoute: typeof rootRoute;
    };
    "/invoices/$outgoingId/edit": {
      id: "/invoices/$outgoingId/edit";
      path: "/invoices/$outgoingId/edit";
      fullPath: "/invoices/$outgoingId/edit";
      preLoaderRoute: typeof InvoicesOutgoingIdEditImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "/contacts/$contactId": typeof ContactsContactIdRoute;
  "/contacts/create": typeof ContactsCreateRoute;
  "/invoices/$incomingInvoiceId": typeof InvoicesIncomingInvoiceIdRoute;
  "/invoices/createIncoming": typeof InvoicesCreateIncomingRoute;
  "/invoices/createOutgoing": typeof InvoicesCreateOutgoingRoute;
  "/contacts": typeof ContactsIndexRoute;
  "/invoices": typeof InvoicesIndexRoute;
  "/invoices/$outgoingId/edit": typeof InvoicesOutgoingIdEditRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "/contacts/$contactId": typeof ContactsContactIdRoute;
  "/contacts/create": typeof ContactsCreateRoute;
  "/invoices/$incomingInvoiceId": typeof InvoicesIncomingInvoiceIdRoute;
  "/invoices/createIncoming": typeof InvoicesCreateIncomingRoute;
  "/invoices/createOutgoing": typeof InvoicesCreateOutgoingRoute;
  "/contacts": typeof ContactsIndexRoute;
  "/invoices": typeof InvoicesIndexRoute;
  "/invoices/$outgoingId/edit": typeof InvoicesOutgoingIdEditRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/contacts/$contactId": typeof ContactsContactIdRoute;
  "/contacts/create": typeof ContactsCreateRoute;
  "/invoices/$incomingInvoiceId": typeof InvoicesIncomingInvoiceIdRoute;
  "/invoices/createIncoming": typeof InvoicesCreateIncomingRoute;
  "/invoices/createOutgoing": typeof InvoicesCreateOutgoingRoute;
  "/contacts/": typeof ContactsIndexRoute;
  "/invoices/": typeof InvoicesIndexRoute;
  "/invoices/$outgoingId/edit": typeof InvoicesOutgoingIdEditRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | "/contacts/$contactId"
    | "/contacts/create"
    | "/invoices/$incomingInvoiceId"
    | "/invoices/createIncoming"
    | "/invoices/createOutgoing"
    | "/contacts"
    | "/invoices"
    | "/invoices/$outgoingId/edit";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | "/contacts/$contactId"
    | "/contacts/create"
    | "/invoices/$incomingInvoiceId"
    | "/invoices/createIncoming"
    | "/invoices/createOutgoing"
    | "/contacts"
    | "/invoices"
    | "/invoices/$outgoingId/edit";
  id:
    | "__root__"
    | "/"
    | "/contacts/$contactId"
    | "/contacts/create"
    | "/invoices/$incomingInvoiceId"
    | "/invoices/createIncoming"
    | "/invoices/createOutgoing"
    | "/contacts/"
    | "/invoices/"
    | "/invoices/$outgoingId/edit";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  ContactsContactIdRoute: typeof ContactsContactIdRoute;
  ContactsCreateRoute: typeof ContactsCreateRoute;
  InvoicesIncomingInvoiceIdRoute: typeof InvoicesIncomingInvoiceIdRoute;
  InvoicesCreateIncomingRoute: typeof InvoicesCreateIncomingRoute;
  InvoicesCreateOutgoingRoute: typeof InvoicesCreateOutgoingRoute;
  ContactsIndexRoute: typeof ContactsIndexRoute;
  InvoicesIndexRoute: typeof InvoicesIndexRoute;
  InvoicesOutgoingIdEditRoute: typeof InvoicesOutgoingIdEditRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ContactsContactIdRoute: ContactsContactIdRoute,
  ContactsCreateRoute: ContactsCreateRoute,
  InvoicesIncomingInvoiceIdRoute: InvoicesIncomingInvoiceIdRoute,
  InvoicesCreateIncomingRoute: InvoicesCreateIncomingRoute,
  InvoicesCreateOutgoingRoute: InvoicesCreateOutgoingRoute,
  ContactsIndexRoute: ContactsIndexRoute,
  InvoicesIndexRoute: InvoicesIndexRoute,
  InvoicesOutgoingIdEditRoute: InvoicesOutgoingIdEditRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/contacts/$contactId",
        "/contacts/create",
        "/invoices/$incomingInvoiceId",
        "/invoices/createIncoming",
        "/invoices/createOutgoing",
        "/contacts/",
        "/invoices/",
        "/invoices/$outgoingId/edit"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/contacts/$contactId": {
      "filePath": "contacts/$contactId.tsx"
    },
    "/contacts/create": {
      "filePath": "contacts/create.tsx"
    },
    "/invoices/$incomingInvoiceId": {
      "filePath": "invoices/$incomingInvoiceId.tsx"
    },
    "/invoices/createIncoming": {
      "filePath": "invoices/createIncoming.tsx"
    },
    "/invoices/createOutgoing": {
      "filePath": "invoices/createOutgoing.tsx"
    },
    "/contacts/": {
      "filePath": "contacts/index.tsx"
    },
    "/invoices/": {
      "filePath": "invoices/index.tsx"
    },
    "/invoices/$outgoingId/edit": {
      "filePath": "invoices/$outgoingId/edit.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
