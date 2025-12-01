import type { ComponentProps } from "react";

/**
 * Supported auth provider IDs
 * Must match Better Auth social provider IDs
 */
export type AuthProviderIdType =
	| "google"
	| "github"
	| "gitlab"
	| "microsoft"
	| "apple";

/**
 * Auth provider display information for the AuthForm component
 */
export interface AuthFormProvider {
	/** Unique identifier matching Better Auth provider ID */
	id: AuthProviderIdType;
	/** Display name shown on the button */
	name: string;
	/** Optional icon identifier (matches AuthProviderIdType for icon rendering) */
	icon?: AuthProviderIdType;
	/** Optional brand color for styling */
	brandColor?: string;
}

/**
 * Error returned from authentication attempt
 */
export interface AuthFormError {
	type: "user_not_found" | "invalid_credentials" | "provider_error" | "generic";
	message: string;
}

/**
 * Email/password form data
 */
export interface AuthFormEmailData {
	email: string;
	password: string;
}

/**
 * Props for the AuthForm component
 */
export interface AuthFormProps extends Omit<ComponentProps<"div">, "onSubmit"> {
	/** List of OAuth providers to display */
	providers: AuthFormProvider[];
	/** Callback when user selects an OAuth provider */
	onProviderSelect: (provider: AuthFormProvider) => void;
	/** Show email/password authentication form */
	showEmailAuth?: boolean;
	/** Callback for email/password submission */
	onEmailSubmit?: (data: AuthFormEmailData) => void;
	/** Show forgot password link */
	showForgotPassword?: boolean;
	/** Callback when forgot password is clicked */
	onForgotPasswordClick?: () => void;
	/** Show waitlist/signup link */
	showWaitlistLink?: boolean;
	/** Callback when waitlist link is clicked */
	onWaitlistClick?: () => void;
	/** Show contact support link */
	showContactLink?: boolean;
	/** Callback when contact link is clicked */
	onContactClick?: () => void;
	/** Loading state - disables all interactions */
	isLoading?: boolean;
	/** Error to display */
	error?: AuthFormError | null;
	/** Custom title */
	title?: string;
	/** Custom subtitle */
	subtitle?: string;
}
