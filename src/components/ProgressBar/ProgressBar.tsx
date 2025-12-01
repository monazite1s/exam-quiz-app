"use client";

import React from "react";
import { QuizStats } from "@/types/question";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  stats: QuizStats;
  currentIndex: number;
}

/**
 * 进度条组件
 * 显示答题进度和统计信息
 */
export default function ProgressBar({ stats, currentIndex }: ProgressBarProps) {
  const progressPercentage =
    stats.total > 0 ? (stats.answered / stats.total) * 100 : 0;

  return (
    <div className={styles.container}>
      {/* 统计信息 */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>当前题目</span>
          <span className={styles.statValue}>
            {currentIndex + 1} / {stats.total}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>已答题数</span>
          <span className={styles.statValue}>{stats.answered}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>正确题数</span>
          <span className={`${styles.statValue} ${styles.correct}`}>
            {stats.correct}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>正确率</span>
          <span
            className={`${styles.statValue} ${
              stats.accuracy >= 60 ? styles.correct : styles.incorrect
            }`}
          >
            {stats.accuracy}%
          </span>
        </div>
      </div>

      {/* 进度条 */}
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercentage}%` }}
          >
            <span className={styles.progressText}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
