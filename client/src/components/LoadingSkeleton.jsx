import React from 'react';

const LoadingSkeleton = ({ 
  variant = 'text', 
  width = 'full', 
  height = 'auto',
  className = '',
  count = 1,
  animate = true 
}) => {
  const baseClasses = `bg-gray-200 rounded ${animate ? 'animate-pulse' : ''}`;
  
  const variantClasses = {
    text: 'h-4',
    title: 'h-6',
    subtitle: 'h-5',
    button: 'h-10',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-32',
    image: 'h-48',
    circle: 'rounded-full',
    rectangle: 'rounded-lg'
  };

  const widthClasses = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4'
  };

  const heightClasses = {
    auto: '',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12'
  };

  const getClasses = () => {
    let classes = baseClasses;
    
    if (variantClasses[variant]) {
      classes += ` ${variantClasses[variant]}`;
    }
    
    if (widthClasses[width]) {
      classes += ` ${widthClasses[width]}`;
    }
    
    if (heightClasses[height]) {
      classes += ` ${heightClasses[height]}`;
    }
    
    return `${classes} ${className}`;
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={getClasses()} />
        ))}
      </div>
    );
  }

  return <div className={getClasses()} />;
};

// Predefined skeleton layouts
export const CardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <LoadingSkeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="title" width="3/4" />
        <LoadingSkeleton variant="text" width="1/2" />
      </div>
    </div>
    <LoadingSkeleton variant="text" count={3} className="mb-4" />
    <LoadingSkeleton variant="button" width="1/3" />
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
    <div className="p-6 border-b border-gray-200">
      <LoadingSkeleton variant="title" width="1/4" />
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <LoadingSkeleton variant="text" width={colIndex === 0 ? '3/4' : 'full'} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ListSkeleton = ({ items = 5, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="subtitle" width="3/4" />
          <LoadingSkeleton variant="text" width="1/2" />
        </div>
        <LoadingSkeleton variant="button" width="20" />
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Header */}
    <div className="flex items-center justify-between">
      <LoadingSkeleton variant="title" width="1/3" />
      <LoadingSkeleton variant="button" width="32" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <LoadingSkeleton variant="circle" className="w-12 h-12" />
            <LoadingSkeleton variant="text" width="1/4" />
          </div>
          <LoadingSkeleton variant="title" width="1/2" className="mb-2" />
          <LoadingSkeleton variant="text" width="3/4" />
        </div>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

export default LoadingSkeleton;
