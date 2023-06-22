import { Route, Routes } from "react-router-dom";

import { Sandbox } from "./pages/Sandbox";

import "./App.css";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Sandbox />} />
				<Route path="/:id/" element={<Sandbox />} />
			</Routes>
		</>
	);
}

export default App;
