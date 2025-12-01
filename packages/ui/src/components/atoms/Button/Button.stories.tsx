import type { Meta, StoryObj } from "@storybook/react";
import { Download, Heart, Mail, Trash2 } from "lucide-react";
import { GoogleIcon } from "../Icon/GoogleIcon";
import { Button } from "./Button";

const meta = {
	title: "Atoms/Button",
	component: Button,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Primary action button with multiple variants and states. Follows React 19 patterns (no forwardRef).",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"primary",
				"secondary",
				"outline",
				"ghost",
				"destructive",
				"social",
				"dark",
				"success",
				"link",
			],
			description: "The visual style variant of the button",
		},
		size: {
			control: "select",
			options: ["xs", "sm", "md", "lg", "xl", "social", "icon"],
			description: "The size of the button",
		},
		loading: {
			control: "boolean",
			description: "Shows a loading spinner",
		},
		disabled: {
			control: "boolean",
			description: "Disables the button",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Button",
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Delete</Button>
			<Button variant="success">Success</Button>
			<Button variant="dark">Dark</Button>
			<Button variant="link">Link</Button>
			<Button variant="social">Continue with Google</Button>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Button size="xs">Extra Small</Button>
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
			<Button size="xl">Extra Large</Button>
		</div>
	),
};

export const WithIcon: Story = {
	args: {
		children: "Send Email",
		icon: Mail,
	},
};

export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Button icon={Download}>Download</Button>
			<Button variant="secondary" icon={Heart}>
				Like
			</Button>
			<Button variant="destructive" icon={Trash2}>
				Delete
			</Button>
		</div>
	),
};

export const IconOnly: Story = {
	args: {
		children: <Heart className="h-5 w-5" />,
		variant: "outline",
		size: "icon",
		"aria-label": "Like",
	},
};

export const Loading: Story = {
	args: {
		loading: true,
		children: "Submit",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: "Disabled",
	},
};

export const GoogleSignIn: Story = {
	render: () => (
		<Button variant="social" size="social" icon={<GoogleIcon />}>
			Sign up with Google
		</Button>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Google social login button with the official Google icon. Uses the social variant and social size for proper spacing.",
			},
		},
	},
};

export const SmallDarkButton: Story = {
	render: () => (
		<Button variant="dark" size="sm">
			Sign Up
		</Button>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Small dark button with 15px semi-bold text. Perfect for compact CTAs.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		children: "Playground Button",
		variant: "primary",
		size: "md",
	},
};
