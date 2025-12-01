import { IconBrandGithub } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../molecules/Tooltip';

export type GithubSignInButtonProps = {
  onClick: () => void;
  loading?: boolean;
  tooltipContent?: ReactNode;
};

export function GithubSignInButton({
  onClick,
  loading = false,
  tooltipContent = 'GitHub',
}: GithubSignInButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          loading={loading}
          onClick={onClick}
          size="icon"
          variant="secondary"
        >
          <IconBrandGithub />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
