type Props = {
  count: number
}

export default function CommentSkeleton({ count }: Props) {
  return Array(count)
    .fill(0)
    .map((item, i) => (
      <div
        className="mt-6 flex h-[152px] w-full rounded-xl bg-white p-6"
        key={i}
      >
        <div className="h-full max-h-[104px] w-full max-w-11 animate-pulse rounded-xl bg-secondary"></div>
        <div className="ml-6 flex w-full flex-col gap-y-3">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center justify-between gap-x-3">
              <div className="flex items-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-secondary"></div>
                <div className="ml-3 h-6 w-12 animate-pulse rounded-xl bg-secondary"></div>
                <div className="ml-4 h-6 w-24 animate-pulse rounded-xl bg-secondary"></div>
              </div>
              <div className="h-6 w-16 animate-pulse rounded-xl bg-secondary"></div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-y-2">
            <div className="flex h-6 animate-pulse rounded-xl bg-secondary"></div>
            <div className="flex h-6 animate-pulse rounded-xl bg-secondary"></div>
          </div>
        </div>
      </div>
    ))
}
