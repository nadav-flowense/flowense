import type { ComponentProps, JSX } from "react";

import { cn } from "../../../lib/utils";

export interface GitLabIconProps extends ComponentProps<"svg"> {
	size?: number;
}

export function GitLabIcon({
	className,
	size = 24,
	...props
}: GitLabIconProps): JSX.Element {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("shrink-0", className)}
			{...props}
		>
			<path
				d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 00-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 00-.867 0L1.386 9.452.044 13.587a.924.924 0 00.331 1.023L12 23.054l11.625-8.443a.92.92 0 00.33-1.024"
				fill="#FC6D26"
			/>
			<path d="M12 23.054L16.418 9.45H7.582L12 23.054z" fill="#E24329" />
			<path d="M12 23.054l-4.418-13.604H1.386L12 23.054z" fill="#FC6D26" />
			<path
				d="M1.386 9.45L.044 13.587a.924.924 0 00.331 1.023L12 23.054 1.386 9.45z"
				fill="#FCA326"
			/>
			<path
				d="M1.386 9.452h6.196L4.918 1.263a.455.455 0 00-.867 0L1.386 9.452z"
				fill="#E24329"
			/>
			<path d="M12 23.054l4.418-13.604h6.196L12 23.054z" fill="#FC6D26" />
			<path
				d="M22.614 9.45l1.342 4.137a.924.924 0 01-.331 1.023L12 23.054l10.614-13.604z"
				fill="#FCA326"
			/>
			<path
				d="M22.614 9.452h-6.196l2.664-8.189a.455.455 0 01.867 0l2.665 8.189z"
				fill="#E24329"
			/>
		</svg>
	);
}

GitLabIcon.displayName = "GitLabIcon";
