import { z } from 'zod';

// Define a schema for your server configuration
export const serverConfigSchema = z.object({
  // Server settings
  port: z.number().optional().default(3000),
  // Production settings
  isProduction: z.boolean().optional().default(false),
  // Maintenance mode settings
  maintenanceMode: z.boolean().optional().default(false),
  maintenanceBypassKey: z.string().optional(),
  // Security settings
  enableCors: z.boolean().optional().default(true),
  corsOrigin: z.string().optional().default('*'), // Be sure to restrict this in production
  jwtSecret: z.string().optional().default('your-secret-key'), // Replace with a real secret
  // Add other configuration settings here
});

// Export the inferred type
export type ServerConfig = z.infer<typeof serverConfigSchema>;
