import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventLogSchema, insertGenerationRequestSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Event logging endpoint
  app.post("/api/events/log", async (req, res) => {
    try {
      const validatedData = insertEventLogSchema.parse(req.body);
      const event = await storage.logEvent(validatedData);
      res.json(event);
    } catch (error) {
      console.error("Error logging event:", error);
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  // Get event logs (for debugging/analytics)
  app.get("/api/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const events = await storage.getEventLogs(limit);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Image upload endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // In a real implementation, you would upload to cloud storage
      // For now, we'll return the local file path
      const imageUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        imageUrl,
        filename: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  });

  // Generation request endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = insertGenerationRequestSchema.parse(req.body);
      const request = await storage.createGenerationRequest(validatedData);
      
      // Simulate AI generation process
      setTimeout(async () => {
        await storage.updateGenerationRequest(request.id, {
          status: "completed",
          completedAt: new Date(),
          resultUrl: "/api/mock-result/" + request.id,
        });
      }, 3000);

      res.json(request);
    } catch (error) {
      console.error("Error creating generation request:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create generation request" });
      }
    }
  });

  // Get generation request status
  app.get("/api/generate/:id", async (req, res) => {
    try {
      const request = await storage.getGenerationRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching generation request:", error);
      res.status(500).json({ error: "Failed to fetch request" });
    }
  });

  // Mock result endpoint (in production, this would serve actual generated content)
  app.get("/api/mock-result/:id", async (req, res) => {
    const request = await storage.getGenerationRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Result not found" });
    }
    
    res.json({
      id: req.params.id,
      type: request.taskType,
      prompt: request.prompt,
      status: "completed",
      resultUrl: "https://via.placeholder.com/800x600/2563eb/ffffff?text=Generated+Image",
      downloadUrl: "https://via.placeholder.com/800x600/2563eb/ffffff?text=Generated+Image",
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
