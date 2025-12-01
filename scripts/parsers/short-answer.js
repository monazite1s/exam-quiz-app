const fs = require('fs');
const path = require('path');

/**
 * 简答题解析器
 */
function parseShortAnswer(examDir) {
    const filePath = path.join(examDir, 'short.txt');
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.replace(/\r$/, ''));

    const questions = [];
    let i = 0;
    let questionNumber = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        const match = line.match(/^(\d+)\.\s*(.*)/);
        if (match && !line.startsWith('答案') && !line.startsWith('参考答案')) {
            questionNumber++;
            const title = match[2].trim();

            // 收集参考答案
            let referenceAnswer = '';
            i++;
            while (i < lines.length) {
                const nextLine = lines[i].trim();
                if (nextLine.match(/^\d+\./)) {
                    break;
                }
                if (nextLine.startsWith('答案：') || nextLine.startsWith('参考答案：')) {
                    referenceAnswer = nextLine.replace(/^(答案：|参考答案：)/, '').trim();
                    i++;
                    // 继续收集多行答案
                    while (i < lines.length) {
                        const ansLine = lines[i].trim();
                        if (ansLine.match(/^\d+\./) || ansLine.startsWith('答案：') || ansLine.startsWith('参考答案：')) {
                            break;
                        }
                        if (ansLine) {
                            referenceAnswer += '\n' + ansLine;
                        }
                        i++;
                    }
                    break;
                }
                i++;
            }

            questions.push({
                id: `short_${questionNumber}`,
                type: 'short_answer',
                section: '四、简答题',
                title,
                referenceAnswer
            });
        } else {
            i++;
        }
    }

    return questions;
}

module.exports = parseShortAnswer;
