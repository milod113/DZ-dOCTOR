import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { configureEcho } from '@laravel/echo-react';
import { ThemeProvider } from '@/Contexts/ThemeContext'; // ✅ Import ThemeProvider

configureEcho({
    broadcaster: 'reverb',
});

const appName = document.querySelector("title")?.textContent || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob("./Pages/**/*.tsx")),
    setup({ el, App, props }) {
        createRoot(el).render(
            // ✅ Wrap App with ThemeProvider
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
