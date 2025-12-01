/**
 * 题目类型枚举
 */
export enum QuestionType {
    SINGLE_CHOICE = 'single_choice',    // 单选题
    FILL_BLANK = 'fill_blank',          // 填空题
    TRUE_FALSE = 'true_false',          // 判断题
    SHORT_ANSWER = 'short_answer',      // 简答题
    CODE = 'code'                       // 代码题
}

/**
 * 基础题目接口
 */
export interface BaseQuestion {
    id: string;                         // 题目唯一标识
    type: QuestionType;                 // 题目类型
    title: string;                      // 题目标题/描述
    section: string;                    // 所属章节（一、二、三...）
}

/**
 * 单选题
 */
export interface SingleChoiceQuestion extends BaseQuestion {
    type: QuestionType.SINGLE_CHOICE;
    options: string[];                  // 选项列表 A, B, C, D
    correctAnswer: string;              // 正确答案（如 "A" 或 "D"）
}

/**
 * 填空题
 */
export interface FillBlankQuestion extends BaseQuestion {
    type: QuestionType.FILL_BLANK;
    correctAnswer: string;              // 正确答案
}

/**
 * 判断题
 */
export interface TrueFalseQuestion extends BaseQuestion {
    type: QuestionType.TRUE_FALSE;
    correctAnswer: boolean;             // 正确答案（true/false）
}

/**
 * 简答题
 */
export interface ShortAnswerQuestion extends BaseQuestion {
    type: QuestionType.SHORT_ANSWER;
    referenceAnswer: string;            // 参考答案
}

/**
 * 代码题
 */
export interface CodeQuestion extends BaseQuestion {
    type: QuestionType.CODE;
    code: string;                       // 代码内容
    language: string;                   // 编程语言（如 bash, python）
    note?: string;                      // 备注说明
}

/**
 * 联合类型：所有题目类型
 */
export type Question =
    | SingleChoiceQuestion
    | FillBlankQuestion
    | TrueFalseQuestion
    | ShortAnswerQuestion
    | CodeQuestion;

/**
 * 用户答题记录
 */
export interface QuizAttempt {
    questionId: string;                 // 题目ID
    userAnswer: string | boolean;       // 用户答案
    isCorrect: boolean;                 // 是否正确
    timestamp: number;                  // 答题时间戳
}

/**
 * 刷题会话状态
 */
export interface QuizSession {
    currentIndex: number;               // 当前题目索引
    attempts: QuizAttempt[];            // 答题记录
    startTime: number;                  // 开始时间
    questions: Question[];              // 题目列表
}

/**
 * 统计数据
 */
export interface QuizStats {
    total: number;                      // 总题数
    answered: number;                   // 已答题数
    correct: number;                    // 正确题数
    accuracy: number;                   // 正确率（百分比）
}
