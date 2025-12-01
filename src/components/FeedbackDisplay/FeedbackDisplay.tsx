"use client";

import React from "react";
import styles from "./FeedbackDisplay.module.css";

interface FeedbackDisplayProps {
  isCorrect: boolean;
  correctAnswer: string | boolean;
  userAnswer: string | boolean;
  explanation?: string;
}

/**
 * 反馈显示组件
 * 显示答题结果（正确/错误）和正确答案
 */
export default function FeedbackDisplay({
  isCorrect,
  correctAnswer,
  userAnswer,
  explanation,
}: FeedbackDisplayProps) {
  // 格式化答案显示
  const formatAnswer = (answer: string | boolean): string => {
    if (typeof answer === "boolean") {
      return answer ? "正确 (√)" : "错误 (×)";
    }
    return String(answer);
  };

  return (
    <div
      className={`${styles.feedback} ${
        isCorrect ? styles.correct : styles.incorrect
      }`}
    >
      {/* 结果图标和文字 */}
      <div className={styles.resultHeader}>
        <div className={styles.iconWrapper}>
          {isCorrect ? (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <span className={styles.resultText}>
          {isCorrect ? "回答正确！" : "回答错误"}
        </span>
      </div>

      {/* 答案详情 */}
      <div className={styles.answerDetails}>
        <div className={styles.answerRow}>
          <span className={styles.answerLabel}>你的答案：</span>
          <span className={styles.answerValue}>{formatAnswer(userAnswer)}</span>
        </div>

        {!isCorrect && (
          <div className={styles.answerRow}>
            <span className={styles.answerLabel}>正确答案：</span>
            <span className={`${styles.answerValue} ${styles.correctValue}`}>
              {formatAnswer(correctAnswer)}
            </span>
          </div>
        )}
      </div>

      {/* 解析说明 */}
      {explanation && (
        <div className={styles.explanation}>
          <div className={styles.explanationHeader}>💡 解析</div>
          <div className={styles.explanationContent}>{explanation}</div>
        </div>
      )}
    </div>
  );
}
