import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import Loader from '@/components/Loader'

import { useDeleteComment } from '@/hooks/useDeleteComment'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  closeModal: () => void
  commentId: string
  username: string
}

export default function DeleteCommentModal({
  commentId,
  username,
  closeModal
}: Props) {
  const { data: session } = useSession()
  const { mutate, isSuccess, isPending } = useDeleteComment()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['comment-data'] })
      closeModal()
    }
  }, [isSuccess, closeModal, username, queryClient])

  function deleteComment() {
    if (!session) {
      return
    }

    if (session.user.name !== username) {
      return
    }

    mutate({ commentId, token: session.user.token })
  }

  return (
    <div>
      <div
        onClick={closeModal}
        className="fixed bottom-0 left-0 right-0 top-0 z-10 cursor-default bg-black opacity-80"
      ></div>
      <div className="fixed left-1/2 top-1/2 z-20 flex w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col gap-y-4 rounded-xl bg-primary p-8">
        <h2 className="text-2xl font-medium text-textTitle">Delete comment</h2>
        <p className="text-textBody">
          {`Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.`}
        </p>
        <div className="flex items-center gap-x-4">
          <button
            onClick={closeModal}
            className="w-full rounded-xl bg-gray-500 py-3 font-bold text-primary transition-colors hover:bg-gray-400"
          >
            NO, CANCEL
          </button>
          <button
            onClick={deleteComment}
            className="flex w-full justify-center rounded-xl bg-deleteColor py-3 font-bold text-primary transition-colors hover:bg-red-300"
          >
            {isPending && <Loader />}
            {!isPending && 'YES, DELETE'}
          </button>
        </div>
      </div>
    </div>
  )
}
