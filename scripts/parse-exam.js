const fs = require('fs');
const path = require('path');

// 导入各个解析器
const parseSingleChoice = require('./parsers/single-choice');
const parseFillBlank = require('./parsers/fill-blank');
const parseTrueFalse = require('./parsers/true-false');
const parseShortAnswer = require('./parsers/short-answer');
const parseCode = require('./parsers/code');

/**
 * 题库解析主入口
 * 功能：调用各个解析器，生成分离和合并的JSON文件
 */

// 配置路径
const EXAM_DIR = path.join(__dirname, '..', 'exam');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'questions.json');

/**
 * 主解析函数
 */
function parseAllQuestions() {
    console.log('📖 开始解析题库文件...\n');

    // 确保输出目录存在
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const results = {};

    // 1. 解析单选题
    console.log('📂 解析单选题...');
    try {
        results.singleChoice = parseSingleChoice(EXAM_DIR);
        console.log(`  ✓ 成功解析 ${results.singleChoice.length} 道题目`);
        // 保存到单独文件
        fs.writeFileSync(
            path.join(DATA_DIR, 'single-choice.json'),
            JSON.stringify(results.singleChoice, null, 2),
            'utf-8'
        );
    } catch (error) {
        console.error('  ✗ 解析失败:', error.message);
        results.singleChoice = [];
    }
    console.log('');

    // 2. 解析填空题
    console.log('📂 解析填空题...');
    try {
        results.fillBlank = parseFillBlank(EXAM_DIR);
        console.log(`  ✓ 成功解析 ${results.fillBlank.length} 道题目`);
        fs.writeFileSync(
            path.join(DATA_DIR, 'fill-blank.json'),
            JSON.stringify(results.fillBlank, null, 2),
            'utf-8'
        );
    } catch (error) {
        console.error('  ✗ 解析失败:', error.message);
        results.fillBlank = [];
    }
    console.log('');

    // 3. 解析判断题
    console.log('📂 解析判断题...');
    try {
        results.trueFalse = parseTrueFalse(EXAM_DIR);
        console.log(`  ✓ 成功解析 ${results.trueFalse.length} 道题目`);
        fs.writeFileSync(
            path.join(DATA_DIR, 'true-false.json'),
            JSON.stringify(results.trueFalse, null, 2),
            'utf-8'
        );
    } catch (error) {
        console.error('  ✗ 解析失败:', error.message);
        results.trueFalse = [];
    }
    console.log('');

    // 4. 解析简答题
    console.log('📂 解析简答题...');
    try {
        results.shortAnswer = parseShortAnswer(EXAM_DIR);
        console.log(`  ✓ 成功解析 ${results.shortAnswer.length} 道题目`);
        fs.writeFileSync(
            path.join(DATA_DIR, 'short-answer.json'),
            JSON.stringify(results.shortAnswer, null, 2),
            'utf-8'
        );
    } catch (error) {
        console.error('  ✗ 解析失败:', error.message);
        results.shortAnswer = [];
    }
    console.log('');

    // 5. 解析代码题
    console.log('📂 解析代码题...');
    try {
        results.code = parseCode(EXAM_DIR);
        console.log(`  ✓ 成功解析 ${results.code.length} 道题目`);
        fs.writeFileSync(
            path.join(DATA_DIR, 'code.json'),
            JSON.stringify(results.code, null, 2),
            'utf-8'
        );
    } catch (error) {
        console.error('  ✗ 解析失败:', error.message);
        results.code = [];
    }
    console.log('');

    // 6. 合并所有题目
    console.log('📦 合并所有题目...');
    const allQuestions = [
        ...results.singleChoice,
        ...results.fillBlank,
        ...results.trueFalse,
        ...results.shortAnswer,
        ...results.code
    ];

    // 写入合并的JSON文件
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allQuestions, null, 2), 'utf-8');
    console.log(`  ✓ 已生成合并文件: ${OUTPUT_FILE}`);

    // 7. 统计信息
    console.log('\n📊 解析统计:');
    console.log(`  总题数: ${allQuestions.length}`);
    console.log(`  单选题: ${results.singleChoice.length}`);
    console.log(`  填空题: ${results.fillBlank.length}`);
    console.log(`  判断题: ${results.trueFalse.length}`);
    console.log(`  简答题: ${results.shortAnswer.length}`);
    console.log(`  代码题: ${results.code.length}`);

    console.log('\n✅ 题库解析完成！\n');

    return allQuestions;
}

// 执行解析
try {
    parseAllQuestions();
} catch (error) {
    console.error('❌ 解析过程出错:', error.message);
    console.error(error.stack);
    process.exit(1);
}
