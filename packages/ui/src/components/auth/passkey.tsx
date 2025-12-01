import { FingerprintIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../molecules/Tooltip';

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
