import cors from "cors";

const defaultOrigins = [
  "https://nookchat.vercel.app",
  "https://nookchat-client.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3011",
];

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...defaultOrigins, ...configuredOrigins])];
}

function isAllowedOrigin(origin) {
  return getAllowedOrigins().includes(origin);
}

// Function to create appropriate CORS configuration based on environment
export const configureCors = ( app ) => {
  // Apply CORS middleware with configuration
  app.use( cors( {
    origin: function ( origin, callback ) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if ( !origin ) return callback( null, true );

      if ( isAllowedOrigin( origin ) ) {
        callback( null, true );
      } else {
        callback( new Error( 'Not allowed by CORS' ) );
      }
    },
    methods: ["GET", "POST", "DELETE"],
  } ) );
};

// Configure Socket.IO CORS settings
export const socketCorsConfig = {
  cors: {
    origin: ( origin, callback ) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if ( !origin ) return callback( null, true );

      if ( isAllowedOrigin( origin ) ) {
        callback( null, true );
      } else {
        callback( new Error( 'Not allowed by CORS' ) );
      }
    },
    methods: ["GET", "POST", "DELETE"],
  },
  allowEIO3: true, // Support older clients (including some mobile browsers)
};
