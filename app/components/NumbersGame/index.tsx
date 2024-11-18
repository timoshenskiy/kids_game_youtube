"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { useGameLogic } from '../../hooks/useGameLogic'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import {IceCream, Cake, russianNumbers, englishNumbers, cakeColors, iceCreamColors} from "@/app/components/NumbersGame/constants";
interface NumbersGameProps {
    onComplete: () => void;
}

export default function NumbersGame({ onComplete }: NumbersGameProps) {
    const [dessertCount, setDessertCount] = useState(2)
    const [options, setOptions] = useState<number[]>([])
    const [isIceCream, setIsIceCream] = useState(true)

    const { speakText } = useSpeechSynthesis()

    const speakRussianAndEnglishNumber = useCallback((number: number, isIceCream: boolean) => {
        const index = isIceCream ? number : number + 5
        const russianText = russianNumbers[index]
        const englishText = englishNumbers[index]
        speakText(`${russianText}, ${englishText}`)
    }, [speakText])

    const generateNewQuestion = useCallback(() => {
        const count = Math.floor(Math.random() * 4) + 1
        setDessertCount(count)
        setIsIceCream(prev => !prev)

        let newOptions = [count]
        while (newOptions.length < 3) {
            const option = Math.floor(Math.random() * 4) + 1
            if (!newOptions.includes(option)) {
                newOptions.push(option)
            }
        }
        setOptions(newOptions.sort(() => Math.random() - 0.5))
    }, [])

    const checkAnswer = useCallback((answer: number) => {
        return answer === dessertCount
    }, [dessertCount])

    const { isCorrect, message, handleAnswer } = useGameLogic(
        generateNewQuestion,
        checkAnswer,
        onComplete,
        () => {}
    )

    useEffect(() => {
        generateNewQuestion()
    }, [generateNewQuestion])

    const handleOptionClick = (option: number) => {
        speakRussianAndEnglishNumber(option, isIceCream)
        handleAnswer(option)
    }

    const DessertComponent = isIceCream ? IceCream : Cake
    const dessertColors = isIceCream ? iceCreamColors : cakeColors

    return (
        <div className="flex flex-col items-center justify-start bg-gradient-to-r from-pink-300 to-purple-300 p-4 rounded-lg w-[550px]">
            <div className="flex justify-center gap-12 mb-12 mt-12">
                {Array.from({ length: dessertCount }).map((_, index) => (
                    <DessertComponent
                        key={index}
                        colors={[
                            dessertColors[index % dessertColors.length],
                            dessertColors[(index + 1) % dessertColors.length]
                        ]}
                    />
                ))}
            </div>
            <div className="flex gap-8 mb-8">
                {options.map((option) => (
                    <Button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        className="text-3xl font-bold w-16 h-16 rounded-full bg-yellow-400 hover:bg-yellow-500 text-purple-800"
                    >
                        {option}
                    </Button>
                ))}
            </div>
            {message && (
                <div
                    className={`text-2xl font-bold mb-4 ${
                        isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
    )
}
