import { useEffect, useState } from "react";

export const useClipboard: () => {
	clipboard: (
		key: string,
		value?: string
	) => {
		onCopy: () => void;
		onLeave: () => void;
	};
	copied: { [key: string]: boolean };
} = () => {
	const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

	const clipboard: (
		key: string,
		value?: string
	) => {
		onCopy: () => void;
		onLeave: () => void;
	} = (key, value) => {
		const onCopy = () => {
			if (!value) return;

			setCopied((prev) => ({ ...prev, [key]: true }));

			navigator.clipboard.writeText(value);
		};

		const onLeave = () => {
			if (!copied[key]) return;

			setTimeout(() => {
				setCopied((prev) => ({ ...prev, [key]: false }));
			}, 1500);
		};

		return { onCopy, onLeave };
	};

	useEffect(() => {
		return () => {
			setCopied({});
		};
	}, []);

	return { clipboard, copied };
};
