export interface BookedConsultation {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface BookedConsultationsListsProps {
  bookedConsultations: BookedConsultation[];
}
