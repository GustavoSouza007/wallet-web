export const Button = ({
  children,
  variant,
  className,
  type,
  disabled,
  onClick,
}) => {
  const primary = `${className} w-full h-14 rounded-xl font-bold text-base border-2 border-solid text-slate-50 border-violet-700
   bg-violet-700
  transition-all duration-500
  hover:scale-105 hover:text-slate-50
  hover:before:translate-x-[0%]
  hover:before:translate-y-[0%]
  active:scale-95`;

  const smallButton = (className = `
    w-24 h-9
    relative z-0 flex items-center justify-center overflow-hidden rounded-lg border-2 
    border-violet-700 font-semibold
    text-violet-700 transition-all duration-500
    
    before:absolute before:inset-0
    before:-z-10 before:translate-x-[150%]
    before:translate-y-[150%] before:scale-[2.5]
    before:rounded-[100%] before:bg-violet-700
    before:transition-transform before:duration-1000
    before:content-[""]

    hover:scale-105 hover:text-slate-50
    hover:before:translate-x-[0%]
    hover:before:translate-y-[0%]
    active:scale-95`);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={variant === "smallButton" ? smallButton : primary}
    >
      {children}
    </button>
  );
};
