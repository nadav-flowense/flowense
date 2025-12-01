import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./LoginForm";

const meta = {
	title: "Organisms/LoginForm",
	component: LoginForm,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Complete login form with Google OAuth option and password-based authentication. Supports invite-only access model with waitlist and contact options.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		onSubmit: {
			description: "Callback function called when the form is submitted",
		},
		onGoogleLogin: {
			description: "Callback function called when Google login is clicked",
		},
		onForgotPasswordClick: {
			description:
				"Callback function called when forgot password link is clicked",
		},
		onWaitlistClick: {
			description: "Callback function called when waitlist link is clicked",
		},
		onContactClick: {
			description: "Callback function called when contact link is clicked",
		},
		isLoading: {
			control: "boolean",
			description: "Shows loading state on submit button",
		},
		error: {
			description: "Error object to display error messages",
		},
	},
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onSubmit: (data) => {
			console.log("Form submitted:", data);
			alert(`Login submitted!\nEmail: ${data.email}`);
		},
		onGoogleLogin: () => {
			console.log("Google login clicked");
			alert("Google login clicked");
		},
		onForgotPasswordClick: () => {
			console.log("Forgot password clicked");
			alert("Navigate to forgot password page");
		},
		onWaitlistClick: () => {
			console.log("Waitlist clicked");
			alert("Navigate to waitlist page");
		},
		onContactClick: () => {
			console.log("Contact clicked");
			alert("Navigate to contact page");
		},
	},
};

export const Loading: Story = {
	args: {
		...Default.args,
		isLoading: true,
	},
};

export const WithUserNotFoundError: Story = {
	args: {
		...Default.args,
		error: {
			type: "user_not_found",
			message: "This email isn't registered to Flowense",
		},
	},
};

export const WithInvalidCredentialsError: Story = {
	args: {
		...Default.args,
		error: {
			type: "invalid_credentials",
			message: "Invalid email or password",
		},
	},
};

export const WithGenericError: Story = {
	args: {
		...Default.args,
		error: {
			type: "generic",
			message: "An unexpected error occurred. Please try again.",
		},
	},
};

export const WithBackground: Story = {
	args: Default.args,
	decorators: [
		(Story) => (
			<div className="bg-gray-100 p-8 min-h-screen flex items-center justify-center">
				<Story />
			</div>
		),
	],
};
