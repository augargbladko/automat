import { Select, SelectItem, Selection } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { Filter } from "../utils"

export function FilterDropdown({
  label,
  choice,
  filters,
  onSelect,
}: {
  label: string
  choice: string
  filters: Filter[]
  onSelect: (key: string) => void
}) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([choice]))

  useEffect(() => {
    setSelectedKeys(new Set([choice]))
  }, [choice])

  function onDropdownChoice(selection: Selection) {
    setSelectedKeys(selection)
    const newChoice = Array.from(selection).join(", ")
    onSelect(newChoice)
  }

  return (
    <Select
      label={label}
      variant="bordered"
      placeholder="Select a status"
      selectedKeys={selectedKeys}
      onSelectionChange={onDropdownChoice}
      className="w-40 mx-2"
      classNames={{
        listboxWrapper: "max-h-[600px]",
        trigger: "p-0 min-h-7 h-7",
        label: "ml-4 px-1 mb-2 bg-black text-xs",
        innerWrapper: "group-data-[has-label=true]:pt-0 pl-2",
        popoverContent: "bg-gray-800 text-xs",
        value: "text-xs",
      }}
    >
      {filters.map((filter) => (
        <SelectItem
          key={filter.key}
          value={filter.key}
          classNames={{ title: "text-xs" }}
        >
          {filter.text}
        </SelectItem>
      ))}
    </Select>
  )
}
