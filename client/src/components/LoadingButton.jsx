import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  variant = 'primary', 
  size = 'md',
  className = '',
  loadingText = 'Loading...',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-mentorify-orange hover:bg-orange-600 text-white focus:ring-mentorify-orange shadow-glow hover:shadow-glow-lg',
    secondary: 'bg-mentorify-blue hover:bg-blue-600 text-white focus:ring-mentorify-blue shadow-glow-blue hover:shadow-glow-blue-lg',
    outline: 'border-2 border-mentorify-orange text-mentorify-orange hover:bg-mentorify-orange hover:text-white focus:ring-mentorify-orange',
    ghost: 'text-mentorify-orange hover:bg-orange-50 focus:ring-mentorify-orange',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const spinnerSizes = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'lg'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner 
            size={spinnerSizes[size]} 
            color={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'} 
            className="mr-2"
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
