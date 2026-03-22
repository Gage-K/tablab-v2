const {Pool} = require('/app/server/node_modules/.pnpm/pg@8.18.0/node_modules/pg');
const p = new Pool({host:process.env.DB_HOST,user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,port:process.env.DB_PORT});
p.query('SELECT 1').then(r => console.log('Connected OK')).catch(e => console.error('Connection failed:', e.message));
