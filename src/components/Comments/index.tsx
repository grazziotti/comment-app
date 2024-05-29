'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import AddComment from './AddComment'
import CommentList from './CommentList'

export default function Comments() {
  const { data: session } = useSession()
  const [commentListType, setCommentListType] = useState<string>('')

  useEffect(() => {
    const type = session ? 'private' : 'public'
    setCommentListType(type)
  }, [session])

  return (
    <div className="my-6">
      <CommentList type={commentListType} token={session?.user.token} />
      <AddComment />
    </div>
  )
}
