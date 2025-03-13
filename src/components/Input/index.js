export const Input = ({
  label,
  placeholder,
  type,
  name,
  className,
  id,
  value,
  onChange,
  error,
  step,
  options = [],
}) => {
  const baseClass =
    "w-full h-12 p-2 rounded-lg text-base border-solid border-2 focus:outline-none";
  const borderClass = error ? "border-red-500" : "border-cyan-400";

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-2 font-semibold">
        {label}
      </label>
      {type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClass} ${borderClass} ${className}`}
        >
          {options.map((option, index) => (
            <option className="rounded" key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          step={step}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClass} ${borderClass} ${className}`}
        />
      )}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};
