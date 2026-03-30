import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<typeof Button>;

const LawyerRegistrationSkipButton: React.FC<ButtonProps> = ({ onClick, className, ...props }) => {
    return (
        <Button
            type="button"
            onClick={onClick}
            className={cn(
                'rounded-[4px] bg-[#B8B8B8] hover:bg-[#B8B8B8] text-[#1A1A1A] font-medium text-[14px]',
                className
            )}
            {...props}
        >
            Skip
        </Button>
    );
};

export default LawyerRegistrationSkipButton;
