export interface QuickAction {
  icon: React.ReactNode;
  name: string;
}

export interface QuickActionsListsProps {
  quickActions: QuickAction[];
}
