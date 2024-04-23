interface ICommentBase {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date | null
  score: number
  user: IUserInfo
}

export interface IComment extends ICommentBase {
  replies?: IReply[]
}

interface IUserInfo {
  username: string
}

export interface IReply extends ICommentBase {
  replyTo?: {
    user: IUserInfo
  }
}
