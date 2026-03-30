export interface ProfileHeaderCardProps {
  imageUrl: string;
  companyName: string;
  fullName: string;
  dateLabel: string;

  email: string;
  phone: string;
  address: string;
  language: string;

  onEdit?: () => void;
}
