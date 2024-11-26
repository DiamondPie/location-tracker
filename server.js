// 引入必要的模块
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// 创建 Express 应用
const app = express();

// 启用 CORS
app.use(cors());  // 允许所有源访问，如果需要，可以限制特定域

// 全局 CORS 配置，限制为特定域
app.use((req, res, next) => {
    if (req.path === '/heartbeat') {
      // /heartbeat 允许任何来源
      cors()(req, res, next);
    } else {
      // 其他路径仅允许特定域
      cors({
        origin: ['https://diamondpie.is-best.net', 'https://dp.upp.pw'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      })(req, res, next);
    }
});

// 存储最新的位置信息
let latestLocation = { latitude: 0, longitude: 0, timestamp: 0, online: false };

// 使用 body-parser 中间件来解析 JSON 请求体
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send("Location Tracker服务端运行正常")
});

app.head('/heartbeat', (req, res) => {
    const currentTime = new Date().toISOString();
    console.log(`Heartbeat at: ${currentTime}`);
    if (Date.now() - latestLocation.timestamp > 2*60*1000) {
        latestLocation.online = false;
    }
    res.status(206).end();
});

// POST 请求接口，用于更新位置
app.post('/api/update-location', (req, res) => {
    const { latitude, longitude, password } = req.body;

    // 从环境变量中读取密码并验证
    if (!password || password !== process.env.PASSWORD) {
        return res.status(200).send({success: false, message: 'Unauthorized client' });
    }

    // 更新位置数据
    latestLocation = { latitude, longitude, timestamp: Date.now(), online: true };

    res.status(200).send({ success: true, message: 'Updated successfully' });
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
