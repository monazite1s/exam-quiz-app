"use client";

import React from "react";
import { QuestionType } from "@/types/question";
import styles from "./AnswerInput.module.css";

interface AnswerInputProps {
  questionType: QuestionType;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  disabled?: boolean;
}

/**
 * 答案输入组件
 * 根据题目类型渲染不同的输入方式
 */
export default function AnswerInput({
  questionType,
  value,
  onChange,
  disabled = false,
}: AnswerInputProps) {
  // 单选题输入
  if (questionType === QuestionType.SINGLE_CHOICE) {
    return (
      <div className={styles.inputGroup}>
        <label className={styles.label}>请选择答案：</label>
        <div className={styles.radioGroup}>
          {["A", "B", "C", "D"].map((option) => (
            <button
              key={option}
              className={`${styles.radioButton} ${
                value === option ? styles.selected : ""
              }`}
              onClick={() => onChange(option)}
              disabled={disabled}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 填空题输入
  if (questionType === QuestionType.FILL_BLANK) {
    return (
      <div className={styles.inputGroup}>
        <label className={styles.label}>请填写答案：</label>
        <input
          type="text"
          className={styles.textInput}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="请输入答案..."
        />
      </div>
    );
  }

  // 判断题输入
  if (questionType === QuestionType.TRUE_FALSE) {
    return (
      <div className={styles.inputGroup}>
        <label className={styles.label}>请判断：</label>
        <div className={styles.booleanGroup}>
          <button
            className={`${styles.booleanButton} ${styles.correct} ${
              value === true ? styles.selected : ""
            }`}
            onClick={() => onChange(true)}
            disabled={disabled}
            type="button"
          >
            <span className={styles.icon}>✓</span>
            <span>正确</span>
          </button>
          <button
            className={`${styles.booleanButton} ${styles.incorrect} ${
              value === false ? styles.selected : ""
            }`}
            onClick={() => onChange(false)}
            disabled={disabled}
            type="button"
          >
            <span className={styles.icon}>✗</span>
            <span>错误</span>
          </button>
        </div>
      </div>
    );
  }

  // 简答题和代码题（仅展示，不需要输入）
  if (
    questionType === QuestionType.SHORT_ANSWER ||
    questionType === QuestionType.CODE
  ) {
    return (
      <div className={styles.inputGroup}>
        <div className={styles.infoBox}>
          <span className={styles.infoIcon}>ℹ️</span>
          <span>此题为主观题，请查看参考答案自行学习</span>
        </div>
      </div>
    );
  }

  return null;
}
