import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./Dialog";

const meta: Meta<typeof Dialog> = {
	title: "Components/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Basic: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Dialog</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Dialog Title</DialogTitle>
							<DialogDescription>
								This is a basic dialog example with a title and description.
							</DialogDescription>
						</DialogHeader>
						<DialogBody>
							<p className="text-sm">
								This is the dialog content. You can put any content here
								including forms, text, or other components.
							</p>
						</DialogBody>
						<DialogFooter>
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button onClick={() => setOpen(false)}>Confirm</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	},
};

export const WithForm: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<Button onClick={() => setOpen(true)}>Create Account</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Account</DialogTitle>
							<DialogDescription>
								Enter your details to create a new account.
							</DialogDescription>
						</DialogHeader>
						<DialogBody>
							<div className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="name" className="text-sm font-medium">
										Name
									</label>
									<Input id="name" placeholder="John Doe" />
								</div>
								<div className="space-y-2">
									<label htmlFor="email" className="text-sm font-medium">
										Email
									</label>
									<Input
										id="email"
										type="email"
										placeholder="john@example.com"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="password" className="text-sm font-medium">
										Password
									</label>
									<Input id="password" type="password" placeholder="••••••••" />
								</div>
							</div>
						</DialogBody>
						<DialogFooter>
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button onClick={() => setOpen(false)}>Create Account</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	},
};

export const Destructive: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<Button variant="destructive" onClick={() => setOpen(true)}>
					Delete Account
				</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={() => setOpen(false)}>
								Delete Account
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	},
};

export const Controlled: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<div className="space-y-4">
				<div className="flex gap-2">
					<Button onClick={() => setOpen(true)}>Open Dialog</Button>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Close Dialog
					</Button>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Controlled Dialog</DialogTitle>
							<DialogDescription>
								This dialog is controlled by external state.
							</DialogDescription>
						</DialogHeader>
						<DialogBody>
							<p className="text-sm">
								The dialog open state is managed by the parent component. You
								can open or close it using the buttons outside.
							</p>
						</DialogBody>
						<DialogFooter>
							<Button onClick={() => setOpen(false)}>Close</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		);
	},
};
