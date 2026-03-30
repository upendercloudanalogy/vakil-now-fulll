export interface Consultation {
  name: string;
  date: string; // "dd/mm/yyyy hh:mm AM/PM"
  avatarUrl?: string;
  initials?: string;
}

export interface UpcomingConsultationProps {
  className?: string;
  consultations: Consultation[];
}
