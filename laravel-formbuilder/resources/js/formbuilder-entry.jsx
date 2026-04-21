import { createRoot } from "react-dom/client";
import App from "./Pages/FormBuilder/App";

const rootEl = document.getElementById("formbuilder-root");

if (rootEl) {
    createRoot(rootEl).render(<App />);
}
