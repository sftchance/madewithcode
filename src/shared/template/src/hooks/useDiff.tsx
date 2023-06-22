import { Change, diffChars } from "diff";

import { Project } from "../types";

const DEFAULT_COMPONENT = `(props) => {
    return (<>

    </>);
}`;
const DEFAULT_DURATION = 1.2;

export const useDiff: (props: { project?: Project }) => {
	changes?: Change[][];
	animations?: string[];
} = ({ project }) => {
	if (project === undefined) return {};

	const tail = "`";

	const prepend = (part: Change) => {
		return `${
			part.removed ? "${remove(`" : part.added ? "${insert(`" : ""
		}`;
	};

	const append = (part: Change) => {
		return `${part.removed ? "`)}" : part.added ? "`)}" : ""}`;
	};

	const diff = (step: number) => {
		const original =
			step > 0 ? project.steps[step - 1].code : DEFAULT_COMPONENT;
		const modified = project.steps[step].code;

		return diffChars(original, modified);
	};

	const patch = (step: number, changes: Change[]) => {
		const duration = project.steps[step].duration || DEFAULT_DURATION;

		const base = `yield * codeRef().edit(${duration})\``;

		const content = changes
			.map((part) => {
				return `${prepend(part)}${part.value}${append(part)}`;
			})
			.join("");

		return [base, content, tail].join("");
	};

	const changes = project.steps.map((_, index) => {
		return diff(index);
	});

	const animations = changes.map((change, index) => {
		return patch(index, change);
	});

	return { changes, animations };
};
