const fs = require('fs');
const path = require('path');

/**
 * 代码题解析器
 */
function parseCode(examDir) {
    const filePath = path.join(examDir, 'code.txt');
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.replace(/\r$/, ''));

    const questions = [];
    let i = 0;
    let questionNumber = 0;

    while (i < lines.length) {
        const line = lines[i];

        // 匹配题目行：1. 题目：xxx (注意有空格)
        const match = line.match(/^(\d+)\.\s*题目[：:](.*)/);
        if (match) {
            questionNumber++;
            const title = match[2].trim();

            // 收集代码内容
            let code = '';
            let language = 'bash';
            i++;

            // 跳过空行
            while (i < lines.length && !lines[i].trim()) {
                i++;
            }

            // 收集代码直到遇到下一题或备注
            const codeLines = [];
            while (i < lines.length) {
                const nextLine = lines[i];
                const trimmed = nextLine.trim();

                // 检查是否到下一题（数字.题目：）
                if (trimmed.match(/^\d+\.\s*题目[：:]/)) {
                    break;
                }
                // 检查是否到备注
                if (trimmed.startsWith('备注：')) {
                    break;
                }

                codeLines.push(nextLine);
                i++;
            }

            code = codeLines.join('\n').trim();

            // 检测语言
            if (code.includes('import ') || code.includes('def ') || code.includes('class ')) {
                language = 'python';
            } else if (code.includes('#!/bin/bash')) {
                language = 'bash';
            }

            questions.push({
                id: `code_${questionNumber}`,
                type: 'code',
                section: '五、代码题',
                title,
                code,
                language,
                note: '请查资料补全代码注释'
            });
        } else {
            i++;
        }
    }

    return questions;
}

module.exports = parseCode;
