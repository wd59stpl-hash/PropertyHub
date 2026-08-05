const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express'); // Import Swagger
const swaggerJsdoc = require('swagger-jsdoc'); // Import JsDoc
const logger = require('./src/utils/logger');

const app = express();

// --- SWAGGER SETUP ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'PropertyHub API', version: '1.0.0', description: 'Elite Residency Platform' },
        servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
    },
    apis: ['./src/routes/*.js'], 
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));

if (process.env.NODE_ENV === 'development') // Morgan setup to write logs into Winston
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL Injection Sanitization (Aapka custom logic)
app.use((req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                if (key.startsWith('$') || key.includes('.')) delete obj[key];
                else sanitize(obj[key]);
            }
        }
    };
    sanitize(req.body);
    sanitize(req.params);
    if (req.query) Object.keys(req.query).forEach(key => { if (key.startsWith('$') || key.includes('.')) delete req.query[key]; });
    next();
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/properties', require('./src/routes/propertyRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/buyer', require('./src/routes/buyerRoutes'));
app.use('/api/seller', require('./src/routes/sellerRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/categories',  require('./src/routes/categoryRoutes'));
app.use('/api/property-types', require('./src/routes/propertyTypeRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));

app.get('/', (req, res) => res.json({ success: true, message: "PropertyHub API Running!" }));

// 404 & Error Handler
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
    // Ye line error.log mein entry daal degi
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

module.exports = app; // Export for testing