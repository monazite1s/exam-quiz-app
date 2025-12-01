"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQuestionStats } from "@/data/question-provider";
import styles from "./page.module.css";

/**
 * 首页 - 题库概览和开始刷题
 */
export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    total: number;
    byType: Record<string, number>;
    sections: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getQuestionStats();
        setStats(data);
      } catch (error) {
        console.error("加载统计失败:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <header className={styles.header}>
        <h1 className={styles.title}>📚 期末考试刷题系统</h1>
        <p className={styles.subtitle}>智能题库 · 即时反馈 · 移动优化</p>
        <small className={styles.developer}>by 张怀民</small>
      </header>

      {/* 统计卡片 */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.primary}`}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>总题数</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.blue}`}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {stats.byType.single_choice}
              </div>
              <div className={styles.statLabel}>单选题</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.yellow}`}>
            <div className={styles.statIcon}>✏️</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.byType.fill_blank}</div>
              <div className={styles.statLabel}>填空题</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.green}`}>
            <div className={styles.statIcon}>✓</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.byType.true_false}</div>
              <div className={styles.statLabel}>判断题</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purple}`}>
            <div className={styles.statIcon}>💬</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {stats.byType.short_answer}
              </div>
              <div className={styles.statLabel}>简答题</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.pink}`}>
            <div className={styles.statIcon}>💻</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.byType.code}</div>
              <div className={styles.statLabel}>代码题</div>
            </div>
          </div>
        </div>
      )}

      {/* 功能介绍 */}
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🎯</div>
          <h3>即时反馈</h3>
          <p>提交答案立即知道对错，绿色表示正确，红色表示错误</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📱</div>
          <h3>移动适配</h3>
          <p>完美支持手机、平板等各种设备，随时随地刷题</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📊</div>
          <h3>进度跟踪</h3>
          <p>实时显示答题进度和正确率，掌握学习情况</p>
        </div>
      </div>

      {/* 开始按钮 */}
      <div className={styles.actions}>
        <button
          onClick={() => router.push("/quiz")}
          className={styles.startButton}
        >
          <span className={styles.buttonIcon}>🚀</span>
          <span>开始刷题</span>
        </button>
        <button
          onClick={() => router.push("/browse")}
          className={styles.startButton}
        >
          <span className={styles.buttonIcon}>📖</span>
          <span>查看题库</span>
        </button>
      </div>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <p>💡 提示：建议先浏览所有题目，再开始系统练习</p>
      </footer>
    </div>
  );
}
