import questionsData from './questions.json';
import { Question, QuestionType } from '../types/question';

/**
 * 题库数据访问接口
 */

/**
 * 获取所有题目
 * @returns Promise<Question[]> 所有题目列表
 */
export async function getAllQuestions(): Promise<Question[]> {
    return questionsData as Question[];
}

/**
 * 根据 ID 获取题目
 * @param id 题目ID
 * @returns Promise<Question | null> 题目对象或null
 */
export async function getQuestionById(id: string): Promise<Question | null> {
    const questions = await getAllQuestions();
    return questions.find(q => q.id === id) || null;
}

/**
 * 根据类型获取题目
 * @param type 题目类型
 * @returns Promise<Question[]> 指定类型的题目列表
 */
export async function getQuestionsByType(type: QuestionType): Promise<Question[]> {
    const questions = await getAllQuestions();
    return questions.filter(q => q.type === type);
}

/**
 * 根据章节获取题目
 * @param section 章节名称
 * @returns Promise<Question[]> 指定章节的题目列表
 */
export async function getQuestionsBySection(section: string): Promise<Question[]> {
    const questions = await getAllQuestions();
    return questions.filter(q => q.section === section);
}

/**
 * 获取随机题目
 * @param count 题目数量
 * @returns Promise<Question[]> 随机题目列表
 */
export async function getRandomQuestions(count: number): Promise<Question[]> {
    const questions = await getAllQuestions();
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 获取题库统计信息
 * @returns Promise<object> 统计信息
 */
export async function getQuestionStats() {
    const questions = await getAllQuestions();

    return {
        total: questions.length,
        byType: {
            single_choice: questions.filter(q => q.type === QuestionType.SINGLE_CHOICE).length,
            fill_blank: questions.filter(q => q.type === QuestionType.FILL_BLANK).length,
            true_false: questions.filter(q => q.type === QuestionType.TRUE_FALSE).length,
            short_answer: questions.filter(q => q.type === QuestionType.SHORT_ANSWER).length,
            code: questions.filter(q => q.type === QuestionType.CODE).length,
        },
        sections: Array.from(new Set(questions.map(q => q.section)))
    };
}
