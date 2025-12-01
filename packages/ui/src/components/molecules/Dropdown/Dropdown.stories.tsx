import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal } from "lucide-react";
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	DropdownTrigger,
} from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
	title: "Components/Dropdown",
	component: Dropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Basic: Story = {
	render: () => (
		<Dropdown>
			<DropdownTrigger>
				<MoreHorizontal className="size-5" />
			</DropdownTrigger>
			<DropdownContent>
				<DropdownItem>Edit</DropdownItem>
				<DropdownItem>Duplicate</DropdownItem>
				<DropdownSeparator />
				<DropdownItem destructive>Delete</DropdownItem>
			</DropdownContent>
		</Dropdown>
	),
};

export const UserActions: Story = {
	render: () => (
		<Dropdown>
			<DropdownTrigger>
				<MoreHorizontal className="size-5" />
			</DropdownTrigger>
			<DropdownContent>
				<DropdownItem>Reset Password</DropdownItem>
				<DropdownItem>Change Role</DropdownItem>
				<DropdownItem destructive>Suspend User</DropdownItem>
			</DropdownContent>
		</Dropdown>
	),
};

export const InvitedUserActions: Story = {
	render: () => (
		<Dropdown>
			<DropdownTrigger>
				<MoreHorizontal className="size-5" />
			</DropdownTrigger>
			<DropdownContent>
				<DropdownItem>Resend Invite</DropdownItem>
				<DropdownItem destructive>Delete Invite</DropdownItem>
			</DropdownContent>
		</Dropdown>
	),
};

export const SuspendedUserActions: Story = {
	render: () => (
		<Dropdown>
			<DropdownTrigger>
				<MoreHorizontal className="size-5" />
			</DropdownTrigger>
			<DropdownContent>
				<DropdownItem>Activate User</DropdownItem>
			</DropdownContent>
		</Dropdown>
	),
};

export const WithCustomTrigger: Story = {
	render: () => (
		<Dropdown>
			<DropdownTrigger className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg">
				Open Menu
			</DropdownTrigger>
			<DropdownContent>
				<DropdownItem>Profile</DropdownItem>
				<DropdownItem>Settings</DropdownItem>
				<DropdownSeparator />
				<DropdownItem>Logout</DropdownItem>
			</DropdownContent>
		</Dropdown>
	),
};

export const MultipleDropdowns: Story = {
	render: () => (
		<div className="flex gap-8">
			<Dropdown>
				<DropdownTrigger>
					<MoreHorizontal className="size-5" />
				</DropdownTrigger>
				<DropdownContent>
					<DropdownItem>Option 1</DropdownItem>
					<DropdownItem>Option 2</DropdownItem>
					<DropdownItem>Option 3</DropdownItem>
				</DropdownContent>
			</Dropdown>

			<Dropdown>
				<DropdownTrigger>
					<MoreHorizontal className="size-5" />
				</DropdownTrigger>
				<DropdownContent>
					<DropdownItem>Action A</DropdownItem>
					<DropdownItem>Action B</DropdownItem>
					<DropdownSeparator />
					<DropdownItem destructive>Delete</DropdownItem>
				</DropdownContent>
			</Dropdown>
		</div>
	),
};
