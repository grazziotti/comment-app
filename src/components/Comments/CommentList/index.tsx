import { useEffect, useState } from 'react'

import Comment from '../Comment'
import CommentSkeleton from '../Comment/CommentSkeleton'

import { useCommentData } from '@/hooks/useCommentData'
import { IComment } from '@/interfaces/IComment'

type Props = {
  type: string
  token: string
}

export default function CommentList({ type, token }: Props) {
  const { isPending, error, data } = useCommentData(type, token)

  useEffect(() => {
    if (data) {
      const sortedData = [...data]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((comment) => ({
          ...comment,
          replies: comment.replies
            ?.slice()
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
        }))
      setComments(sortedData)
    }
  }, [data])

  const [comments, setComments] = useState<IComment[]>()

  if (error) return 'An error has occurred: ' + error.message

  return (
    <ul>
      {isPending && <CommentSkeleton count={4} />}
      {comments &&
        comments.map((comment) => (
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
            />
            {comment.replies && (
              <ul className="border-l-[rgb(234, 236, 241)] ml-11 border-l-2 pl-11 sm:ml-4 sm:pl-4">
                {comment.replies.map((reply) => (
                  <li key={reply.id}>
                    <Comment
                      commentId={reply.id}
                      username={reply.user.username}
                      avatar={reply.user.avatar}
                      createdAt={reply.createdAt}
                      content={reply.content}
                      score={reply.score}
                      updated={reply.updatedAt ? true : false}
                      replyTo={reply.replyTo?.user.username}
                      voted={reply.voted}
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
