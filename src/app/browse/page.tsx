"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, QuestionType } from "@/types/question";
import { getAllQuestions } from "@/data/question-provider";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./page.module.css";

/**
 * 题库浏览页面
 * 功能：展示所有题目，支持按章节分组和题型筛选
 */
export default function BrowsePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await getAllQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("加载题目失败:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  // 筛选题目
  const filteredQuestions =
    filter === "all" ? questions : questions.filter((q) => q.type === filter);

  // 按章节分组
  const groupedQuestions = filteredQuestions.reduce((acc, question) => {
    const section = question.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>加载题库中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <h1 className={styles.title}>📚 题库浏览</h1>
        <p className={styles.subtitle}>共 {questions.length} 道题目</p>
      </div>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterButton} ${
            filter === "all" ? styles.active : ""
          }`}
          onClick={() => setFilter("all")}
        >
          全部题目 ({questions.length})
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === "single_choice" ? styles.active : ""
          }`}
          onClick={() => setFilter("single_choice")}
        >
          单选题 (
          {
            questions.filter((q) => q.type === QuestionType.SINGLE_CHOICE)
              .length
          }
          )
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === "fill_blank" ? styles.active : ""
          }`}
          onClick={() => setFilter("fill_blank")}
        >
          填空题 (
          {questions.filter((q) => q.type === QuestionType.FILL_BLANK).length})
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === "true_false" ? styles.active : ""
          }`}
          onClick={() => setFilter("true_false")}
        >
          判断题 (
          {questions.filter((q) => q.type === QuestionType.TRUE_FALSE).length})
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === "short_answer" ? styles.active : ""
          }`}
          onClick={() => setFilter("short_answer")}
        >
          简答题 (
          {questions.filter((q) => q.type === QuestionType.SHORT_ANSWER).length}
          )
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === "code" ? styles.active : ""
          }`}
          onClick={() => setFilter("code")}
        >
          代码题 ({questions.filter((q) => q.type === QuestionType.CODE).length}
          )
        </button>
      </div>

      {/* 题目列表 */}
      <div className={styles.questionList}>
        {Object.entries(groupedQuestions).map(([section, sectionQuestions]) => (
          <div key={section} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section}</h2>
            {sectionQuestions.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                number={index + 1}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 返回首页 */}
      <button onClick={() => router.push("/")} className={styles.backButton}>
        返回首页
      </button>
    </div>
  );
}

/**
 * 题目项组件
 */
function QuestionItem({
  question,
  number,
}: {
  question: Question;
  number: number;
}) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className={styles.questionItem}>
      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>{number}.</span>
        <span className={styles.questionTitle}>{question.title}</span>
      </div>

      {/* 选择题选项 */}
      {question.type === QuestionType.SINGLE_CHOICE && (
        <div className={styles.options}>
          {question.options.map((option, idx) => (
            <div key={idx} className={styles.option}>
              {option}
            </div>
          ))}
        </div>
      )}

      {/* 答案折叠 */}
      <details
        className={styles.answerDetails}
        open={showAnswer}
        onToggle={(e) => setShowAnswer((e.target as HTMLDetailsElement).open)}
      >
        <summary className={styles.answerSummary}>
          {showAnswer ? "▼ 隐藏答案" : "▶ 查看答案"}
        </summary>
        <div className={styles.answerContent}>
          {question.type === QuestionType.SINGLE_CHOICE && (
            <p>
              <strong>正确答案：</strong>
              {question.correctAnswer}
            </p>
          )}
          {question.type === QuestionType.FILL_BLANK && (
            <p>
              <strong>答案：</strong>
              {question.correctAnswer}
            </p>
          )}
          {question.type === QuestionType.TRUE_FALSE && (
            <p>
              <strong>答案：</strong>
              {question.correctAnswer ? "正确 (√)" : "错误 (×)"}
            </p>
          )}
          {question.type === QuestionType.SHORT_ANSWER &&
            question.referenceAnswer && (
              <div>
                <p>
                  <strong>参考答案：</strong>
                </p>
                <pre className={styles.answerText}>
                  {question.referenceAnswer}
                </pre>
              </div>
            )}
          {question.type === QuestionType.CODE && question.code && (
            <div>
              <p>
                <strong>参考代码：</strong>
              </p>
              <SyntaxHighlighter
                language={question.language || "text"}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                }}
                showLineNumbers
              >
                {question.code}
              </SyntaxHighlighter>
              {question.note && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "0.9rem",
                    color: "#888",
                  }}
                >
                  📝 {question.note}
                </p>
              )}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
