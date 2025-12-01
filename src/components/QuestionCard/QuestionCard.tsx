"use client";

import React from "react";
import { Question, QuestionType } from "@/types/question";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

/**
 * 题目卡片组件
 * 根据题目类型展示不同的内容
 */
export default function QuestionCard({
  question,
  questionNumber,
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
        {question.options.map((option, index) => (
          <div key={index} className={styles.option}>
            {option}
          </div>
        ))}
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
