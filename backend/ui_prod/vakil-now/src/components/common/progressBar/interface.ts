interface StepProgressBarProps {
  date: string;
  title: string;
  currentStep: number;
  totalSteps?: number;
  className?: string;
  activeColor?: string;
  pendingColor?: string;
}
