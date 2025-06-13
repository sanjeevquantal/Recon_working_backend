
import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ValidationRule } from '@/types';

interface ValidationRuleFormProps {
  onSubmit: (data: ValidationRule) => void;
  initialData?: Partial<ValidationRule>;
  onCancel?: () => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  type: z.enum(['min-max', 'ratio', 'equality', 'presence', 'custom']),
  field1: z.string().optional(),
  field2: z.string().optional(),
  condition: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
});

const ValidationRuleForm: React.FC<ValidationRuleFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  onCancel 
}) => {
  const form = useForm<ValidationRule>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData.id || crypto.randomUUID(),
      name: initialData.name || '',
      description: initialData.description || '',
      type: initialData.type || 'min-max',
      field1: initialData.field1 || '',
      field2: initialData.field2 || '',
      condition: initialData.condition || '',
      value: initialData.value || '',
    }
  });

  const handleSubmit = (data: ValidationRule) => {
    onSubmit(data);
  };

  const ruleType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Interest Rate Validation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what this rule validates..." 
                  className="h-20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="min-max">Min-Max Rule</SelectItem>
                  <SelectItem value="ratio">Ratio-Based Rule</SelectItem>
                  <SelectItem value="equality">Equality Rule</SelectItem>
                  <SelectItem value="presence">Presence Check</SelectItem>
                  <SelectItem value="custom">Custom Rule</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of validation rule to apply
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Conditional fields based on rule type */}
        {ruleType === 'min-max' && (
          <>
            <FormField
              control={form.control}
              name="field1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field to Validate</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., loan_amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="between">Between</SelectItem>
                        <SelectItem value="gte">Greater Than or Equal</SelectItem>
                        <SelectItem value="lte">Less Than or Equal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1000-5000 or 500" {...field} />
                    </FormControl>
                    <FormDescription>
                      For range use format: min-max
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        {ruleType === 'ratio' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="field1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Field</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., subvention_amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Field</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., total_amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Ratio</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 0.25 or 1:4" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter decimal or ratio format (e.g., 0.25 or 1:4)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {ruleType === 'equality' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="field1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Field</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., interest_rate_1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Field</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., interest_rate_2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        {ruleType === 'presence' && (
          <FormField
            control={form.control}
            name="field1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Field</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., customer_id" {...field} />
                </FormControl>
                <FormDescription>
                  This field must be present and non-empty
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {ruleType === 'custom' && (
          <>
            <FormField
              control={form.control}
              name="field1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., loan_amount, interest_rate" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of fields
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Logic</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe custom validation logic..." 
                      className="h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save Rule</Button>
        </div>
      </form>
    </Form>
  );
};

export default ValidationRuleForm;
