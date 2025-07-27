"use client"

import Image from "next/image"
import { IconPractice } from "@/components/icons/icon-practice"
import {useIsMobile} from "@/hooks/use-mobile";
import {cn} from "@/lib/utils";
import type {ProfileData} from "@/components/profile/types/common";
import {AddEntityButton} from "@/components/add-entity-button";
import {Education} from "@/types/common";
import {EditEntityButton} from "@/components/edit-entity-button";
import {BurnEntityButton} from "@/components/burn-entity-button";

interface CertificatesProps {
  title: string
  items: Education[]
  isEditMode: boolean
  onInputChange: (field: keyof ProfileData, value: string | string[] | File[] | Education[]) => void
  errors: Record<string, string>
  fieldKey: keyof ProfileData
}

export function Certificates({ title, items, isEditMode, onInputChange, errors, fieldKey }: CertificatesProps) {
   const isMobile = useIsMobile()

  const handleAddCertifacte = () => {
        const updatedItems = [...items, {
            title: "",
            description: "",
            certificate: "",
        }]
        onInputChange(fieldKey, updatedItems)
  }

  const handleBurnCertifacte = (index: number) => {
       const updatedItems = items.filter((_, i) => i !== index)
      onInputChange(fieldKey, updatedItems)
  }

  const handleCertifacteChange = (index: number, value: Education) => {
        const updatedItems = [...items]
        updatedItems[index] = {
            title: value.title,
            description: value.description,
            certificate: value.certificate,
        }
        onInputChange(fieldKey, updatedItems)
   }


    return (
    <>
      <div className="flex flex-row gap-2">
          <div className={cn(
              "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
              isMobile ? "text-mobilebase" : "text-base",
          )}>{title}</div>
          {isEditMode && (<AddEntityButton onClick={handleAddCertifacte}/>)}
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
            <>
                <div className="flex flex-row gap-6 justify-end pr-3">
                    <EditEntityButton
                        onClick={() => {handleCertifacteChange(index, item)}}
                    />
                    <BurnEntityButton onClick={() => {handleBurnCertifacte(index)}}/>
                </div>
                <div key={index} className="bg-white p-3 rounded-sm shadow-sm flex">
                    <div className="flex-1 min-w-0 pr-1">
                        {isEditMode ? (
                            <></>
                        ) : (
                            <div className="font-semibold text-neutral-900 line-clamp-1 leading-relaxed">{item.title}</div>
                        )}

                        {isEditMode ? (
                            <></>
                        ) : (
                            <div className="text-sm text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</div>
                        )}
                    </div>
                    <div className="w-[72px] aspect-square flex-shrink-0 bg-colors-neutral-150 rounded-sm border shadow-md">
                        {item.certificate ? (
                            <Image
                                src={item.certificate || "/placeholder.svg"}
                                alt={`Certificate ${index}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-sm"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-colors-neutral-150 rounded-sm">
                                <IconPractice width={48} height={48} />
                            </div>
                        )}
                    </div>
                </div>
            </>
        ))}
      </div>
    </>
  )
}
