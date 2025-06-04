'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { growingGuideService } from '@/lib/services/growingGuideService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIGrowingAssistantProps {
  plantName: string;
  currentStage: string;
}

export function AIGrowingAssistant({ plantName, currentStage }: AIGrowingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateAIResponse = (question: string, plantName: string, stage: string): string => {
    const guide = growingGuideService.getAllGuides().find(g => g.plantName === plantName);
    if (!guide) return "I'm sorry, I couldn't find information about this plant.";

    const currentStageData = guide.stages.find(s => s.id === stage);
    if (!currentStageData) return "I'm sorry, I couldn't find information about this stage.";

    const lowerQuestion = question.toLowerCase();

    // Check for common questions
    if (lowerQuestion.includes('water') || lowerQuestion.includes('watering')) {
      return `For ${plantName} during the ${currentStageData.title} stage, ${currentStageData.instructions.find(i => i.toLowerCase().includes('water')) || 'water when the top inch of soil feels dry.'}`;
    }

    if (lowerQuestion.includes('light') || lowerQuestion.includes('sun')) {
      return `For ${plantName} during the ${currentStageData.title} stage, ${currentStageData.instructions.find(i => i.toLowerCase().includes('light') || i.toLowerCase().includes('sun')) || 'provide adequate sunlight based on the plant\'s needs.'}`;
    }

    if (lowerQuestion.includes('fertiliz') || lowerQuestion.includes('feed')) {
      return `For ${plantName} during the ${currentStageData.title} stage, ${currentStageData.instructions.find(i => i.toLowerCase().includes('fertiliz')) || 'fertilize according to the plant\'s specific needs.'}`;
    }

    if (lowerQuestion.includes('problem') || lowerQuestion.includes('issue')) {
      return `Common issues during the ${currentStageData.title} stage include: ${currentStageData.warnings.join(', ')}. ${currentStageData.tips.join(' ')}`;
    }

    // If no specific match, provide general stage information
    return `For the ${currentStageData.title} stage of ${plantName}, here are the key points:\n\n${currentStageData.instructions.join('\n')}\n\nTips: ${currentStageData.tips.join(', ')}\n\nWarnings: ${currentStageData.warnings.join(', ')}`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input, plantName, currentStage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI assistant',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Growing Assistant</h3>
      </div>

      <ScrollArea className="h-[300px] mb-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'assistant' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about growing tips..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
} 