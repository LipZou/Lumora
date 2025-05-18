// ✅ colorUtils.js
// 工具函数：提取 dominant colors + 匹配系统色表

import { colorDB } from '../data/colorDB';

/**
 * 欧几里得色差计算
 */
function colorDistance(rgb1, rgb2) {
    return Math.sqrt(
        (rgb1[0] - rgb2[0]) ** 2 +
        (rgb1[1] - rgb2[1]) ** 2 +
        (rgb1[2] - rgb2[2]) ** 2
    );
}

/**
 * 从图像中提取主要颜色（K-Means 聚类）
 * @param {string} base64 - 图像 base64
 * @param {number} clusterCount - 聚类数量
 */
export async function extractDominantColors(base64, clusterCount = 8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = [];
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                pixels.push([r, g, b]);
            }

            // K-Means 聚类核心逻辑
            const centers = pixels.slice(0, clusterCount); // 初始中心
            const assignments = new Array(pixels.length);
            for (let iter = 0; iter < 5; iter++) {
                // 分配阶段
                for (let i = 0; i < pixels.length; i++) {
                    let minDist = Infinity;
                    for (let c = 0; c < centers.length; c++) {
                        const dist = colorDistance(pixels[i], centers[c]);
                        if (dist < minDist) {
                            minDist = dist;
                            assignments[i] = c;
                        }
                    }
                }
                // 更新中心
                const newCenters = Array.from({ length: clusterCount }, () => [0, 0, 0, 0]);
                for (let i = 0; i < pixels.length; i++) {
                    const c = assignments[i];
                    newCenters[c][0] += pixels[i][0];
                    newCenters[c][1] += pixels[i][1];
                    newCenters[c][2] += pixels[i][2];
                    newCenters[c][3]++;
                }
                for (let c = 0; c < clusterCount; c++) {
                    if (newCenters[c][3] > 0) {
                        centers[c] = [
                            Math.round(newCenters[c][0] / newCenters[c][3]),
                            Math.round(newCenters[c][1] / newCenters[c][3]),
                            Math.round(newCenters[c][2] / newCenters[c][3]),
                        ];
                    }
                }
            }

            resolve(centers);
        };
    });
}

/**
 * 将颜色与系统色表匹配，分成新颜色和已有颜色
 */
export function matchColorsWithDatabase(dominantColors, threshold = 30) {
    const newColors = [];
    const existingColors = [];

    dominantColors.forEach((color) => {
        let matched = false;
        for (const dbColor of colorDB) {
            if (colorDistance(color, dbColor.rgb) < threshold) {
                existingColors.push({ ...dbColor, rgb: dbColor.rgb });
                matched = true;
                break;
            }
        }
        if (!matched) {
            newColors.push({ id: 'NEW', name: 'New Color', rgb: color });
        }
    });

    return { newColors, existingColors };
}
