import { Suspense } from "react";
import GameWrapper from "@/app/components/GameWrapper.tsx";
export default function Home() {
  return (
    <Suspense fallback={<div>Loading playlist and video...</div>}>
      <GameWrapper />
    </Suspense>
  )
}
