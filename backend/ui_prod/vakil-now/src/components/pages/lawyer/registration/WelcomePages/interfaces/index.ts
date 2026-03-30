 export interface WelcomePageProps {
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    isLast?: boolean; // Used by the last page to change button text
}