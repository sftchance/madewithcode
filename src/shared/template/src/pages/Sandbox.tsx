import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import CodeMirror from "@uiw/react-codemirror";

import { javascript } from "@codemirror/lang-javascript";
import { tags as t } from "@lezer/highlight";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useHotkeys } from "react-hotkeys-hook";

import { useDiff } from "../hooks/useDiff";
import { useProjects } from "../hooks/useProject";

import { Help } from "../components/Help";
import { Preview } from "../components/Preview";
import { useClipboard } from "../hooks/useClipboard";

export const Sandbox: React.FC = () => {
	const navigate = useNavigate();

	const { id } = useParams();

	const { clipboard, copied } = useClipboard();

	const { projects, project, count, page, hasPrev, hasNext, move } =
		useProjects({
			id,
		});

	const { changes, animations } = useDiff({ project });

	const [isSceneCollapsed, setIsSceneCollapsed] = useState(true);

	useHotkeys("ctrl+h", () => {
		navigate("/");
	});

	useHotkeys(
		"ctrl+l",
		() => {
			if (project || projects.length === 0) return;

			navigate(`/${projects[0].name}/`);
		},
		[projects, project]
	);

	useHotkeys(
		"ctrl+i",
		() => {
			setIsSceneCollapsed((prev) => !prev);
		},
		[isSceneCollapsed]
	);

	useHotkeys(
		"ctrl+j",
		() => {
			if (hasPrev) move(-1);
		},
		[page, page, count]
	);

	useHotkeys(
		"ctrl+k",
		() => {
			if (hasNext) move(1);
		},
		[hasNext, page, count]
	);

	useEffect(() => {
		setIsSceneCollapsed(true);
	}, [id]);

	if (!project)
		return (
			<div className="flex min-h-screen w-full items-center justify-center space-y-2 bg-black p-6 text-white transition-all">
				<div className="mx-auto w-full max-w-md">
					<h2 className="mb-4">
						Projects
						<span className="text-sm text-slate-400">
							{" "}
							({count})
						</span>
					</h2>

					{projects.map((project, index) => {
						return (
							<Link
								key={index}
								className="w-full cursor-pointer"
								to={`/${project.name}/`}
							>
								<div className="mb-2 flex cursor-pointer rounded-lg bg-gray-900 transition-all hover:bg-gray-800">
									<p className="text-md whitespace-wrap w-4/12 rounded-lg bg-gray-800 p-2 px-4 text-slate-300 transition-all">
										{project.name}
									</p>
									<p className="whitespace-wrap w-8/12 overflow-hidden overflow-ellipsis p-2 px-4 text-justify text-sm text-slate-500">
										{project.description}
									</p>
								</div>
							</Link>
						);
					})}

					<div className="mt-4 flex space-x-4 text-sm">
						<button
							className="rounded-lg bg-gray-800 p-1 px-2 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500"
							onClick={() => move(-1)}
							disabled={page === 1}
						>{`${"<"}`}</button>
						<p className="p-1 px-2">{page}</p>
						<button
							className="rounded-lg bg-gray-800 p-1 px-2 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500"
							onClick={() => move(1)}
							disabled={!hasNext}
						>{`${">"}`}</button>
					</div>
				</div>
			</div>
		);

	return (
		<>
			<Help />

			<div className="flex h-screen flex-row">
				<div className="flex h-full w-full flex-col bg-black p-6 text-white">
					<div className="mb-4 flex flex-row items-center justify-center space-x-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
						<button
							className="rounded-lg bg-gray-800 p-1 px-2 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500"
							onClick={() => navigate("/")}
						>
							{`${"<"}`}
						</button>

						<h2 className="w-full">
							{project.name || "Not Found"}
						</h2>

						<button
							className="ml-auto rounded-lg bg-gray-800 p-1 px-2 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500"
							onClick={() =>
								setIsSceneCollapsed(!isSceneCollapsed)
							}
						>
							🔬 Scene
						</button>
					</div>

					<div className="m-auto flex max-w-lg items-center justify-center">
						{project.steps.length > 0 ? (
							<Preview code={project.steps[page - 1]?.code} />
						) : (
							<p className="whitespace-wrap w-8/12 cursor-pointer overflow-hidden overflow-ellipsis text-center text-sm text-slate-500 transition-all hover:text-slate-400">
								// TODO: Write component.
							</p>
						)}
					</div>

					{/* <div className="flex flex-row items-center justify-between"> */}
					{/* <div className="mb-4 flex items-center">
						<button
							className={`rounded-l-lg bg-gray-800 p-1 px-4 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500`}
						>
							📸 Export
						</button>

						<select
							className="bg-gray-900 p-1 px-2 text-slate-400 transition-all hover:bg-gray-700 hover:text-slate-100 
                    disabled:bg-gray-900 disabled:text-slate-500"
						>
							{project.steps.map((_, i) => (
								<option key={i} value={i + 1}>
									#{i + 1}
								</option>
							))}
						</select>

						{project.steps.length > 1 && (
							<>
								<p className="bg-gray-900 p-1 pl-4 text-slate-700">
									-
								</p>

								<select
									className="bg-gray-900 p-1 px-2 text-slate-400 transition-all hover:bg-gray-700 hover:text-slate-100 
                    disabled:bg-gray-900 disabled:text-slate-500"
								>
									{project.steps.slice(-1).map((_, i) => (
										<option
											key={count + i}
											value={count - i}
										>
											#{count - i}
										</option>
									))}
								</select>
							</>
						)}

						<select className="rounded-r-lg bg-gray-900 p-1 px-4 text-slate-400 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500">
							<option value="this">.png</option>
							<option value="all">.mp4</option>
						</select>
					</div> */}

					<div className="flex items-center">
						<p className="text-sm text-slate-500">
							Press '<span className="text-slate-100">.</span>'
							for help.
						</p>

						<div className="ml-auto flex space-x-4 text-sm">
							<button
								className="rounded-lg bg-gray-800 p-1 px-2 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500"
								onClick={() => move(-1)}
								disabled={page === 1}
							>
								{`${"<"}`}
							</button>
							<p className="p-1 px-2 text-slate-400">
								{page} / {project.steps.length}
							</p>
							<button
								className="rounded-lg bg-gray-800 p-1 px-2 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500"
								onClick={() => move(1)}
								disabled={page > project.steps.length - 1}
							>
								{`${">"}`}
							</button>
						</div>
					</div>
				</div>

				<div
					className={`flex h-full max-w-3xl flex-col space-y-4 border-l-2 border-double border-slate-700 bg-black text-sm text-white transition-all 
                ${
					isSceneCollapsed
						? "w-0 p-0 opacity-0"
						: "opacity-1 w-full p-6"
				}`}
				>
					<div className="flex h-full flex-col space-y-4">
						<p className="flex items-center space-x-2 text-slate-400">
							Changes
							<button
								className={`ml-auto rounded-lg bg-gray-800 p-1 px-2 transition-all hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500 ${
									copied["changes"]
										? "bg-green-500 text-slate-100"
										: "text-slate-300 hover:bg-gray-700"
								}`}
								onClick={
									clipboard(
										"changes",
										project.steps[page - 1]?.code || ""
									).onCopy
								}
								onMouseLeave={clipboard("changes").onLeave}
							>
								📋 {copied["changes"] ? "Copied" : "Copy"}
							</button>
						</p>

						<ol className="h-full space-y-2 overflow-y-scroll">
							{changes &&
								changes[page - 1]
									.filter(
										(change) =>
											change.added || change.removed
									)
									.map((change, index) => {
										return (
											<li
												key={index}
												className={`flex cursor-pointer rounded-sm border border-solid p-1 px-2 transition-all ease-in-out ${
													change.added
														? "border-green-700 bg-green-900 text-green-300 hover:border-green-600 hover:bg-green-800 hover:text-green-200"
														: "border-red-700 bg-red-900 text-red-300 hover:border-red-600 hover:bg-red-800 hover:text-red-200"
												}`}
											>
												<span className="w-12">
													{index + 1}.
												</span>
												<span
													className={`w-12 ${
														change.added
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{change.added ? "+" : ""}
													{change.removed ? "-" : ""}
													{change.count}
												</span>
												<span>{change.value}</span>
											</li>
										);
									})}
						</ol>

						<p className="flex items-center space-x-4 border-t-2 border-double border-slate-700 pt-2 text-slate-400">
							Animation Code
							<button
								className={`ml-auto rounded-lg bg-gray-800 p-1 px-2 transition-all hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500 ${
									copied["animation"]
										? "bg-green-500 text-slate-100"
										: "text-slate-300 hover:bg-gray-700"
								} `}
								onClick={
									clipboard(
										"animation",
										project.steps[page - 1]?.code || ""
									).onCopy
								}
								onMouseLeave={clipboard("animation").onLeave}
							>
								📋 {copied["animation"] ? "Copied" : "Copy"}
							</button>
						</p>

						<CodeMirror
							value={(animations && animations[page - 1]) || ""}
							className="bg-black text-black"
							extensions={[javascript({ jsx: true })]}
							editable={false}
							theme={tokyoNightInit({
								styles: [{ tag: t.comment, color: "#6272a4" }],
								settings: {
									caret: "#c6c6c6",
									fontFamily: "monospace",
									background: "#000",
									gutterBackground: "#000",
									lineHighlight: "#1e1e1e",
									selection: "#1e1e1e",
									selectionMatch: "#1e1e1e",
								},
							})}
						/>

						<p className="flex items-center space-x-4 border-t-2 border-double border-slate-700 pt-2 text-slate-400">
							Scene Preview
							<button className="ml-auto rounded-lg bg-gray-800 p-1 px-2 text-slate-300 transition-all hover:bg-gray-700 hover:text-slate-100 disabled:bg-gray-900 disabled:text-slate-500">
								👁️ View
							</button>
						</p>

						<div className="min-h-20 justify-content align-items flex w-full items-center rounded-lg bg-gray-900 p-6 text-center">
							<p className="w-full text-center text-slate-700">
								// TODO: Preview goes here
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
