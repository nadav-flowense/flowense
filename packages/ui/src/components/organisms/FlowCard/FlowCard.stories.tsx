import type { Meta, StoryObj } from "@storybook/react";
import { FlowCard } from "./FlowCard";

const meta: Meta<typeof FlowCard> = {
	component: FlowCard,
	title: "Components/FlowCard",
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		backgrounds: {
			default: "light",
		},
	},
	decorators: [
		(Story) => (
			<div style={{ padding: "3rem" }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		onClick: { action: "clicked" },
	},
};

export default meta;
type Story = StoryObj<typeof FlowCard>;

export const Default: Story = {
	args: {
		title: "My Amazing Form",
		description:
			"Some quick info about this project. If you want to have a clear understanding..",
		lastEdited: "1 day ago",
	},
};

export const WithoutDescription: Story = {
	args: {
		title: "Contact Form",
		lastEdited: "3 hours ago",
	},
};

export const LongDescription: Story = {
	args: {
		title: "Customer Feedback Survey",
		description:
			"This is a comprehensive customer feedback survey that collects detailed information about user experience, product satisfaction, and suggestions for improvement. The form includes multiple sections covering various aspects of the customer journey.",
		lastEdited: "2 days ago",
	},
};

export const Loading: Story = {
	args: {
		title: "Loading Form",
		description: "This form is currently loading...",
		lastEdited: "Just now",
		loading: true,
	},
};

export const Grid: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
			<FlowCard
				title="My Amazing Form"
				description="Some quick info about this project. If you want to have a clear understanding.."
				lastEdited="1 day ago"
			/>
			<FlowCard
				title="Contact Form"
				description="Get in touch with our team. Fill out this simple form and we'll get back to you."
				lastEdited="3 hours ago"
			/>
			<FlowCard
				title="Newsletter Signup"
				description="Subscribe to our newsletter for weekly updates and exclusive offers."
				lastEdited="5 days ago"
			/>
			<FlowCard
				title="Product Feedback"
				description="Help us improve our products by sharing your valuable feedback and suggestions."
				lastEdited="1 week ago"
			/>
			<FlowCard title="Event Registration" lastEdited="2 weeks ago" />
		</div>
	),
};
