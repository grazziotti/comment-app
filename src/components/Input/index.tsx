type InputProps = {
  id: string
  type: 'text' | 'password'
  name: string
  placeholder: string
  required?: boolean
  label?: string
}

export default function Input({
  id,
  name,
  placeholder,
  type,
  label,
  required
}: InputProps) {
  return (
    <>
      {label && (
        <label htmlFor={id} className="text-textTitle">
          {label}
        </label>
      )}
      <input
        className="mb-4 mt-1 min-w-72 rounded-xl border-2 border-gray-200 px-4 py-2 text-textBody outline-none transition-colors hover:border-target focus:border-target"
        id={id}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
      />
    </>
  )
}
