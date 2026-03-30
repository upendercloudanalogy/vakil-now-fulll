interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string; // wrapper styles
  inputClassName?: string; // input styles
  iconClassName?: string; // icon styles
  size?: 'sm' | 'md' | 'lg'; // New: preset sizes
}
