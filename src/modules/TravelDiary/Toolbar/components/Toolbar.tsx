"use client"
import ModeToggleGroup from "./ModeToggleGroup"
import Search from "./Search"

export default function Toolbar() {
  return (
    <div className="absolute top-7 right-7 z-100 flex gap-1.5">
      <ModeToggleGroup />
      <Search />
    </div>
  )
}
