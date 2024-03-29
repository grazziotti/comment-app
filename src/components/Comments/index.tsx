'use client'

import Comment from './Comment'

import { usePublicCommentData } from '@/hooks/usePublicCommentData'

export default function Comments() {
  const { isPending, error, data } = usePublicCommentData()

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <ul>
      {data &&
        data.map((comment) => (
          <li key={comment.id}>
            <Comment
              username={comment.user.username}
              createdAt={comment.createdAt}
              content={comment.content}
              score={comment.score}
            />
            {comment.replies && (
              <ul className="border-l-[rgb(234, 236, 241)] ml-11 border-l-2 pl-11">
                {comment.replies.map((reply) => (
                  <li key={reply.id}>
                    {' '}
                    <Comment
                      username={comment.user.username}
                      createdAt={comment.createdAt}
                      content={comment.content}
                      score={comment.score}
                      replyTo={reply.replyTo?.user.username}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
    </ul>
  )
}
