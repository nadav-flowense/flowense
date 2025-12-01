import React from "react";
import { cn } from "../../../lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
	({ className, ...props }, ref) => {
		return (
			<div className="w-full overflow-hidden rounded-[10px] bg-white shadow-[0px_3px_8px_0px_rgba(0,0,0,0.08)] text-pink">
				<table
					ref={ref}
					className={cn("w-full caption-bottom text-sm", className)}
					{...props}
				/>
			</div>
		);
	},
);

Table.displayName = "Table";

interface TableHeaderProps
	extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	TableHeaderProps
>(({ className, ...props }, ref) => {
	return <thead ref={ref} className={cn("bg-muted", className)} {...props} />;
});

TableHeader.displayName = "TableHeader";

interface TableBodyProps
	extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	TableBodyProps
>(({ className, ...props }, ref) => {
	return (
		<tbody
			ref={ref}
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
});

TableBody.displayName = "TableBody";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
	({ className, ...props }, ref) => {
		return (
			<tr
				ref={ref}
				className={cn(
					"border-b border-border transition-colors hover:bg-muted/50",
					className,
				)}
				{...props}
			/>
		);
	},
);

TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
	({ className, ...props }, ref) => {
		return (
			<th
				ref={ref}
				className={cn(
					"h-12 px-6 text-left align-middle font-medium text-text-primary text-[15px] [&:has([role=checkbox])]:pr-0",
					className,
				)}
				{...props}
			/>
		);
	},
);

TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
	({ className, ...props }, ref) => {
		return (
			<td
				ref={ref}
				className={cn(
					"h-[83.28px] px-6 align-middle [&:has([role=checkbox])]:pr-0",
					className,
				)}
				{...props}
			/>
		);
	},
);

TableCell.displayName = "TableCell";

interface TableCaptionProps
	extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	TableCaptionProps
>(({ className, ...props }, ref) => {
	return (
		<caption
			ref={ref}
			className={cn("mt-4 text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
});

TableCaption.displayName = "TableCaption";
