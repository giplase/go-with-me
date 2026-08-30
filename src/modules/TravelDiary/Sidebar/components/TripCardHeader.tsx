import CloseIcon from "@/shared/icons/CloseIcon"

export default function TripCardHeader({
  locationName,
  isPendingUpdateLocName,
  onClick,
}: {
  locationName?: string
  isPendingUpdateLocName: boolean
  onClick: () => void
}) {
  return (
    <div className="flex w-full items-center justify-between gap-2.5 pb-2.5">
      {!isPendingUpdateLocName && <span className="text-text-sub truncate">{locationName}</span>}
      {isPendingUpdateLocName && <span className="bg-pending h-5 w-100 animate-pulse rounded-md"></span>}
      <button className="w-fit cursor-pointer" onClick={onClick}>
        <CloseIcon />
      </button>
    </div>
  )
}
