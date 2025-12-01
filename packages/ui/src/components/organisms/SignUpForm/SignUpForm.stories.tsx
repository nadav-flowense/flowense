import type { Meta, StoryObj } from "@storybook/react";
import { SignUpForm } from "./SignUpForm";

const meta = {
	title: "Organisms/SignUpForm",
	component: SignUpForm,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Complete sign-up form with Google OAuth option and password-based registration. Matches Figma design specifications.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		onSubmit: {
			description: "Callback function called when the form is submitted",
		},
		onGoogleSignUp: {
			description: "Callback function called when Google sign-up is clicked",
		},
		onLoginClick: {
			description: "Callback function called when the login link is clicked",
		},
		isLoading: {
			control: "boolean",
			description: "Shows loading state on submit button",
		},
	},
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onSubmit: (data) => {
			console.log("Form submitted:", data);
			alert(
				`Sign up submitted!\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}`,
			);
		},
		onGoogleSignUp: () => {
			console.log("Google sign-up clicked");
			alert("Google sign-up clicked");
		},
		onLoginClick: () => {
			console.log("Login link clicked");
			alert("Navigate to login page");
		},
	},
};

export const Loading: Story = {
	args: {
		...Default.args,
		isLoading: true,
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
