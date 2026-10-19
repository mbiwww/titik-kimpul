export default function Input({
  label,
  name,
  type = "text",
  textarea = false,
  error,
  ...props
}) {
  const kelas = `w-full rounded-lg border ${
    error ? "border-bahaya" : "border-garis"
  } bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none`;

  return (
    <div className="flex flex-col gap-1.5 text-sm font-semibold">
      <label className="flex flex-col gap-1.5">
        {label}
        {textarea ? (
          <textarea name={name} rows={4} className={kelas} {...props} />
        ) : (
          <input name={name} type={type} className={kelas} {...props} />
        )}
      </label>
      {error && <p className="text-xs font-normal text-bahaya">{error}</p>}
    </div>
  );
}
