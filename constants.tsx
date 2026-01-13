
import { ToolCategory, ToolInfo } from './types';

export const ADMIN_EMAIL = 'easytools@us.com';

export const TOOLS: ToolInfo[] = [
  // Finance
  { id: 'salary-calc', name: 'Salary Calculator', icon: 'fa-money-bill-wave', category: ToolCategory.FINANCE, description: 'Calculate take-home pay after taxes.', requiresAuth: false },
  { id: 'mortgage-calc', name: 'Mortgage Calculator', icon: 'fa-house', category: ToolCategory.FINANCE, description: 'Estimate monthly mortgage payments.', requiresAuth: false },
  { id: 'loan-calc', name: 'Loan/EMI Calculator', icon: 'fa-hand-holding-dollar', category: ToolCategory.FINANCE, description: 'Calculate loan EMIs and interest.', requiresAuth: false },
  
  // Health
  { id: 'bmi-calc', name: 'BMI Calculator', icon: 'fa-weight-scale', category: ToolCategory.HEALTH, description: 'Check your Body Mass Index.', requiresAuth: false },
  { id: 'calorie-calc', name: 'Calorie Calculator', icon: 'fa-fire', category: ToolCategory.HEALTH, description: 'Daily calorie needs based on activity.', requiresAuth: false },
  { id: 'workout-plan', name: 'AI Workout Planner', icon: 'fa-dumbbell', category: ToolCategory.HEALTH, description: 'Generate custom fitness plans.', requiresAuth: true },
  
  // Utility
  { id: 'age-calc', name: 'Age Calculator', icon: 'fa-calendar-day', category: ToolCategory.UTILITY, description: 'Precise age calculation.', requiresAuth: false },
  { id: 'unit-conv', name: 'Unit Converter', icon: 'fa-ruler-combined', category: ToolCategory.UTILITY, description: 'Convert weights, lengths, and more.', requiresAuth: false },
  
  // YouTube
  { id: 'yt-analyzer', name: 'YouTube Analyzer', icon: 'fa-brands fa-youtube', category: ToolCategory.YOUTUBE, description: 'Extract thumbnails, stats, and metadata.', requiresAuth: true },
  
  // AI
  { id: 'ai-resume', name: 'AI Resume Builder', icon: 'fa-file-lines', category: ToolCategory.AI, description: 'Craft professional resumes with AI.', requiresAuth: true },
  { id: 'ai-email', name: 'AI Email Writer', icon: 'fa-envelope-open-text', category: ToolCategory.AI, description: 'Draft emails for any scenario.', requiresAuth: true },
  { id: 'ai-caption', name: 'AI Caption Gen', icon: 'fa-closed-captioning', category: ToolCategory.AI, description: 'Generate social media captions.', requiresAuth: true },
];
