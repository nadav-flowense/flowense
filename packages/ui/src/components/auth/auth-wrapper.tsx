import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../molecules/Card';

export type AuthWrapperProps = {
  title: string;
  description: string;
  children: ReactNode;
  logo?: ReactNode;
  onLogoClick?: () => void;
  socialButtons?: ReactNode;
  bottomNavigation?: ReactNode;
  footerContent?: ReactNode;
  showDivider?: boolean;
  dividerText?: string;
};

export function AuthWrapper({
  title,
  description,
  children,
  logo,
  onLogoClick,
  socialButtons,
  bottomNavigation,
  footerContent,
  showDivider = true,
  dividerText = 'Or continue with',
}: AuthWrapperProps) {
  return (
    <Card className="relative w-full max-w-xs pb-0 sm:max-w-sm">
      <CardHeader className="border-none bg-transparent shadow-xs">
        <div className="flex flex-col items-center gap-2 text-center">
          {logo &&
            (onLogoClick ? (
              <button
                className="cursor-pointer border-0 bg-transparent p-0"
                onClick={onLogoClick}
                type="button"
              >
                {logo}
              </button>
            ) : (
              <div>{logo}</div>
            ))}
          <CardTitle className="font-semibold text-xl">{title}</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {showDivider && socialButtons && (
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              {dividerText}
            </span>
          </div>
        )}
        {socialButtons && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialButtons}
          </div>
        )}
        {bottomNavigation}
      </CardContent>
      {footerContent && (
        <CardFooter className="flex justify-center rounded-b-lg bg-muted p-4">
          <div className="flex flex-col gap-2">{footerContent}</div>
        </CardFooter>
      )}
    </Card>
  );
}

export default AuthWrapper;
