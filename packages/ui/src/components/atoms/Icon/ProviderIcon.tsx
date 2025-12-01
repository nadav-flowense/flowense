import type { ComponentProps, ReactElement } from "react";

import { AppleIcon } from "./AppleIcon";
import { GitHubIcon } from "./GitHubIcon";
import { GitLabIcon } from "./GitLabIcon";
import { GoogleIcon } from "./GoogleIcon";
import { MicrosoftIcon } from "./MicrosoftIcon";

export type AuthProviderIconId =
	| "google"
	| "github"
	| "gitlab"
	| "microsoft"
	| "apple";

export interface ProviderIconProps
	extends Omit<ComponentProps<"svg">, "children"> {
	/** The provider identifier */
	provider: AuthProviderIconId;
	/** Icon size in pixels */
	size?: number;
}

/**
 * Renders the appropriate icon for an auth provider
 */
export function ProviderIcon({
	provider,
	size = 24,
	className,
}: ProviderIconProps): ReactElement | null {
	switch (provider) {
		case "google":
			return <GoogleIcon size={size} className={className} />;
		case "github":
			return <GitHubIcon size={size} className={className} />;
		case "gitlab":
			return <GitLabIcon size={size} className={className} />;
		case "microsoft":
			return <MicrosoftIcon size={size} className={className} />;
		case "apple":
			return <AppleIcon size={size} className={className} />;
		default:
			console.warn(`Unknown provider icon: ${provider}`);
			return null;
	}
}

ProviderIcon.displayName = "ProviderIcon";
