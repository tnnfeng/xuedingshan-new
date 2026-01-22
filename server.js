const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

// 中间件
app.use(express.json());

// 用于存储网站配置的文件
const configFilePath = path.join(__dirname, 'website-config.json');

// API路由 - 必须在静态文件中间件之前定义
// 获取网站配置
app.get('/api/config', (req, res) => {
    try {
        if (fs.existsSync(configFilePath)) {
            const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
            res.json(config);
        } else {
            // 返回默认配置
            res.json({});
        }
    } catch (error) {
        res.status(500).json({ error: '读取配置失败' });
    }
});

// 保存网站配置
app.post('/api/config', (req, res) => {
    try {
        const config = req.body;
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
        res.json({ success: true, message: '配置保存成功' });
    } catch (error) {
        res.status(500).json({ error: '保存配置失败' });
    }
});

// 提供管理后台页面
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-wysiwyg.html'));
});

// 处理 favicon 请求
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content
});

// 静态文件服务 - 先排除特定的API路径
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        // 如果是API路径，跳过静态文件服务
        next();
    } else {
        // 否则使用静态文件服务
        express.static(path.join(__dirname, '/'))(req, res, next);
    }
});

// 根路径重定向到主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`管理后台: http://localhost:${PORT}/admin`);
});