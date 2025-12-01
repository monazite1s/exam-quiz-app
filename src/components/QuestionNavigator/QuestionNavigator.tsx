"use client";

import React, { useState } from "react";
import styles from "./QuestionNavigator.module.css";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  attempts: Record<number, boolean>; // questionIndex -> isCorrect
}

/**
 * 题目导航组件
 * 显示所有题目的网格，支持快速跳转
 */
export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  onSelectQuestion,
  attempts,
}: QuestionNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.navigator}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.title}>
          题目导航 ({currentIndex + 1}/{totalQuestions})
        </span>
        <span className={`${styles.toggleIcon} ${isOpen ? styles.open : ""}`}>
          ▼
        </span>
      </div>

      <div className={`${styles.grid} ${isOpen ? styles.open : ""}`}>
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAnswered = index in attempts;
          const isCorrect = attempts[index];

          let statusClass = "";
          if (index === currentIndex) {
            statusClass = styles.active;
          } else if (isAnswered) {
            statusClass = isCorrect ? styles.correct : styles.incorrect;
          }

          return (
            <button
              key={index}
              className={`${styles.navButton} ${statusClass}`}
              onClick={() => {
                onSelectQuestion(index);
                // setIsOpen(false); // Optional: close on select
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
