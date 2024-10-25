# Invoice Manager

![License: CC BY-NC-ND 4.0](https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png)

This project is an Invoice Manager built with Tauri, React, and Typescript using Vite as a build tool. It provides a desktop application to manage invoices, leveraging the power of Tauri for native system interactions and React for building a dynamic user interface.

## ✨ Key Technologies

    •	Tauri: Cross-platform application framework using web technologies.
    •	React: Frontend library for building user interfaces.
    •	Typescript: Strictly typed superset of JavaScript.
    •	Vite: Fast development build tool.
    •	TailwindCSS: Utility-first CSS framework for styling.

## 📂 Project Structure

```
.
├── public/ # Static assets
├── src/
│ ├── components/ # Shared UI components (Button, Form elements, etc.)
│ ├── features/ # Domain-specific components (Invoices, Contacts)
│ ├── pages/ # Application pages (Dashboard, Invoices, Contacts)
│ ├── App.tsx # Root component
│ ├── main.tsx # Entry point for React
├── tauri/ # Tauri configuration files
├── index.html # Main HTML template
├── tailwind.config.js # TailwindCSS configuration
├── package.json # Project dependencies and scripts
├── tsconfig.json # Typescript configuration
└── README.md # This documentation
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 16.x) and pnpm (package manager)
- Rust and the required Tauri prerequisites (see Tauri setup)
- VS Code (Recommended) with the following extensions:
- Tauri Extension
- Rust Analyzer

#### Installation

1. Clone this repository:

   `git clone https://github.com/your-username/invoice-manager.git && cd invoice-manager`

2. Install dependencies:

   `pnpm install`

3. Build the app for production:

   `pnpm tauri build`

4. To run the Tauri app:

   `pnpm tauri dev`

#### Running Tests

To run unit tests and integration tests, use:

`pnpm test`

## 🌟 Features

- Invoice Management: Create, edit, and delete invoices with support for attaching files.
- Contact Management: Manage customer contacts.
- Responsive Design: The UI adapts based on available space, hiding non-critical columns when space is limited.
- Tauri Integration: Leverage native functionality, including file handling and system APIs.
- TailwindCSS: Styled using utility-first CSS for rapid development.

## 💻 Development Workflow

1. Developing: Use the `pnpm tauri dev` command to start the Vite dev server and hot reload the Tauri app.
2. Testing: Use pnpm test to run unit tests with Vitest.
3. Building: `pnpm tauri build` will build both the React app and the Tauri app.

## 📘 Documentation

- Tauri Docs
- React Docs
- Typescript Docs
- Vite Docs
- TailwindCSS Docs

## 🎯 Future Improvements

- Add comprehensive testing for all components.
- Improve mobile responsiveness.
- Extend invoice features, such as exporting as PDF and automatic reminders.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. See the [LICENSE](./LICENSE) file for details.
