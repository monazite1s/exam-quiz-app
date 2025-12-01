const fs = require('fs');
const path = require('path');

/**
 * 填空题解析器
 */
function parseFillBlank(examDir) {
    const filePath = path.join(examDir, 'fill.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.replace(/\r$/, '').trim());

    const questions = [];
    let i = 0;
    let questionNumber = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (!line || line.startsWith('答案：')) {
            i++;
            continue;
        }

        const match = line.match(/^(\d+)\.(.*)/);
        if (match) {
            questionNumber++;
            const title = match[2].trim();

            // 下一行应该是答案
            i++;
            let correctAnswer = '';
            if (i < lines.length && lines[i].startsWith('答案：')) {
                correctAnswer = lines[i].replace('答案：', '').trim();
            }

            questions.push({
                id: `fill_${questionNumber}`,
                type: 'fill_blank',
                section: '二、填空题',
                title,
                correctAnswer
            });

            i++;
        } else {
            i++;
        }
    }

    return questions;
}

module.exports = parseFillBlank;
