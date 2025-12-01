import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../atoms/Avatar";
import { Badge } from "../../atoms/Badge";
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
} from "../../molecules/Dropdown";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./Table";

const meta: Meta<typeof Table> = {
	title: "Components/Table",
	component: Table,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleUsers = [
	{
		id: 1,
		name: "Musharof Chowdhury",
		email: "musharof@example.com",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
		lastSeen: "Aug 12, 2025, 7am",
		role: "Admin",
		status: "active" as const,
	},
	{
		id: 2,
		name: "Jane Cooper",
		email: "jane@example.com",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
		lastSeen: "Aug 12, 2025, 7am",
		role: "Owner",
		status: "active" as const,
	},
	{
		id: 3,
		name: "John Smith",
		email: "john@example.com",
		initials: "JS",
		lastSeen: "Aug 12, 2025, 7am",
		role: "Analyst",
		status: "invited" as const,
	},
	{
		id: 4,
		name: "Sarah Wilson",
		email: "sarah@example.com",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
		lastSeen: "Aug 12, 2025, 7am",
		role: "Admin",
		status: "suspended" as const,
	},
];

export const Basic: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>John Doe</TableCell>
					<TableCell>john@example.com</TableCell>
					<TableCell>Admin</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Jane Smith</TableCell>
					<TableCell>jane@example.com</TableCell>
					<TableCell>User</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Bob Johnson</TableCell>
					<TableCell>bob@example.com</TableCell>
					<TableCell>Moderator</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};

export const UsersTable: Story = {
	render: () => (
		<div className="w-[1053px]">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>User</TableHead>
						<TableHead>Last Seen</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="w-12"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sampleUsers.map((user) => (
						<TableRow key={user.id}>
							<TableCell>
								<div className="flex items-center gap-[18px]">
									<Avatar>
										{user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
										<AvatarFallback>{user.initials ?? user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="font-medium text-sm text-foreground">
											{user.name}
										</span>
										<span className="text-sm text-muted-foreground">
											{user.email}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{user.lastSeen}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{user.role}
							</TableCell>
							<TableCell>
								<Badge variant={user.status}>
									{user.status.charAt(0).toUpperCase() + user.status.slice(1)}
								</Badge>
							</TableCell>
							<TableCell>
								<Dropdown>
									<DropdownTrigger>
										<MoreHorizontal className="size-6" />
									</DropdownTrigger>
									<DropdownContent>
										{user.status === "active" && (
											<>
												<DropdownItem>Reset Password</DropdownItem>
												<DropdownItem>Change Role</DropdownItem>
												<DropdownItem destructive>Suspend User</DropdownItem>
											</>
										)}
										{user.status === "invited" && (
											<>
												<DropdownItem>Resend Invite</DropdownItem>
												<DropdownItem destructive>Delete Invite</DropdownItem>
											</>
										)}
										{user.status === "suspended" && (
											<DropdownItem>Activate User</DropdownItem>
										)}
									</DropdownContent>
								</Dropdown>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	),
};

export const WithManyRows: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Date</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: 10 }, (_, i) => (
					<TableRow key={i}>
						<TableCell className="font-mono">
							{String(i + 1).padStart(3, "0")}
						</TableCell>
						<TableCell>Item {i + 1}</TableCell>
						<TableCell>
							<Badge
								variant={
									i % 3 === 0 ? "active" : i % 3 === 1 ? "invited" : "suspended"
								}
							>
								{i % 3 === 0 ? "Active" : i % 3 === 1 ? "Invited" : "Suspended"}
							</Badge>
						</TableCell>
						<TableCell className="text-muted-foreground">
							Aug {(i % 30) + 1}, 2025
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

export const Empty: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>User</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell colSpan={3} className="text-center text-muted-foreground">
						No data available
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};
