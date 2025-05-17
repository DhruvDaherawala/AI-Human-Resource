"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface SkillsInputProps {
  value: string[]
  onChange: (skills: string[]) => void
  placeholder?: string
  maxSkills?: number
}

export function SkillsInput({ value, onChange, placeholder = "Add skills...", maxSkills = 20 }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill()
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeSkill(value.length - 1)
    }
  }

  const addSkill = () => {
    const skill = inputValue.trim()
    if (skill && !value.includes(skill) && value.length < maxSkills) {
      onChange([...value, skill])
      setInputValue("")
    }
  }

  const removeSkill = (index: number) => {
    const newSkills = [...value]
    newSkills.splice(index, 1)
    onChange(newSkills)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 p-2 border rounded-md focus-within:ring-1 focus-within:ring-ring"
      onClick={handleContainerClick}
    >
      {value.map((skill, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {skill}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              removeSkill(index)
            }}
          />
        </Badge>
      ))}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 p-0 h-7"
      />
    </div>
  )
}
