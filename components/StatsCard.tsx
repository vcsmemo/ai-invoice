'use client';

import { useEffect, useState } from 'react';

interface StatItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}

export default function StatsCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats: StatItem[] = [
    {
      label: 'Invoices Generated',
      value: '12,847',
    },
    {
      label: 'Active Users',
      value: '3,254',
    },
    {
      label: 'Countries',
      value: '127',
    },
    {
      label: 'Success Rate',
      value: '99.8',
      suffix: '%',
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-card border border-border rounded-lg p-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-foreground">
            {stat.prefix}
            {stat.value}
            {stat.suffix}
          </p>
        </div>
      ))}
    </div>
  );
}
