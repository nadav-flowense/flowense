import { Archive, MoreVertical, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { cn } from "../../../lib/utils";
import { Heading } from "../../atoms/Heading";
import { Info } from "../../atoms/Info";
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	DropdownTrigger,
} from "../../molecules/Dropdown";

export interface FlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The title/name of the flow */
	title: string;
	/** Description of the flow */
	description?: string;
	/** When the flow was last edited */
	lastEdited: string;
	/** Optional click handler for the card body */
	onClick?: () => void;
	/** Whether the card is in a loading state */
	loading?: boolean;
	/** Callback when Edit is clicked */
	onEdit?: () => void;
	/** Callback when Delete is clicked */
	onDelete?: () => void;
	/** Callback when Archive is clicked */
	onArchive?: () => void;
	/** Whether delete action is pending */
	deletePending?: boolean;
}

export const FlowCard = React.forwardRef<HTMLDivElement, FlowCardProps>(
	(
		{
			title,
			description,
			lastEdited,
			onClick,
			loading = false,
			onEdit,
			onDelete,
			onArchive,
			deletePending = false,
			className,
			...props
		},
		ref,
	) => {
		const hasActions = onEdit || onDelete || onArchive;

		return (
			<div
				ref={ref}
				className={cn(
					"group relative bg-white rounded-lg border border-gray-200",
					"hover:border-blue-300 hover:shadow-md transition-all duration-200",
					onClick && "cursor-pointer",
					(loading || deletePending) && "opacity-60 pointer-events-none",
					className,
				)}
				{...props}
			>
				<div className="p-6">
					{/* Header with title and actions */}
					<div className="flex items-start justify-between gap-2 mb-2">
						{/** biome-ignore lint/a11y/noStaticElementInteractions: This is an html issue, not js. we need this for this specific use case. */}
						<div
							className="flex-1 min-w-0"
							onClick={onClick}
							onKeyDown={(e) => {
								if (onClick && (e.key === "Enter" || e.key === " ")) {
									e.preventDefault();
									onClick();
								}
							}}
							role={onClick ? "button" : undefined}
							tabIndex={onClick ? 0 : undefined}
						>
							<Heading>{title}</Heading>
						</div>

						{hasActions && (
							<Dropdown>
								<DropdownTrigger
									className="shrink-0 -mr-2 -mt-2"
									onClick={(e) => e.stopPropagation()}
									aria-label={`Actions for ${title}`}
								>
									{deletePending ? (
										<span className="loading loading-spinner loading-sm text-error" />
									) : (
										<MoreVertical className="h-4 w-4" />
									)}
								</DropdownTrigger>
								<DropdownContent align="end">
									{onEdit && (
										<DropdownItem onClick={onEdit}>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</DropdownItem>
									)}
									{onArchive && (
										<DropdownItem onClick={onArchive}>
											<Archive className="h-4 w-4 mr-2" />
											Archive
										</DropdownItem>
									)}
									{(onEdit || onArchive) && onDelete && <DropdownSeparator />}
									{onDelete && (
										<DropdownItem destructive onClick={onDelete}>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</DropdownItem>
									)}
								</DropdownContent>
							</Dropdown>
						)}
					</div>

					{/* Last edited */}
					<Info color="muted" className="mb-3">
						{lastEdited}
					</Info>

					{/* Description */}
					{description && <Info className="line-clamp-2">{description}</Info>}
				</div>
			</div>
		);
	},
);

FlowCard.displayName = "FlowCard";
