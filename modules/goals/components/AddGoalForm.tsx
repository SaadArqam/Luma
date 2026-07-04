import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GOAL_TEMPLATES } from '../utils/templates';
import { GoalTemplate } from '../types';
import { Plus, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

interface AddGoalFormProps {
  onGoalAdded?: () => void;
}

export function AddGoalForm({ onGoalAdded }: AddGoalFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    setDescription(template.description);
    if (template.defaultTargetAmount) {
      setTargetAmount(template.defaultTargetAmount.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          target_amount: parseFloat(targetAmount),
          target_date: targetDate || null,
          currency: 'INR',
          icon: selectedTemplate?.icon || 'target',
          color: selectedTemplate?.color || 'bg-blue-500',
          template: selectedTemplate,
        }),
      });

      if (!response.ok) throw new Error('Failed to create goal');

      toast.success('Goal created successfully!');
      setOpen(false);
      setTitle('');
      setDescription('');
      setTargetAmount('');
      setTargetDate('');
      setSelectedTemplate(null);
      onGoalAdded?.();
    } catch (error) {
      toast.error('Failed to create goal');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Choose a template to get started</p>
            <div className="grid grid-cols-2 gap-3">
              {GOAL_TEMPLATES.map((template) => (
                <button
                  key={template.title}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 border border-border rounded-xl hover:bg-accent/50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3 ${template.color}`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-text">{template.title}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                min="0"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date (Optional)</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedTemplate(null)}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
