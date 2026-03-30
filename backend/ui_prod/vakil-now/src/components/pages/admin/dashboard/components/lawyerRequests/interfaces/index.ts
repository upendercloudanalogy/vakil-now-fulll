export interface LawyerRequest {
  id: number;
  name: string;
  image: string;
}

export interface LawyerRequestListProps {
  lawyerRequests: LawyerRequest[];
}
