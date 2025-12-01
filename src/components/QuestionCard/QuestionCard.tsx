"use client";

import React from "react";
import { Question, QuestionType } from "@/types/question";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  userAnswer?: string | boolean;
  showFeedback?: boolean;
  onAnswer?: (answer: string | boolean) => void;
}

/**
 * 题目卡片组件
 * 根据题目类型展示不同的内容
 * 支持直接点击选项答题
 */
export default function QuestionCard({
  question,
  questionNumber,
  userAnswer,
  showFeedback,
  onAnswer,
}: QuestionCardProps) {
  // 渲染题目类型标签
  const renderTypeLabel = () => {
    const typeLabels = {
      [QuestionType.SINGLE_CHOICE]: "单选题",
      [QuestionType.FILL_BLANK]: "填空题",
      [QuestionType.TRUE_FALSE]: "判断题",
      [QuestionType.SHORT_ANSWER]: "简答题",
      [QuestionType.CODE]: "代码题",
    };

    return (
      <span className={`${styles.typeLabel} ${styles[question.type]}`}>
        {typeLabels[question.type]}
      </span>
    );
  };

  // 渲染单选题选项
  const renderOptions = () => {
    if (question.type !== QuestionType.SINGLE_CHOICE) return null;

    return (
      <div className={styles.options}>
        {question.options.map((option, index) => {
          // 提取选项字母 (A, B, C, D)
          const letter = option.charAt(0);
          const isSelected = userAnswer === letter;

          let statusClass = "";
          if (showFeedback) {
            if (letter === question.correctAnswer) {
              statusClass = styles.correct;
            } else if (isSelected && letter !== question.correctAnswer) {
              statusClass = styles.incorrect;
            }
          } else if (isSelected) {
            statusClass = styles.selected;
          }

          return (
            <button
              key={index}
              className={`${styles.option} ${statusClass}`}
              onClick={() => onAnswer && !showFeedback && onAnswer(letter)}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  };

  // 渲染判断题按钮
  const renderTrueFalse = () => {
    if (question.type !== QuestionType.TRUE_FALSE) return null;

    const renderButton = (
      value: boolean,
      label: string,
      icon: string,
      typeClass: string
    ) => {
      const isSelected = userAnswer === value;
      let statusClass = "";

      if (showFeedback) {
        if (value === question.correctAnswer) {
          statusClass = styles.correct;
        } else if (isSelected && value !== question.correctAnswer) {
          statusClass = styles.incorrect;
        }
      } else if (isSelected) {
        statusClass = styles.selected;
      }

      return (
        <button
          className={`${styles.booleanButton} ${styles[typeClass]} ${statusClass}`}
          onClick={() => onAnswer && !showFeedback && onAnswer(value)}
          disabled={showFeedback}
        >
          <span className={styles.icon}>{icon}</span>
          <span>{label}</span>
        </button>
      );
    };

    return (
      <div className={styles.booleanGroup}>
        {renderButton(true, "正确", "✓", "true")}
        {renderButton(false, "错误", "✗", "false")}
      </div>
    );
  };

  // 渲染代码块
  const renderCode = () => {
    if (question.type !== QuestionType.CODE) return null;

    return (
      <div className={styles.codeBlock}>
        <SyntaxHighlighter
          language={question.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
          }}
          showLineNumbers
        >
          {question.code}
        </SyntaxHighlighter>
        {question.note && (
          <div className={styles.codeNote}>
            <span>📝</span> {question.note}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.card}>
      {/* 题目头部 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.questionNumber}>第 {questionNumber} 题</span>
          {renderTypeLabel()}
        </div>
        <span className={styles.section}>{question.section}</span>
      </div>

      {/* 题目内容 */}
      <div className={styles.content}>
        <h3 className={styles.title}>{question.title}</h3>

        {/* 根据题型渲染不同内容 */}
        {renderOptions()}
        {renderTrueFalse()}
        {renderCode()}

        {/* 简答题参考答案（默认隐藏） */}
        {question.type === QuestionType.SHORT_ANSWER &&
          question.referenceAnswer && (
            <details className={styles.referenceAnswer}>
              <summary>查看参考答案</summary>
              <div className={styles.answerContent}>
                {question.referenceAnswer.split("\\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </details>
          )}
      </div>
    </div>
  );
}
