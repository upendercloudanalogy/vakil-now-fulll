export interface TrackServiceItem {
  date: string;
  title: string;
  currentStep: number;
  totalSteps?: number;
  activeColor?: string;
  pendingColor?: string;
}

export interface TrackServicesProps {
  className?: string;
  services: TrackServiceItem[]; // ← NEW
}
