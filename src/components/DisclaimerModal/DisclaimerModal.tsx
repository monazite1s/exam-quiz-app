"use client";

import React, { useState } from "react";
import styles from "./DisclaimerModal.module.css";

/**
 * 免责声明弹窗组件
 * 首次访问时显示,关闭后使用 localStorage 记录,不再显示
 */
export default function DisclaimerModal() {
  // 使用 lazy initialization 避免在 effect 中 setState
  const [isVisible, setIsVisible] = useState(() => {
    // 在初始化时检查 localStorage
    if (typeof window !== "undefined") {
      const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
      return !hasSeenDisclaimer;
    }
    return false;
  });

  const handleClose = () => {
    // 记录用户已看过免责声明
    localStorage.setItem("hasSeenDisclaimer", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚠️ 免责声明</h2>
        </div>
        <div className={styles.content}>
          <p>
            题库中的代码题存在部分格式错误,我们已使用 AI 工具尝试修复这些问题。
          </p>
          <p>
            <strong>建议:</strong>{" "}
            请将本系统的答案与原始题库对照查看,以确保学习效果。
          </p>
          <p className={styles.note}>
            本系统仅供学习参考使用,不保证内容的完全准确性。
          </p>
        </div>
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={handleClose}>
            我已了解
          </button>
        </div>
      </div>
    </div>
  );
}
