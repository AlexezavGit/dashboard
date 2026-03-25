import React from 'react';

interface FormattedNumberProps {
  value: number | string;
  locale?: 'en' | 'uk';
  isCurrency?: boolean;
  currencyCode?: string;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  locale = 'en',
  isCurrency = false,
  currencyCode = 'USD',
  suffix = '',
  prefix = '',
  className = ''
}) => {
  // Input validation: ensure it's a valid number
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  
  if (isNaN(numValue)) {
    return <span className={className}>{prefix}{value}{suffix}</span>;
  }

  const formatOptions: Intl.NumberFormatOptions = {
    style: isCurrency ? 'currency' : 'decimal',
    currency: isCurrency ? currencyCode : undefined,
    maximumFractionDigits: isCurrency ? 0 : 1,
  };

  // Map 'uk' to 'uk-UA' and 'en' to 'en-US' for proper locale formatting
  const localeString = locale === 'uk' ? 'uk-UA' : 'en-US';
  
  const formatted = new Intl.NumberFormat(localeString, formatOptions).format(numValue);

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
