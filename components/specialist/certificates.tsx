"use client"

import Image from "next/image"
import { IconPractice } from "@/components/icons/icon-practice"
import {useIsMobile} from "@/hooks/use-mobile";
import {cn} from "@/lib/utils";

interface CertificateItem {
  title: string
  description: string
  certificate?: string
}

interface CertificatesProps {
  title: string
  items: CertificateItem[]
}

export function Certificates({ title, items }: CertificatesProps) {
   const isMobile = useIsMobile()

  if (!items || items.length === 0) return null

  return (
    <>
      <div className={cn(
          "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
          isMobile ? "text-mobilebase" : "text-base",
      )}>{title}</div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white p-3 rounded-sm shadow-sm flex">
            <div className="flex-1 min-w-0 pr-1">
              <div className="font-semibold text-neutral-900 line-clamp-1 leading-relaxed">{item.title}</div>
              <div className="text-sm text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</div>
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
        ))}
      </div>
    </>
  )
}
