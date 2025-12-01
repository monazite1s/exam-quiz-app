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
 * 仅处理填空题输入，其他题型在QuestionCard中直接交互
 */
export default function AnswerInput({
  questionType,
  value,
  onChange,
  disabled = false,
}: AnswerInputProps) {
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

  // 其他题型不需要额外的输入区域
  return null;
}
