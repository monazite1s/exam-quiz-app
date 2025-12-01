import { QuestionType } from '@/types/question';

/**
 * 答案校验工具
 */

/**
 * 检查答案是否正确
 * @param userAnswer 用户答案
 * @param correctAnswer 正确答案
 * @param type 题目类型
 * @returns boolean 是否正确
 */
export function checkAnswer(
    userAnswer: string | boolean,
    correctAnswer: string | boolean,
    type: QuestionType
): boolean {
    switch (type) {
        case QuestionType.SINGLE_CHOICE:
            // 单选题：不区分大小写
            return String(userAnswer).trim().toUpperCase() === String(correctAnswer).trim().toUpperCase();

        case QuestionType.FILL_BLANK:
            // 填空题：不区分大小写，去除首尾空格
            return String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

        case QuestionType.TRUE_FALSE:
            // 判断题：布尔值比较
            return Boolean(userAnswer) === Boolean(correctAnswer);

        case QuestionType.SHORT_ANSWER:
        case QuestionType.CODE:
            // 简答题和代码题：仅作为参考，不自动判题
            return false;

        default:
            return false;
    }
}

/**
 * 格式化用户答案用于显示
 * @param answer 答案
 * @param type 题目类型
 * @returns string 格式化后的答案
 */
export function formatAnswer(answer: string | boolean, type: QuestionType): string {
    if (type === QuestionType.TRUE_FALSE) {
        return answer ? '正确 (√)' : '错误 (×)';
    }
    return String(answer);
}

/**
 * 计算正确率
 * @param correct 正确题数
 * @param total 总题数
 * @returns number 正确率（百分比）
 */
export function calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}
