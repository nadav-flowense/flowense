/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

export interface LoginPageProps {
	/** The main auth component (e.g., Descope flow) */
	children: ReactNode;
	/** Optional className for the container */
	className?: string;
}

/**
 * Reusable login page layout component
 * Can be used across dashboard-web, backoffice, and other apps
 */
export function LoginPage({ children, className = "" }: LoginPageProps) {
	return (
		<div
			className={`w-full h-screen flex justify-center items-center bg-gray-50 ${className}`}
		>
			<div className="w-full max-w-md">{children}</div>
		</div>
	);
}
