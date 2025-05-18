import axios from 'axios';

// 获取颜色
const getUserColors = async (userId) => {
    const res = await axios.get(`/api/colors/${userId}`);
    return res.data;
};

// 添加颜色
const addUserColor = async (userId, color) => {
    await axios.post(`/api/colors/${userId}`, color);
};

export { getUserColors, addUserColor };