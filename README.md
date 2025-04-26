# TermSumm - AI Terms & Conditions Analyzer

TermSumm is a web application built with Next.js that leverages Generative AI (powered by Genkit and Google AI) to analyze and summarize terms and conditions documents. Users can upload documents (PDF, DOCX, TXT), and the application provides a concise summary, identifies the document type, and lists potential pros and cons. It also includes a text-to-speech feature to read the summary aloud (currently simulated).

## Features

-   **Document Upload:** Supports PDF, DOCX, and TXT file formats (up to 5MB).
-   **AI Summarization:** Generates a summary of key points from the document.
-   **Document Type Identification:** Automatically detects the type of document (e.g., Privacy Policy, User Agreement).
-   **Pros & Cons Extraction:** Identifies potential benefits and drawbacks mentioned in the document.
-   **Text-to-Speech:** Converts the generated summary into audio (simulation).
-   **Responsive Design:** Adapts to various screen sizes (desktop, mobile).
-   **Theme Toggle:** Supports light and dark modes.
-   **Loading States:** Provides visual feedback during analysis.
-   **User Feedback:** Uses toasts for success and error messages.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **AI Integration:** [Genkit (Firebase Genkit)](https://firebase.google.com/docs/genkit) with [Google AI (Gemini)](https://ai.google.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
-   **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)

## Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn or pnpm
-   A Google AI API Key (for Gemini model access)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/praveen-pravi6B/termSumm
    cd termSumm
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Google AI API key:
    ```env
    GOOGLE_GENAI_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```
    *Note: You can obtain an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).*

### Running the Application

1.  **Run the Genkit development server (for AI flows):**
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    # or
    yarn genkit:watch
    # or
    pnpm genkit:watch
    ```
    This will start the Genkit development UI, typically on `http://localhost:4000`.

2.  **Run the Next.js development server:**
    Open a second terminal and run:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    This will start the Next.js application, typically on `http://localhost:9002`.

3.  **Open the application:**
    Navigate to `http://localhost:9002` in your browser.

## Folder Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── ai/                 # AI-related code (Genkit)
│   │   ├── flows/          # Genkit flows (e.g., summarization, TTS)
│   │   ├── ai-instance.ts  # Genkit initialization
│   │   └── dev.ts          # Genkit development server entry point
│   ├── app/                # Next.js App Router files
│   │   ├── (routes)/       # Route groups and pages
│   │   ├── actions.ts      # Server Actions for client-server communication
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Main page component (Home)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── app-bar.tsx     # Application header/navigation bar
│   │   ├── summary-display.tsx # Component to show analysis results
│   │   ├── theme-provider.tsx # Theme management (light/dark)
│   │   ├── theme-toggle.tsx   # Button to switch themes
│   │   └── upload-form.tsx # File upload form component
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx  # Hook to detect mobile viewport
│   │   └── use-toast.ts    # Hook for displaying toasts
│   └── lib/                # Utility functions
│       └── utils.ts        # General utility functions (e.g., cn for Tailwind)
├── .env.local              # Local environment variables (Gitignored)
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── components.json         # ShadCN UI configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── README.md               # This file
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

-   **`src/ai`**: Contains all code related to AI interactions using Genkit. Flows define the logic for interacting with the AI models.
-   **`src/app`**: Core of the Next.js application using the App Router. Defines routes, layouts, pages, and server actions.
-   **`src/components`**: Houses all React components. `ui/` contains the ShadCN base components, while others are application-specific.
-   **`src/hooks`**: Custom React hooks for reusable logic (e.g., theme management, responsive checks).
-   **`src/lib`**: Utility functions used across the application.
-   **Configuration Files**: Root files like `tailwind.config.ts`, `next.config.ts`, `tsconfig.json` manage the respective tools.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details (if applicable).
