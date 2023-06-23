import { useCallback, useEffect, useMemo, useState } from "react";

import { Project } from "../types";

const PAGE_LENGTH = 10;

const PROJECTS: Project[] = [
	{
		name: "⚪ Halftone Images with Web Shaders",
		description:
			"Turn any image into its halftone visualization using simple WebGL shaders with scroll-animation using Framer.",
		steps: [
			{
				duration: 1.2,
				code: `(props) => {
    return (<>
        <h1>Hello world</h1>
    </>);
}`,
			},
			{
				duration: 1.2,
				code: `(props) => {
    return (<>
        <h1>Goodnight</h1>
    </>);
}`,
			},
		],
	},
	{
		name: "Solidity: For Loops",
		description:
			"This is the second project and we use it to lay out the foundation of ⚪ madewithcode.",
		steps: [],
	},
];

const useProject = (id: string | undefined) => {
	const project = useMemo(() => {
		if (!id && PROJECTS.length === 0) return;

		if (!id && PROJECTS.length === 1) return PROJECTS[0];

		return PROJECTS.find((project) => project.name === id);
	}, [id]);

	return project;
};

const useProjects: (props: { id?: string; pageLength?: number }) => {
	projects: Project[];
	project?: Project;
	count: number;
	page: number;
	hasPrev: boolean;
	hasNext: boolean;
	move: (size: number) => void;
} = ({ id, pageLength = PAGE_LENGTH }) => {
	const project = useProject(id);

	const [page, setPage] = useState(1);

	const projects = useMemo(() => {
		return PROJECTS.slice((page - 1) * pageLength, page * pageLength);
	}, [id, page]);

	const count = project ? project.steps.length : PROJECTS.length;

	const hasPrev = page > 1;

	const hasNext = project
		? page < project.steps.length
		: page < Math.ceil(count / pageLength);

	const onMove = useCallback(
		(size: number) => {
			setPage(size);
		},
		[page]
	);

	useEffect(() => {
		setPage(1);
	}, [id]);

	return {
		projects,
		project,
		count,
		page,
		hasPrev,
		hasNext,
		move: (size: number = 1) => onMove(page + size),
	};
};

export { useProject, useProjects };
