const fs = require('fs');
const path = require('path');

/**
 * 单选题解析器
 */
function parseSingleChoice(examDir) {
    const filePath = path.join(examDir, 'single.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.replace(/\r$/, ''));

    const questions = [];
    let i = 0;
    let questionNumber = 0;

    while (i < lines.length) {
        const line = lines[i].trim();
        if (!line) {
            i++;
            continue;
        }

        // 匹配题目行：1.题目内容？ D 或 1.题目内容？D
        const match = line.match(/^(\d+)\.(.*?)\s*([A-D])\s*$/);
        if (match) {
            questionNumber++;
            const title = match[2].trim();
            const correctAnswer = match[3];

            // 收集选项
            const options = [];
            i++;

            // 跳过空行
            while (i < lines.length && !lines[i].trim()) {
                i++;
            }

            // 收集所有选项行
            while (i < lines.length) {
                const optLine = lines[i].trim();
                if (!optLine) {
                    i++;
                    break; // 空行表示选项结束
                }

                // 检查是否是选项行（A. B. C. D.开头）
                if (optLine.match(/^[A-D]\./)) {
                    // 检查是否包含多个选项（例如一行内有 A. xxx B. xxx）
                    // 使用正则分割：空白字符后跟 [A-D].
                    const parts = optLine.split(/\s+(?=[A-D]\.)/);
                    if (parts.length > 1) {
                        options.push(...parts);
                    } else {
                        options.push(optLine);
                    }
                    i++;
                } else if (optLine.match(/^\d+\./)) {
                    // 遇到下一题
                    break;
                } else {
                    i++;
                }
            }

            questions.push({
                id: `single_${questionNumber}`,
                type: 'single_choice',
                section: '一、选择题',
                title,
                options,
                correctAnswer
            });
        } else {
            i++;
        }
    }

    return questions;
}

module.exports = parseSingleChoice;
