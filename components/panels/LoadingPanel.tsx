interface LoadingPanelProps {
  title: string
  description: string
}

export function LoadingPanel(props: LoadingPanelProps) {
  return (
    <div className="flex flex-col w-full mt-16">
      <h1 className="m-auto">{props.title}</h1>
      <p className="m-auto">{props.description}</p>
    </div>
  )
}
