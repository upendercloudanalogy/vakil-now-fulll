export interface SubscriptionsProps {
  className?: string;
  subscriptions: {
    title: string;
    status: string;
    price: number;
    badge: {
      text: string;
      variant: 'default' | 'destructive' | 'secondary' | 'outline';
    };
  }[];
}

export interface TrademarkCardProps {
  title?: string;
  status?: string;
  price: number;
  badge?: {
    text: string;
    variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  };
  className?: string;
}
