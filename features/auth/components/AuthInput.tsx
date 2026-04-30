type AuthInputProps = {
  label: string;
  type?: string;
  name: string;
};

export default function AuthInput({
  label,
  type = "text",
  name,
}: AuthInputProps) {
  return (
    <div className="relative w-xs max-w-xs">
      <input
        id={name}
        name={name}
        type={type}
        placeholder=" "
        className="
              peer w-full
              bg-[#2f2f2f]
              text-white
              px-4 pt-6 pb-2
              rounded-md
              outline-none
              border border-[#3a3a3a]
            "
      />
      <label
        htmlFor={name}
        className="
              absolute left-4 top-2
              text-sm text-zinc-400
              transition-all

              peer-placeholder-shown:top-4
              peer-placeholder-shown:text-base
              peer-placeholder-shown:text-zinc-500

              peer-focus:top-2
              peer-focus:text-sm
            "
      >
        {label}
      </label>
    </div>
  );
}
