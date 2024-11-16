// 引入必要的模块
const express = require('express');
const bodyParser = require('body-parser');

// 创建 Express 应用
const app = express();

// 存储最新的位置信息
let latestLocation = { latitude: 0, longitude: 0 };

// 使用 body-parser 中间件来解析 JSON 请求体
app.use(bodyParser.json());

// POST 请求接口，用于更新位置
app.post('/api/update-location', (req, res) => {
    const { latitude, longitude, password } = req.body;

    // 从环境变量中读取密码并验证
    if (!password || password !== process.env.PASSWORD) {
        return res.status(404).send({ message: '密码错误或未提供密码' });
    }

    // 更新位置数据
    latestLocation = { latitude, longitude };

    res.status(200).send({ message: '位置更新成功' });
});

// GET 请求接口，返回最新的位置信息
app.get('/api/location', (req, res) => {
    res.status(200).json(latestLocation);
});

// 设置服务器监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器正在运行，端口号：${PORT}`);
});