import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonType = React.ComponentProps<typeof Button>;

interface ButtonProps extends ButtonType {
    loading?: boolean;
}

const LawyerRegistrationNextButton: React.FC<ButtonProps> = ({ onClick, className, loading, children, disabled, ...props }) => {
    return (
        <Button
            type="submit" // Default to submit
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                'rounded-[4px] bg-[#1565C0] hover:bg-[#1565C0] text-[#FFFFFF] font-medium text-[14px]',
                className
            )}
            {...props}
        >
            {loading ? "Processing..." : (children || "Next")}
        </Button>
    );
};

export default LawyerRegistrationNextButton;
