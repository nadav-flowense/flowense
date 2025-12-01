import type { LucideIcon } from "lucide-react";
import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { Text } from "../../atoms/Text";
export interface NavItemProps {
	icon: LucideIcon;
	label: string;
	active?: boolean;
	href?: string;
	onClick?: () => void;
	isIconMode?: boolean;
}

export function NavItem({
	icon: Icon,
	label,
	active = false,
	onClick,
	isIconMode = false,
}: NavItemProps): JSX.Element {
	const baseClassName = cn(
		"w-full flex items-center gap-3 px-3 py-2 transition-colors relative",
		active ? "bg-muted" : "hover:bg-background",
		isIconMode ? "justify-center" : "",
	);

	const content = (
		<>
			{isIconMode && <Icon className="w-5 h-5 shrink-0 text-text-secondary" />}

			{!isIconMode && <Text className="truncate">{label}</Text>}

			{active && (
				<div className="absolute right-0 top-0 bottom-0 w-1 bg-text-primary h-full" />
			)}
		</>
	);

	return (
		<button
			type="button"
			tabIndex={0}
			className={baseClassName}
			title={isIconMode ? label : undefined}
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}}
		>
			{content}
		</button>
	);
}

NavItem.displayName = "NavItem";
