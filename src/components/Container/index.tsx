import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function Container({ children }: Props) {
  return <div className="mx-auto max-w-[900px] px-4">{children}</div>
}
