import type * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../atoms/Button";

interface SettingsRowProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	action?: React.ReactNode;
	actionLabel?: string;
	onClick?: () => void;
	className?: string;
	children?: React.ReactNode;
}

function SettingsRow({
	icon,
	title,
	description,
	action,
	actionLabel,
	onClick,
	className,
	children,
}: SettingsRowProps): React.ReactNode {
	const actionContent =
		action ??
		(actionLabel && onClick ? (
			<Button variant="outline" size="sm" onClick={onClick}>
				{actionLabel}
			</Button>
		) : null);

	return (
		<div
			className={cn(
				"flex items-center justify-between p-4 bg-muted/50 rounded-lg",
				className,
			)}
		>
			<div className="flex items-center gap-3">
				{icon && (
					<div className="text-muted-foreground flex-shrink-0">{icon}</div>
				)}
				<div>
					<p className="font-medium">{title}</p>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
			</div>
			{actionContent && <div className="flex-shrink-0">{actionContent}</div>}
			{children && <div className="flex-shrink-0">{children}</div>}
		</div>
	);
}

SettingsRow.displayName = "SettingsRow";

export { SettingsRow, type SettingsRowProps };
