import { type User, type InsertUser, type EventLog, type InsertEventLog, type GenerationRequest, type InsertGenerationRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event logging
  logEvent(event: InsertEventLog): Promise<EventLog>;
  getEventLogs(limit?: number): Promise<EventLog[]>;
  
  // Generation requests
  createGenerationRequest(request: InsertGenerationRequest): Promise<GenerationRequest>;
  updateGenerationRequest(id: string, updates: Partial<GenerationRequest>): Promise<GenerationRequest | undefined>;
  getGenerationRequest(id: string): Promise<GenerationRequest | undefined>;
  getGenerationRequests(limit?: number): Promise<GenerationRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private eventLogs: Map<string, EventLog>;
  private generationRequests: Map<string, GenerationRequest>;

  constructor() {
    this.users = new Map();
    this.eventLogs = new Map();
    this.generationRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async logEvent(insertEvent: InsertEventLog): Promise<EventLog> {
    const id = randomUUID();
    const event: EventLog = {
      ...insertEvent,
      id,
      timestamp: new Date(),
      data: insertEvent.data || null,
      userAgent: insertEvent.userAgent || null,
      viewport: insertEvent.viewport || null,
      url: insertEvent.url || null,
    };
    this.eventLogs.set(id, event);
    return event;
  }

  async getEventLogs(limit: number = 100): Promise<EventLog[]> {
    const logs = Array.from(this.eventLogs.values());
    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createGenerationRequest(insertRequest: InsertGenerationRequest): Promise<GenerationRequest> {
    const id = randomUUID();
    const request: GenerationRequest = {
      ...insertRequest,
      id,
      status: "pending",
      hasUploadedImage: insertRequest.hasUploadedImage || false,
      createdAt: new Date(),
      completedAt: null,
      resultUrl: null,
      speed: insertRequest.speed || null,
      aspectRatio: insertRequest.aspectRatio || null,
    };
    this.generationRequests.set(id, request);
    return request;
  }

  async updateGenerationRequest(id: string, updates: Partial<GenerationRequest>): Promise<GenerationRequest | undefined> {
    const existing = this.generationRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.generationRequests.set(id, updated);
    return updated;
  }

  async getGenerationRequest(id: string): Promise<GenerationRequest | undefined> {
    return this.generationRequests.get(id);
  }

  async getGenerationRequests(limit: number = 50): Promise<GenerationRequest[]> {
    const requests = Array.from(this.generationRequests.values());
    return requests
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
