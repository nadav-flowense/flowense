import type { Meta, StoryObj } from "@storybook/react";

import { AuthForm } from "./AuthForm";
import type { AuthFormProvider } from "./AuthForm.types";

const meta: Meta<typeof AuthForm> = {
	title: "Organisms/AuthForm",
	component: AuthForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		onProviderSelect: { action: "provider selected" },
		onEmailSubmit: { action: "email submitted" },
		onForgotPasswordClick: { action: "forgot password clicked" },
		onWaitlistClick: { action: "waitlist clicked" },
		onContactClick: { action: "contact clicked" },
	},
};

export default meta;
type Story = StoryObj<typeof AuthForm>;

const defaultProviders: AuthFormProvider[] = [
	{ id: "google", name: "Google", icon: "google" },
	{ id: "github", name: "GitHub", icon: "github" },
];

export const Default: Story = {
	args: {
		providers: defaultProviders,
		showEmailAuth: true,
		showForgotPassword: true,
		showWaitlistLink: true,
	},
};

export const GoogleOnly: Story = {
	args: {
		providers: [{ id: "google", name: "Google", icon: "google" }] satisfies AuthFormProvider[],
		showEmailAuth: true,
	},
};

export const MultipleProviders: Story = {
	args: {
		providers: [
			{ id: "google", name: "Google", icon: "google" },
			{ id: "github", name: "GitHub", icon: "github" },
			{ id: "gitlab", name: "GitLab", icon: "gitlab" },
			{ id: "microsoft", name: "Microsoft", icon: "microsoft" },
		] satisfies AuthFormProvider[],
		showEmailAuth: true,
	},
};

export const ProvidersOnly: Story = {
	args: {
		providers: defaultProviders,
		showEmailAuth: false,
		showForgotPassword: false,
		title: "Sign in",
		subtitle: "Choose your preferred sign-in method",
	},
};

export const EmailOnly: Story = {
	args: {
		providers: [],
		showEmailAuth: true,
		showForgotPassword: true,
	},
};

export const Loading: Story = {
	args: {
		providers: defaultProviders,
		showEmailAuth: true,
		isLoading: true,
	},
};

export const WithError: Story = {
	args: {
		providers: defaultProviders,
		showEmailAuth: true,
		error: {
			type: "invalid_credentials",
			message: "Invalid email or password. Please try again.",
		},
	},
};

export const UserNotFoundError: Story = {
	args: {
		providers: defaultProviders,
		showEmailAuth: true,
		error: {
			type: "user_not_found",
			message: "User not found",
		},
	},
};

export const CustomTitle: Story = {
	args: {
		providers: defaultProviders,
		showEmailAuth: true,
		title: "Welcome Back",
		subtitle: "Sign in to continue to your dashboard",
	},
};

export const Minimal: Story = {
	args: {
		providers: [{ id: "google", name: "Google", icon: "google" }] satisfies AuthFormProvider[],
		showEmailAuth: false,
		showForgotPassword: false,
		showWaitlistLink: false,
		showContactLink: false,
		title: "Sign In",
	},
};
