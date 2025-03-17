export const FinanceCard = ({ children }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl bg-slate-50 min-h-[8rem] max-sm:min-h-[6rem] p-4 max-sm:p-2">
      {children}
    </div>
  );
};
