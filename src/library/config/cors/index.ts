const prodOrigin = [
  'http://localhost:4173',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://tune-stream.onrender.com'
];

/** Development origins */
const devOrigin = [
  'http://localhost:8080',
  `http://localhost:${process.env.PORT}`,
  'https://tunestream.koyeb.app/',
  'https://tune-stream-sigma.vercel.app/',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://localhost:5174',
  '[::1]:3000',
  '[::1]:4173',
  '[::1]:5173',
];

const allowedOrigins =
  process.env.NODE_ENV === 'production' ? prodOrigin : devOrigin;

/** CORS options */
export const corsOptions = {
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'authorization',
    'Origin',
    'X-Requested-With',
    'Accept',
  ],

  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
