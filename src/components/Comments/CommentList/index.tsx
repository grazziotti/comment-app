import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Comment from '../Comment'
import CommentSkeleton from '../Comment/CommentSkeleton'

import { useCommentData } from '@/hooks/useCommentData'

type Props = {
  type: string
  token: string
}

export default function CommentList({ type, token }: Props) {
  const { isPending, error, data, isError } = useCommentData(type, token)
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>(() => {
    return (
      (localStorage.getItem('commentSortOrder') as 'latest' | 'oldest') ||
      'latest'
    )
  })

  useEffect(() => {
    localStorage.setItem('commentSortOrder', sortOrder)
  }, [sortOrder])

  useEffect(() => {
    if (isError) {
      if (error.message === 'Request failed with status code 401') {
        signOut()
      }
    }
  }, [isError])

  if (error) return 'An error has occurred: ' + error.message

  const sortedComments = data
    ? [...data].sort((a, b) => {
        if (sortOrder === 'latest') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        } else {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        }
      })
    : []

  return (
    <>
      <div className="flex justify-end rounded-xl bg-primary p-6 text-textTitle">
        Order by:{' '}
        <div className="ml-2 flex gap-x-2">
          <button
            className={`${sortOrder === 'latest' ? 'text-target' : 'text-targetInactive'} transition-all hover:text-target`}
            onClick={() => setSortOrder('latest')}
          >
            Latest
          </button>
          <span className="text-textTitle">|</span>
          <button
            className={`${sortOrder === 'oldest' ? 'text-target' : 'text-targetInactive'} transition-all hover:text-target`}
            onClick={() => setSortOrder('oldest')}
          >
            Oldest
          </button>
        </div>
      </div>

      <ul>
        {isPending && <CommentSkeleton count={4} />}
        {sortedComments &&
          sortedComments.map((comment) => (
            <li key={comment.id}>
              <Comment
                commentId={comment.id}
                username={comment.user.username}
                avatar={comment.user.avatar}
                createdAt={comment.createdAt}
                content={comment.content}
                score={comment.score}
                updated={comment.updatedAt ? true : false}
                voted={comment.voted}
                replies={comment.replies}
              />
            </li>
          ))}
      </ul>
    </>
  )
}
