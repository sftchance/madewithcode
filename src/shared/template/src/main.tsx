import React from "react";
import ReactDOM from "react-dom/client";

import { HotkeysProvider } from "react-hotkeys-hook";

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.js";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<HotkeysProvider initiallyActiveScopes={["global"]}>
			<Router>
				<App />
			</Router>
		</HotkeysProvider>
	</React.StrictMode>
);
