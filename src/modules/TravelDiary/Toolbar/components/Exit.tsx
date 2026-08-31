import ExitIcon from "@/shared/icons/ExitIcon"

export default function Exit() {
  return (
    <div className="bg-background h-fit rounded-lg p-1.25">
      <form action="/signout" method="post">
        <button
          type="submit"
          className="data-pressed:bg-border focus:outline-text-main hover:bg-hover border-border active:bg-border cursor-pointer rounded-lg border-3 p-1.25 focus:outline"
        >
          <ExitIcon></ExitIcon>
        </button>
      </form>
    </div>
  )
}
