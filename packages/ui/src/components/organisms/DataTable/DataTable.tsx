import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { Text } from "../../atoms/Text";
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	DropdownTrigger,
} from "../../molecules/Dropdown";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../Table";

// =============================================================================
// Types
// =============================================================================

export interface Column<T> {
	/** Unique identifier for the column */
	id: string;
	/** Header content (string or React node) */
	header: ReactNode;
	/** Cell renderer function */
	cell: (row: T, index: number) => ReactNode;
	/** Optional className for both header and cells */
	className?: string;
	/** Optional header-specific className */
	headerClassName?: string;
	/** Optional cell-specific className */
	cellClassName?: string;
}

export interface RowAction<T> {
	/** Action label (can include icons) */
	label: ReactNode;
	/** Click handler */
	onClick: (row: T) => void;
	/** Whether this is a destructive action (red text) */
	destructive?: boolean;
	/** Disable the action */
	disabled?: boolean | ((row: T) => boolean);
	/** Hide the action entirely */
	hidden?: boolean | ((row: T) => boolean);
}

export interface RowActionSeparator {
	type: "separator";
}

export type RowActionItem<T> = RowAction<T> | RowActionSeparator;

export interface DataTableProps<T> {
	/** Array of data items to display */
	data: T[];
	/** Column definitions */
	columns: Column<T>[];
	/** Function to extract unique key from each row */
	rowKey: (row: T) => string;
	/** Row actions (dropdown menu items) */
	actions?: (row: T) => RowActionItem<T>[];
	/** Click handler for the entire row */
	onRowClick?: (row: T) => void;
	/** Message to display when data is empty */
	emptyMessage?: ReactNode;
	/** Additional className for the table */
	className?: string;
}

// =============================================================================
// Helper to check if action is a separator
// =============================================================================

function isSeparator<T>(
	action: RowActionItem<T>,
): action is RowActionSeparator {
	return "type" in action && action.type === "separator";
}

// =============================================================================
// DataTable Component
// =============================================================================

export function DataTable<T>({
	data,
	columns,
	rowKey,
	actions,
	onRowClick,
	emptyMessage = "No data available",
	className,
}: DataTableProps<T>): ReactNode {
	const hasActions = actions !== undefined;

	return (
		<Table className={className}>
			<TableHeader>
				<TableRow>
					{columns.map((column) => (
						<TableHead
							key={column.id}
							className={column.headerClassName ?? column.className}
						>
							{column.header}
						</TableHead>
					))}
					{hasActions && <TableHead className="w-12" />}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={columns.length + (hasActions ? 1 : 0)}
							className="text-center py-12"
						>
							<Text className="text-gray-500">{emptyMessage}</Text>
						</TableCell>
					</TableRow>
				) : (
					data.map((row, index) => {
						const key = rowKey(row);
						const rowActions = actions?.(row) ?? [];
						const visibleActions = rowActions.filter((action) => {
							if (isSeparator(action)) return true;
							const hidden =
								typeof action.hidden === "function"
									? action.hidden(row)
									: action.hidden;
							return !hidden;
						});

						return (
							<TableRow
								key={key}
								className={onRowClick ? "cursor-pointer" : undefined}
								onClick={onRowClick ? () => onRowClick(row) : undefined}
							>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										className={column.cellClassName ?? column.className}
									>
										{column.cell(row, index)}
									</TableCell>
								))}
								{hasActions && (
									<TableCell onClick={(e) => e.stopPropagation()}>
										{visibleActions.length > 0 && (
											<Dropdown>
												<DropdownTrigger className="p-2 hover:bg-gray-100 rounded-md">
													<MoreHorizontal className="w-5 h-5 text-gray-500" />
												</DropdownTrigger>
												<DropdownContent align="end">
													{visibleActions.map((action, actionIndex) => {
														if (isSeparator(action)) {
															return (
																<DropdownSeparator
																	key={`separator-${actionIndex}`}
																/>
															);
														}

														const disabled =
															typeof action.disabled === "function"
																? action.disabled(row)
																: action.disabled;

														return (
															<DropdownItem
																key={`action-${actionIndex}`}
																destructive={action.destructive}
																disabled={disabled}
																onClick={() => action.onClick(row)}
															>
																{action.label}
															</DropdownItem>
														);
													})}
												</DropdownContent>
											</Dropdown>
										)}
									</TableCell>
								)}
							</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);
}

// =============================================================================
// Utility: Create a separator action
// =============================================================================

export function separator(): RowActionSeparator {
	return { type: "separator" };
}
