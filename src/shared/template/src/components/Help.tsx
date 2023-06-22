import { useState } from "react";

import { useHotkeys } from "react-hotkeys-hook";

export const Help: React.FC = () => {
	const [collapsed, setCollapsed] = useState<boolean>(true);

	useHotkeys(".", () => {
		setCollapsed(!collapsed);
	});

	useHotkeys("escape", () => {
		setCollapsed(true);
	});

	useHotkeys("ctrl", () => {
		setCollapsed(true);
	});

	return (
		<div
			className={`h-100 w-100  absolute bottom-0 left-0 right-0 top-0 z-10 flex flex-col items-center bg-black text-white transition-all ${
				collapsed ? "pointer-events-none opacity-0" : "opacity-100"
			}`}
			onClick={() => setCollapsed(true)}
		>
			<div className="m-auto space-y-4">
				<h1 className="lg flex items-center space-x-2">
					Hotkeys
					<button
						className="ml-auto rounded-lg bg-gray-800 p-1 px-2 text-sm text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-800 disabled:text-slate-500"
						onClick={() => setCollapsed(true)}
					>
						❌ Close
					</button>
				</h1>

				<ul className="space-y-2 text-sm text-slate-300">
					<li>
						<code className="rounded-lg bg-gray-800 p-1 px-2 text-slate-100">
							.
						</code>{" "}
						- Toggle help menu.
					</li>
				</ul>

				<h2 className="text-slate-300">Navigation</h2>

				<ul className="space-y-2 text-sm text-slate-300">
					<li>
						<code className="rounded-lg bg-gray-800 p-1 px-2 text-slate-100">
							ctrl + l
						</code>{" "}
						- Navigate to newest scene.
					</li>
					<li>
						<code className="rounded-lg bg-gray-800 p-1 px-2 text-slate-100">
							ctrl + i
						</code>{" "}
						- Inspect and copy Scene code.
					</li>
					<li>
						<code className="rounded-lg bg-gray-800 p-1 px-2 text-slate-100">
							ctrl + j
						</code>{" "}
						- Go to previous page/scene.
					</li>
					<li>
						<code className="rounded-lg bg-gray-800 p-1 px-2 text-slate-100">
							ctrl + k
						</code>{" "}
						- Go to next page/scene.
					</li>
				</ul>
			</div>
		</div>
	);
};
