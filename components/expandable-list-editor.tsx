"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X, GripVertical } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ExpandableListEditorProps {
  title: string
  description: string
  icon: LucideIcon
  items: string[]
  isEditing: boolean
  onItemsChange: (items: string[]) => void
  placeholder: string
  emptyMessage: string
  modalMode?: boolean
}

export function ExpandableListEditor({
  title,
  description,
  icon: Icon,
  items,
  isEditing,
  onItemsChange,
  placeholder,
  emptyMessage,
  modalMode = false,
}: ExpandableListEditorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempItems, setTempItems] = useState<string[]>([])

  const openModal = () => {
    setTempItems([...items, ""])
    setIsModalOpen(true)
  }

  const handleItemChange = (index: number, value: string) => {
    if (modalMode) {
      const newItems = [...tempItems]
      newItems[index] = value
      setTempItems(newItems)
    } else {
      const newItems = [...items]
      newItems[index] = value
      onItemsChange(newItems)
    }
  }

  const addItem = () => {
    if (modalMode) {
      setTempItems((prev) => [...prev, ""])
    } else {
      onItemsChange([...items, ""])
    }
  }

  const removeItem = (index: number) => {
    if (modalMode) {
      setTempItems((prev) => prev.filter((_, i) => i !== index))
    } else {
      onItemsChange(items.filter((_, i) => i !== index))
    }
  }

  const saveItems = () => {
    onItemsChange(tempItems.filter((item) => item.trim()))
    setIsModalOpen(false)
    setTempItems([])
  }

  const cancelModal = () => {
    setIsModalOpen(false)
    setTempItems([])
  }

  const currentItems = modalMode ? tempItems : items
  const filteredItems = items.filter((item) => item.trim())

  if (modalMode) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5 text-violet-600" />
              <div>
                <h4 className="text-base font-semibold text-gray-800">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openModal}
              className="text-violet-600 border-violet-300 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Items
            </Button>
          </div>

          {filteredItems.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filteredItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 flex-1">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onItemsChange(items.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500 text-sm">{emptyMessage}</p>
              <p className="text-gray-400 text-xs">Click "Add Items" to get started</p>
            </div>
          )}
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-violet-600" />
                <span>{title}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-3">
                {tempItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0"></div>
                    <Input
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      placeholder={placeholder}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-1 h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full text-violet-600 border-violet-300 hover:bg-violet-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={cancelModal}>
                Cancel
              </Button>
              <Button onClick={saveItems} className="bg-violet-600 hover:bg-violet-700">
                Save Items
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          <Icon className="h-5 w-5 text-violet-600" />
        </div>

        {isEditing ? (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-sm border border-gray-200 p-4 space-y-3">
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg border border-gray-200 p-3 hover:border-violet-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"></div>
                  </div>
                  <Input
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-gray-700"
                  />
                  {currentItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="w-full flex items-center justify-center space-x-2 text-violet-600 border-violet-300 hover:bg-violet-50 border-dashed py-3 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Add {title.split(" ")[0]}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-base text-gray-700">{item}</p>
              </div>
            ))}
            {filteredItems.length === 0 && <p className="text-gray-500 italic">{emptyMessage}</p>}
          </div>
        )}
      </div>
    </Card>
  )
}
