import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function Container({ children }: Props) {
  return <div className="mx-auto w-[737px]">{children}</div>
}
