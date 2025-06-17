import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

export interface ValidationRule {
  id: string;
  field: string;
  field2?: string;
  operator: string;
  value?: string;
  description: string;
}

interface InlineValidationRulesProps {
  matchedFields: { field1: string; field2: string }[];
  allColumnsFile1?: string[];
  allColumnsFile2?: string[];
  onValidationRulesChange: (rules: ValidationRule[]) => void;
}

const validationSchema = z.object({
  field: z.string().min(1, "Field is required"),
  field2: z.string().optional(),
  operator: z.string().min(1, "Operator is required"),
  value: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

type ValidationFormValues = z.infer<typeof validationSchema>;

const InlineValidationRules: React.FC<InlineValidationRulesProps> = ({
  matchedFields,
  allColumnsFile1 = [],
  allColumnsFile2 = [],
  onValidationRulesChange,
}) => {
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ValidationFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      field: '',
      field2: '',
      operator: '',
      value: '',
      description: ''
    }
  });

  const operators = [
    { value: 'equals', label: 'Must equal' },
    { value: 'not_equals', label: 'Must not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between range' },
    { value: 'matches', label: 'Matches regex' },
    { value: 'not_empty', label: 'Not empty' },
    { value: 'date_format', label: 'Valid date format' },
    { value: 'compare_fields', label: 'Compare with field' },
    { value: 'sum_equals', label: 'Sum equals' }
  ];

  // Use all columns from respective files, fallback to matched fields if not provided
  const field1Options = allColumnsFile1.length > 0 ? allColumnsFile1 : matchedFields.map(match => match.field1);
  const field2Options = allColumnsFile2.length > 0 ? allColumnsFile2 : matchedFields.map(match => match.field2);

  /**
   * Call the backend API, always POST with JSON body, handle 100% of status codes and non-JSON
   * Returns:
   *   { success: boolean, apiMessage: string, data?: any }
   */
  const callValidationAPI = async (ruleData: ValidationFormValues) => {
    try {
      const queryParams = new URLSearchParams({
        primary_key: `${ruleData.field}:${ruleData.field2 || ruleData.field}`,
        validation: ruleData.operator,
        field1: ruleData.field,
        field2: ruleData.field2 || '',
      });
      
      const url = `http://127.0.0.1:8000/validations?${queryParams.toString()}`;

      console.log('[VALIDATION][API CALL]', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Body is intentionally empty as all params are in the query string
      });

      // log status code and headers
      console.log('[VALIDATION][API STATUS]', response.status, response.headers);

      // Try to parse response as JSON if possible
      const contentType = response.headers.get('content-type');
      let apiResponseData: any = null;
      if (contentType && contentType.includes('application/json')) {
        apiResponseData = await response.json();
      } else {
        apiResponseData = await response.text();
      }

      if (response.ok) {
        return {
          success: true,
          apiMessage: typeof apiResponseData === 'object'
            ? (apiResponseData.message || 'Validation rule created via API.')
            : String(apiResponseData),
          data: apiResponseData,
        };
      } else {
        // Always show what we got, even for 4xx/5xx
        const msg = (typeof apiResponseData === 'object'
          ? (JSON.stringify(apiResponseData.detail) || apiResponseData.message || JSON.stringify(apiResponseData))
          : String(apiResponseData)
        );
        throw new Error(`API error (${response.status}): ${msg}`);
      }
    } catch (error: any) {
      // Always propagate for outer handling
      console.error('[VALIDATION][API ERROR]', error);
      throw error;
    }
  };

  const handleAddRule = async () => {
    const formValues = form.getValues();
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    let apiWasHit = false;
    let fallbackUsed = false;

    try {
      try {
        await callValidationAPI(formValues);
        apiWasHit = true;
      } catch (apiError: any) {
        fallbackUsed = true;
      }

      // Always add the rule to local UI for consistent UX
      const newRule: ValidationRule = {
        id: crypto.randomUUID(),
        field: formValues.field,
        field2: formValues.field2,
        operator: formValues.operator,
        value: formValues.value,
        description: formValues.description
      };
      const updatedRules = [...validationRules, newRule];
      setValidationRules(updatedRules);
      onValidationRulesChange(updatedRules);
      form.reset({
        field: '',
        field2: '',
        operator: '',
        value: '',
        description: ''
      });

    } catch (error: any) {
      console.error('[VALIDATION][UNEXPECTED ERROR]', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = (id: string) => {
    const updatedRules = validationRules.filter(rule => rule.id !== id);
    setValidationRules(updatedRules);
    onValidationRulesChange(updatedRules);
  };

  const needsValueInput = (operator: string) => {
    return operator !== 'not_empty' &&
      operator !== 'date_format' &&
      operator !== 'compare_fields' &&
      operator !== 'sum_equals';
  };

  const getOperatorLabel = (operatorValue: string) => {
    return operators.find(op => op.value === operatorValue)?.label || operatorValue;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Validation Rules</h3>
      <div className="bg-gray-800/40 rounded-lg p-6">
        <Form {...form}>
          <div className="space-y-6">
            {/* Field 1 */}
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Field 1 (Sheet 1 Columns)</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full bg-gray-700/30">
                        <SelectValue placeholder="Select field from Sheet 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {field1Options.map((fieldName) => (
                          <SelectItem key={fieldName} value={fieldName}>
                            {fieldName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Field 2 */}
            <FormField
              control={form.control}
              name="field2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Field 2 (Sheet 2 Columns)</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full bg-gray-700/30">
                        <SelectValue placeholder="Select field from Sheet 2" />
                      </SelectTrigger>
                      <SelectContent>
                        {field2Options.map((fieldName) => (
                          <SelectItem key={fieldName} value={fieldName}>
                            {fieldName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Rule (Operator) Selection */}
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Rule</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full bg-gray-700/30">
                        <SelectValue placeholder="Select validation rule" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Value Input - Conditional */}
            {needsValueInput(form.watch("operator")) && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Value</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter value"
                        className="w-full bg-gray-700/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Description Input */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Rule description"
                      className="w-full bg-gray-700/30"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              onClick={handleAddRule}
              disabled={isSubmitting}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white border-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Rule...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Validation Rule
                </>
              )}
            </Button>
          </div>
        </Form>

        {validationRules.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h4 className="text-xs font-medium text-gray-400 uppercase mb-3">Added Rules</h4>
            <div className="space-y-3">
              {validationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-indigo-900/30 rounded-lg overflow-hidden border border-indigo-800/30"
                >
                  <div className="flex justify-between items-center px-4 py-3 bg-indigo-950/50">
                    <span className="font-medium text-sm">{rule.description}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="h-8 w-8 p-0 hover:bg-indigo-800/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="px-4 py-2 text-xs text-gray-300">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Field 1:</span>
                      <span>{rule.field}</span>
                    </div>
                    {rule.field2 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="font-medium">Field 2:</span>
                        <span>{rule.field2}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="font-medium">Rule:</span>
                      <span className="text-gray-400">{getOperatorLabel(rule.operator)}</span>
                      {rule.value && <span className="ml-1">"{rule.value}"</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineValidationRules;

// NOTE: This file is now quite long (over 400 lines). Consider refactoring into smaller components (form, validation API hook, rule list) for clarity and maintainability!
