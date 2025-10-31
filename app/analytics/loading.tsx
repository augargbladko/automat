import { LoadingPanel } from "@/components/panels/LoadingPanel"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <LoadingPanel
      title="Loading Analytics Page"
      description="loading this table usually takes 1-2 seconds..."
    />
  )
}
