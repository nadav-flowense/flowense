import type { ComponentProps, JSX } from "react";

import { cn } from "../../../lib/utils";

export interface MicrosoftIconProps extends ComponentProps<"svg"> {
	size?: number;
}

export function MicrosoftIcon({
	className,
	size = 24,
	...props
}: MicrosoftIconProps): JSX.Element {
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
			<path d="M0 0h11.377v11.377H0V0z" fill="#F25022" />
			<path d="M12.623 0H24v11.377H12.623V0z" fill="#7FBA00" />
			<path d="M0 12.623h11.377V24H0V12.623z" fill="#00A4EF" />
			<path d="M12.623 12.623H24V24H12.623V12.623z" fill="#FFB900" />
		</svg>
	);
}

MicrosoftIcon.displayName = "MicrosoftIcon";
