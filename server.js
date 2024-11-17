// 引入必要的模块
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// 创建 Express 应用
const app = express();

// 启用 CORS
app.use(cors());  // 允许所有源访问，如果需要，可以限制特定域

app.use(express.json());

// 存储最新的位置信息
let latestLocation = { latitude: 0, longitude: 0 };

// 使用 body-parser 中间件来解析 JSON 请求体
app.use(bodyParser.json());

app.head('/heartbeat', (req, res) => {
    const currentTime = new Date().toISOString();
    console.log(`Heartbeat at: ${currentTime}`);
    res.status(200).end();
});

// POST 请求接口，用于更新位置
app.post('/api/update-location', (req, res) => {
    const { latitude, longitude, password } = req.body;

    // 从环境变量中读取密码并验证
    if (!password || password !== process.env.PASSWORD) {
        return res.status(404).send({success: false, message: '密码错误或未提供密码' });
    }

    // 更新位置数据
    latestLocation = { latitude, longitude };

    res.status(200).send({ success: true, message: '位置更新成功' });
});

// GET 请求接口，返回最新的位置信息
app.get('/api/location', (req, res) => {
    res.status(200).json(latestLocation);
});

// 设置服务器监听端口
const PORT = 3456;
app.listen(PORT, () => {
    console.log(`服务器正在运行，端口号：${PORT}`);
});
