const fs = require('fs');
const path = require('path');

/**
 * 判断题解析器
 */
function parseTrueFalse(examDir) {
    const filePath = path.join(examDir, 'tf.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.replace(/\r$/, '').trim());

    const questions = [];
    let questionNumber = 0;

    for (const line of lines) {
        if (!line) continue;

        // 匹配格式：1. 题目内容。 ( √) 或 (× ) 或 （√） 或 （×）
        const match = line.match(/^(\d+)\.\s*(.*?)\s*[（(]\s*([√×])\s*[）)]/);
        if (match) {
            questionNumber++;
            const title = match[2].trim();
            const correctAnswer = match[3] === '√';

            questions.push({
                id: `tf_${questionNumber}`,
                type: 'true_false',
                section: '三、判断题',
                title,
                correctAnswer
            });
        }
    }

    return questions;
}

module.exports = parseTrueFalse;
