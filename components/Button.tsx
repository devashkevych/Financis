type ButtonProps = {
  loading: boolean;
  title: string;
  type: "submit" | "reset" | "button" | undefined;
};

export default function Button({ loading, title, type }: ButtonProps) {
  return (
    <div className="flex justify-center mt-6">
      <button
        className="w-3xs h-16 bg-[#2f2f2f] border border-[#3a3a3a] rounded-md transition-[border] hover:border-teal-500 focus:bg-[#262626] active:bg-[#262626]"
        type={type}
        disabled={loading}
      >
        {title}
      </button>
    </div>
  );
}
