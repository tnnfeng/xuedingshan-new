const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

// 中间件 - 添加日志记录
app.use((req, res, next) => {
    console.log(`收到请求: ${req.method} ${req.path}`);
    next();
});

app.use(express.json());

// API路由 - 应该最先定义
app.get('/api/config', (req, res) => {
    console.log('处理 /api/config GET 请求');
    try {
        const configFilePath = path.join(__dirname, 'website-config.json');
        if (fs.existsSync(configFilePath)) {
            const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
            res.json(config);
        } else {
            // 返回默认配置
            res.json({});
        }
    } catch (error) {
        console.error('读取配置失败:', error);
        res.status(500).json({ error: '读取配置失败' });
    }
});

app.post('/api/config', (req, res) => {
    console.log('处理 /api/config POST 请求');
    try {
        const config = req.body;
        const configFilePath = path.join(__dirname, 'website-config.json');
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
        res.json({ success: true, message: '配置保存成功' });
    } catch (error) {
        console.error('保存配置失败:', error);
        res.status(500).json({ error: '保存配置失败' });
    }
});

// 管理后台
app.get('/admin', (req, res) => {
    console.log('处理 /admin GET 请求');
    res.sendFile(path.join(__dirname, 'admin-full.html'));
});

// 静态文件服务 - 在API路由之后
app.use(express.static(path.join(__dirname, '/')));

// 根路径
app.get('/', (req, res) => {
    console.log('处理根路径请求');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`调试服务器运行在 http://localhost:${PORT}`);
    console.log(`管理后台: http://localhost:${PORT}/admin`);
});