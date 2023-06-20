import { Link, useNavigate, useParams } from "react-router-dom"

import { useProjects } from "../hooks/useProject";

import { Preview } from "../components/Preview";
import { useState } from "react";

export const Sandbox: React.FC = () => {
    const navigate = useNavigate();

    const { id } = useParams()

    const {
        projects,
        project,
        count,
        page,
        hasNext,
        move,
    } = useProjects({ id });

    const [width, setWidth] = useState("1080");
    const [height, setHeight] = useState("1920");

    const [isCopied, setIsCopied] = useState(false);
    const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);

    if (!project) return <div className="p-6 bg-black text-white min-h-screen space-y-2 flex items-center justify-center w-full transition-all">
        <div className="max-w-md w-full mx-auto">
            <h2 className="mb-4">
                Projects
                <span className="text-sm text-gray-400"> ({count})</span>
            </h2>

            {projects.map((project, index) => {
                return <Link key={index} className="cursor-pointer w-full" to={`/${project.name}/`}>
                    <div className="flex bg-gray-900 rounded-lg mb-2 hover:bg-gray-800 transition-all cursor-pointer">
                        <p className="p-2 px-4 bg-gray-800 text-slate-300 rounded-lg text-md whitespace-wrap transition-all w-4/12">{project.name}</p>
                        <p className="p-2 px-4 text-slate-500 text-sm text-justify whitespace-wrap overflow-hidden overflow-ellipsis w-8/12">{project.description}</p>
                    </div>
                </Link>
            })}

            <div className="flex space-x-4 text-sm mt-4">
                <button
                    className="bg-gray-800 rounded-lg p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all"
                    onClick={() => move(-1)}
                    disabled={page === 1}
                >{`${"<"}`}</button>
                <p className="p-1 px-2">{page}</p>
                <button
                    className="bg-gray-800 rounded-lg p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all"
                    onClick={() => move(1)}
                    disabled={!hasNext}
                >{`${">"}`}</button>
            </div>
        </div>
    </div>

    return (
        <div className="flex flex-col p-6 bg-black text-white h-screen">
            <div className="flex space-x-4 text-sm mb-4 items-center  whitespace-nowrap overflow-hidden overflow-ellipsis">
                <button
                    className="bg-gray-800 rounded-lg p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all"
                    onClick={() => navigate("/")}
                >
                    {`${"<"}`}
                </button>

                <h2 className="text-center">
                    {project.name || "Not Found"}

                </h2>
            </div>

            <div className="flex items-center justify-center max-w-lg m-auto">
                {project.steps.length > 0
                    ? <Preview code={project.steps[page - 1]?.code} />
                    : <p
                        className="text-center text-slate-500 text-sm whitespace-wrap overflow-hidden overflow-ellipsis w-8/12 transition-all cursor-pointer hover:text-slate-400"
                    >// TODO: Write component.</p>
                }
            </div>

            <div className="flex items-center mb-4 text-sm">
                <button
                    className={`bg-gray-800 rounded-l-lg p-1 px-4 hover:text-gray-100 disabled:bg-gray-900 disabled:text-gray-500 transition-all text-gray-300 hover:bg-gray-700`}
                    onClick={() => {
                        navigator.clipboard.writeText(project.steps[page - 1]?.code || "");

                        setIsCopied(true);
                    }}
                    onMouseLeave={() => {
                        if (!isCopied) return;

                        setTimeout(() => setIsCopied(false), 1500);
                    }}
                >
                    Export
                </button>

                <select className="bg-gray-900 p-1 px-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 
                    disabled:text-gray-500 transition-all">
                    {project.steps.map((_, i) => <option key={i} value={i + 1}>#{i + 1}</option>)}
                </select>

                {project.steps.length > 1 && <>
                    <p className="text-gray-700 bg-gray-900 p-1 pl-4">-</p>

                    <select className="bg-gray-900 p-1 px-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 
                    disabled:text-gray-500 transition-all">
                        {project.steps
                            .slice(-1)
                            .map((_, i) => <option key={count + i} value={count - i}>#{count - i}</option>)}
                    </select>
                </>}

                <select className="bg-gray-900 rounded-r-lg p-1 px-4 text-gray-400 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all">
                    <option value="this">.png</option>
                    <option value="all">.mp4</option>
                </select>

                <div className="flex items-center w-min ml-auto">
                    <div className="flex relative">
                        <div className={`flex-col space-y-2 absolute right-0 h-full bg-gray-900 rounded-lg transition-all ${isSettingsCollapsed ? "hidden" : "flex"}`} style={{ height: "-200%" }}>
                            <div className="flex">
                                <label className="p-1 px-2 bg-gray-800 text-gray-400 rounded-l-lg">Width</label>
                                <input
                                    className="bg-gray-900 p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all w-full"
                                    type="number"
                                    value={width}
                                    onChange={e => setWidth(e.target.value)}
                                />
                                <p className="p-1 px-2 bg-gray-900 text-gray-400 rounded-r-lg">px</p>
                            </div>

                            <div className="flex w-full">
                                <label className="p-1 px-2 bg-gray-800 text-gray-400 rounded-l-lg">Height</label>
                                <input
                                    className="bg-gray-900 p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all w-full"
                                    type="number"
                                    value={height}
                                    onChange={e => setHeight(e.target.value)}
                                />
                                <p className="p-1 px-2 bg-gray-900 text-gray-400 rounded-r-lg">px</p>
                            </div>

                            <div className="flex">
                                <label className="p-1 px-2 bg-gray-800 text-gray-400 rounded-l-lg">Duration</label>
                                <input
                                    className="bg-gray-900 p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all w-20"
                                    type="number"
                                    value={30}
                                    onChange={e => setHeight(e.target.value)}
                                />
                                <p className="p-1 px-2 bg-gray-900 text-gray-400 rounded-r-lg">secs.</p>
                            </div>

                            {/* <div className="flex">
                                <input
                                    className="bg-gray-800 p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all w-max"
                                    type="number"
                                    value={height}
                                    onChange={e => setHeight(e.target.value)}
                                />
                                <p className="p-1 px-2 bg-gray-800 text-gray-400 rounder-r-lg">px</p>
                            </div> */}
                        </div>

                        <button
                            className={`ml-4 bg-gray-800 rounded-lg p-1 px-4 hover:text-gray-100 disabled:bg-gray-900 disabled:text-gray-500 transition-all text-gray-300 hover:bg-gray-700 text-md`}
                            onClick={() => { setIsSettingsCollapsed(!isSettingsCollapsed) }}
                        >
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center w-full">
                <div className="flex space-x-4 text-sm">
                    <button
                        className="bg-gray-800 rounded-lg p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all"
                        onClick={() => move(-1)}
                        disabled={page === 1}
                    >
                        {`${"<"}`}
                    </button>
                    <p className="p-1 px-2 text-gray-400">{page} / {project.steps.length}</p>
                    <button
                        className="bg-gray-800 rounded-lg p-1 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 transition-all"
                        onClick={() => move(1)}
                        disabled={page > project.steps.length - 1}
                    >
                        {`${">"}`}
                    </button>
                </div>

                {/* <p className="text-sm text-gray-400 ml-6">
                    (00:{project.steps.reduce((acc, step) => acc + (step.duration || 0), 0)})</p> */}
                <div className="ml-auto text-sm">
                    <button
                        className={`ml-4 bg-gray-800 rounded-lg p-1 px-2 hover:text-gray-100 disabled:bg-gray-900 disabled:text-gray-500 transition-all ${isCopied ? "text-gray-100 bg-green-500" : "text-gray-300 hover:bg-gray-700"}`}
                        onClick={() => {
                            navigator.clipboard.writeText(project.steps[page - 1]?.code || "");

                            setIsCopied(true);
                        }}
                        onMouseLeave={() => {
                            if (!isCopied) return;

                            setTimeout(() => setIsCopied(false), 1500);
                        }}
                    >
                        {`${"</>"}`}
                    </button>

                    <button
                        className={`ml-4 bg-gray-800 rounded-lg p-1 px-4 hover:text-gray-100 disabled:bg-gray-900 disabled:text-gray-500 transition-all text-gray-300 hover:bg-gray-700 text-md`}
                    >
                        ?
                    </button>
                </div>
            </div>

        </div >
    );
}