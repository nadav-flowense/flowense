import { FingerprintIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '#/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/tooltip';

export type PasskeySignInButtonProps = {
  onClick: () => void;
  loading?: boolean;
  tooltipContent?: ReactNode;
};

export function PasskeySignInButton({
  onClick,
  loading = false,
  tooltipContent = 'Passkey',
}: PasskeySignInButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          loading={loading}
          onClick={onClick}
          size="icon"
          variant="secondary"
        >
          <FingerprintIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
