type FieldsetProps = {
  children: React.ReactNode
}

export default function Fieldset({ children }: FieldsetProps) {
  return <fieldset className="flex flex-col">{children}</fieldset>
}
