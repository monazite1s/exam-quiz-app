"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Question,
  QuizAttempt,
  QuizStats,
  QuestionType,
} from "@/types/question";
import { getAllQuestions } from "@/data/question-provider";
import { checkAnswer } from "@/lib/utils/answer-checker";
import QuestionCard from "@/components/QuestionCard/QuestionCard";
import AnswerInput from "@/components/AnswerInput/AnswerInput";
import FeedbackDisplay from "@/components/FeedbackDisplay/FeedbackDisplay";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import styles from "./page.module.css";

/**
 * 刷题页面
 * 核心功能：题目展示、答案提交、即时反馈
 * 新增：练习模式（自动提交）
 */
export default function QuizPage() {
  const router = useRouter();

  // 状态管理
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | boolean>("");
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizMode, setQuizMode] = useState<"exam" | "practice">("practice"); // 默认练习模式

  // 加载题目
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

  // 当前题目
  const currentQuestion = questions[currentIndex];

  // 计算统计数据
  const stats: QuizStats = {
    total: questions.length,
    answered: attempts.length,
    correct: attempts.filter((a) => a.isCorrect).length,
    accuracy:
      attempts.length > 0
        ? Math.round(
            (attempts.filter((a) => a.isCorrect).length / attempts.length) * 100
          )
        : 0,
  };

  // 提交答案
  const handleSubmit = () => {
    if (!currentQuestion) return;

    // 对于主观题，直接跳过
    if (
      currentQuestion.type === QuestionType.SHORT_ANSWER ||
      currentQuestion.type === QuestionType.CODE
    ) {
      handleNext();
      return;
    }

    // 检查是否已作答
    if (userAnswer === "" || userAnswer === null || userAnswer === undefined) {
      alert("请先选择或填写答案！");
      return;
    }

    // 获取正确答案
    let correctAnswer: string | boolean = "";
    if (currentQuestion.type === QuestionType.SINGLE_CHOICE) {
      correctAnswer = currentQuestion.correctAnswer;
    } else if (currentQuestion.type === QuestionType.FILL_BLANK) {
      correctAnswer = currentQuestion.correctAnswer;
    } else if (currentQuestion.type === QuestionType.TRUE_FALSE) {
      correctAnswer = currentQuestion.correctAnswer;
    }

    // 检查答案
    const isCorrect = checkAnswer(
      userAnswer,
      correctAnswer,
      currentQuestion.type
    );

    // 记录答题
    const attempt: QuizAttempt = {
      questionId: currentQuestion.id,
      userAnswer,
      isCorrect,
      timestamp: Date.now(),
    };

    setAttempts([...attempts, attempt]);
    setShowFeedback(true);

    // 练习模式：延迟后自动进入下一题
    if (quizMode === "practice") {
      setTimeout(() => {
        handleNext();
      }, 1500); // 1.5秒后自动下一题
    }
  };

  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowFeedback(false);
    } else {
      // 完成所有题目
      alert(
        `恭喜完成！\n总题数: ${stats.total}\n正确: ${stats.correct}\n正确率: ${stats.accuracy}%`
      );
      router.push("/");
    }
  };

  // 上一题
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer("");
      setShowFeedback(false);
    }
  };

  // 处理答案变化（练习模式自动提交）
  const handleAnswerChange = (value: string | boolean) => {
    setUserAnswer(value);

    // 练习模式：单选题和判断题自动提交
    if (quizMode === "practice" && !showFeedback) {
      if (
        currentQuestion.type === QuestionType.SINGLE_CHOICE ||
        currentQuestion.type === QuestionType.TRUE_FALSE
      ) {
        // 延迟一点点，让用户看到选择效果
        setTimeout(() => {
          const tempAnswer = value;
          let correctAnswer: string | boolean = "";
          if (currentQuestion.type === QuestionType.SINGLE_CHOICE) {
            correctAnswer = currentQuestion.correctAnswer;
          } else if (currentQuestion.type === QuestionType.TRUE_FALSE) {
            correctAnswer = currentQuestion.correctAnswer;
          }

          const isCorrect = checkAnswer(
            tempAnswer,
            correctAnswer,
            currentQuestion.type
          );
          const attempt: QuizAttempt = {
            questionId: currentQuestion.id,
            userAnswer: tempAnswer,
            isCorrect,
            timestamp: Date.now(),
          };

          setAttempts([...attempts, attempt]);
          setShowFeedback(true);

          // 自动进入下一题
          setTimeout(() => {
            handleNext();
          }, 1500);
        }, 200);
      }
    }
  };

  // 处理回车键（填空题）
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && quizMode === "practice" && !showFeedback) {
      if (currentQuestion.type === QuestionType.FILL_BLANK) {
        handleSubmit();
      }
    }
  };

  // 加载中
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>加载题库中...</p>
      </div>
    );
  }

  // 无题目
  if (questions.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>暂无题目</h2>
        <p>
          请先运行 <code>node scripts/parse-exam.js</code> 生成题库
        </p>
        <button onClick={() => router.push("/")} className={styles.backButton}>
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container} onKeyPress={handleKeyPress}>
      {/* 模式切换 */}
      <div className={styles.modeSwitch}>
        <button
          className={`${styles.modeButton} ${
            quizMode === "exam" ? styles.active : ""
          }`}
          onClick={() => setQuizMode("exam")}
        >
          📝 考试模式
        </button>
        <button
          className={`${styles.modeButton} ${
            quizMode === "practice" ? styles.active : ""
          }`}
          onClick={() => setQuizMode("practice")}
        >
          ⚡ 练习模式
        </button>
      </div>

      {/* 模式说明 */}
      <div className={styles.modeHint}>
        {quizMode === "exam" ? (
          <span>📝 考试模式：手动提交答案，适合模拟考试</span>
        ) : (
          <span>⚡ 练习模式：选择后自动提交，快速刷题</span>
        )}
      </div>

      {/* 进度条 */}
      <ProgressBar stats={stats} currentIndex={currentIndex} />

      {/* 题目卡片 */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
      />

      {/* 答案输入 */}
      <AnswerInput
        questionType={currentQuestion.type}
        value={userAnswer}
        onChange={handleAnswerChange}
        disabled={showFeedback}
      />

      {/* 反馈显示 */}
      {showFeedback &&
        currentQuestion.type !== QuestionType.SHORT_ANSWER &&
        currentQuestion.type !== QuestionType.CODE && (
          <FeedbackDisplay
            isCorrect={attempts[attempts.length - 1]?.isCorrect || false}
            correctAnswer={
              currentQuestion.type === QuestionType.SINGLE_CHOICE
                ? currentQuestion.correctAnswer
                : currentQuestion.type === QuestionType.FILL_BLANK
                ? currentQuestion.correctAnswer
                : currentQuestion.type === QuestionType.TRUE_FALSE
                ? currentQuestion.correctAnswer
                : ""
            }
            userAnswer={userAnswer}
          />
        )}

      {/* 操作按钮 */}
      <div className={styles.actions}>
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={styles.secondaryButton}
        >
          ← 上一题
        </button>

        {quizMode === "exam" && !showFeedback ? (
          <button onClick={handleSubmit} className={styles.primaryButton}>
            {currentQuestion.type === QuestionType.SHORT_ANSWER ||
            currentQuestion.type === QuestionType.CODE
              ? "下一题"
              : "提交答案"}
          </button>
        ) : quizMode === "exam" && showFeedback ? (
          <button onClick={handleNext} className={styles.primaryButton}>
            {currentIndex < questions.length - 1 ? "下一题 →" : "完成"}
          </button>
        ) : null}
      </div>

      {/* 返回首页 */}
      <button onClick={() => router.push("/")} className={styles.homeButton}>
        返回首页
      </button>
    </div>
  );
}
