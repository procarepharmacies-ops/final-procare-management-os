import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuration for the Mashala Database (Live Data)
const dbConfig: sql.config = {
    user: process.env.DB_USER || 'ahmedibrahim',
    password: process.env.DB_PASSWORD || 'Egstart01$',
    server: process.env.DB_SERVER || '192.168.1.2',
    database: process.env.DB_NAME || 'stock',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

// Test connection endpoint
app.get('/api/health', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT COUNT(*) as tableCount FROM sys.tables');
        await pool.close();
        
        res.json({
            status: 'success',
            message: 'Successfully connected to Mashala database',
            tableCount: result.recordset[0].tableCount
        });
    } catch (err: any) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
