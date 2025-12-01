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
import QuestionNavigator from "@/components/QuestionNavigator/QuestionNavigator";
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
  // 使用 Map 来存储答题记录，key 为 questionId，确保每个题目只有一条记录
  const [attemptsMap, setAttemptsMap] = useState<Map<string, QuizAttempt>>(
    new Map()
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizMode, setQuizMode] = useState<"exam" | "practice">("practice");

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
  const attempts = Array.from(attemptsMap.values());
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

  // 生成导航数据
  const navigatorAttempts = attempts.reduce((acc, attempt) => {
    // 找到题目在数组中的索引
    const index = questions.findIndex((q) => q.id === attempt.questionId);
    if (index !== -1) {
      acc[index] = attempt.isCorrect;
    }
    return acc;
  }, {} as Record<number, boolean>);

  // 提交答案
  const handleSubmit = (answer: string | boolean = userAnswer) => {
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
    if (answer === "" || answer === null || answer === undefined) {
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
    const isCorrect = checkAnswer(answer, correctAnswer, currentQuestion.type);

    // 记录答题 (更新 Map)
    const attempt: QuizAttempt = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timestamp: Date.now(),
    };

    setAttemptsMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion.id, attempt);
      return newMap;
    });

    setShowFeedback(true);

    // 练习模式逻辑：只有答对才自动跳转
    if (quizMode === "practice" && isCorrect) {
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

  // 跳转到指定题目
  const handleJumpTo = (index: number) => {
    setCurrentIndex(index);
    setUserAnswer("");
    setShowFeedback(false);
  };

  // 处理直接答题（单选/判断）
  const handleDirectAnswer = (answer: string | boolean) => {
    setUserAnswer(answer);
    if (quizMode === "practice") {
      handleSubmit(answer);
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
          <span>⚡ 练习模式：答对自动下一题，答错需手动跳转</span>
        )}
      </div>

      {/* 进度条 */}
      <ProgressBar stats={stats} currentIndex={currentIndex} />

      {/* 题目导航 */}
      <QuestionNavigator
        totalQuestions={questions.length}
        currentIndex={currentIndex}
        onSelectQuestion={handleJumpTo}
        attempts={navigatorAttempts}
      />

      {/* 题目卡片 */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        userAnswer={userAnswer}
        showFeedback={showFeedback}
        onAnswer={handleDirectAnswer}
      />

      {/* 答案输入 (仅填空题) */}
      <AnswerInput
        questionType={currentQuestion.type}
        value={userAnswer}
        onChange={setUserAnswer}
        disabled={showFeedback}
      />

      {/* 反馈显示 */}
      {showFeedback &&
        currentQuestion.type !== QuestionType.SHORT_ANSWER &&
        currentQuestion.type !== QuestionType.CODE && (
          <FeedbackDisplay
            isCorrect={attemptsMap.get(currentQuestion.id)?.isCorrect || false}
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
          <button
            onClick={showFeedback ? handleNext : () => handleSubmit()}
            className={styles.primaryButton}
          >
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
        {quizMode === "practice" && (
          <button onClick={handleNext} className={styles.primaryButton}>
            下一题 →
          </button>
        )}
      </div>

      {/* 返回首页 */}
      <button onClick={() => router.push("/")} className={styles.homeButton}>
        返回首页
      </button>
    </div>
  );
}
