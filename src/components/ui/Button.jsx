export default function Button({ 
  children, 
  variant = "primary", 
  size = "medium", 
  disabled = false, 
  onClick, 
  className = "",
  ...props 
}) {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-ui",
    option: "btn-option",
  };
  const sizeClasses = {
    small: "btn-small",
    medium: "",
    large: "btn-large",
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || "",
    sizeClasses[size] || "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}