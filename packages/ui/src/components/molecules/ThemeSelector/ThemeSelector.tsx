import { Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import { applyTheme, getTheme, type Theme } from "../../../lib/theme";

interface ThemeSelectorProps {
	className?: string;
	onChange?: (theme: Theme) => void;
}

function ThemeSelector({
	className,
	onChange,
}: ThemeSelectorProps): React.ReactNode {
	const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme());

	const handleThemeChange = (theme: Theme): void => {
		setCurrentTheme(theme);
		applyTheme(theme);
		onChange?.(theme);
	};

	const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
		{ value: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
		{ value: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
		{ value: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
	];

	return (
		<div
			className={cn(
				"flex items-center gap-1 p-1 bg-muted rounded-lg",
				className,
			)}
		>
			{themes.map(({ value, icon, label }) => (
				<button
					key={value}
					type="button"
					onClick={() => handleThemeChange(value)}
					className={cn(
						"flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
						currentTheme === value
							? "bg-background shadow-sm"
							: "hover:bg-background/50",
					)}
				>
					{icon}
					<span className="text-sm">{label}</span>
				</button>
			))}
		</div>
	);
}

ThemeSelector.displayName = "ThemeSelector";

export { ThemeSelector, type ThemeSelectorProps };
