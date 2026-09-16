import cors from "cors";
import { ALLOWED_ORIGINS, NODE_ENV } from "../env.js"; 

const corsOptions = cors({
  origin: (origin, callback) => {
    
    if (!origin) {
      return callback(null, true);
    }

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});

export default corsOptions;