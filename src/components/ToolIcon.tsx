import React from 'react';
import {
  CalendarCheck,
  Users,
  TrendingUp,
  CreditCard,
  BookOpen,
  Compass,
  Layers,
  LucideProps,
} from 'lucide-react';

interface ToolIconProps extends LucideProps {
  name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'CalendarCheck':
      return <CalendarCheck {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'CreditCard':
      return <CreditCard {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    default:
      return <Layers {...props} />;
  }
};
