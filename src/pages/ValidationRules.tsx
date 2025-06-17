
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/Layout';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { ArrowLeft } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import InlineValidationRules, { ValidationRule } from '@/components/InlineValidationRules';

// const ValidationRules = () => {
//   const [reconData, setReconData] = useState<any>(null);
//   const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
//   const [primaryKey, setPrimaryKey] = useState<string>('');
//   const [isCreating, setIsCreating] = useState(false);

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     const storedData = sessionStorage.getItem('reconData');
//     if (!storedData) {
//       toast({
//         title: "No recon data found",
//         description: "Please start from the beginning",
//         variant: "destructive",
//       });
//       navigate('/create-recon');
//       return;
//     }
//     setReconData(JSON.parse(storedData));
//   }, [navigate, toast]);

//   const handleValidationRulesChange = (rules: ValidationRule[]) => {
//     setValidationRules(rules);
//   };

//   const handleCreateRecon = async () => {
//     if (!reconData) return;

//     setIsCreating(true);
//     toast({ title: 'Creating recon', description: 'Processing files and setting up reconciliation…' });

//     // Simulate API call
//     setTimeout(() => {
//       const total = Math.floor(Math.random() * 1000) + 200;
//       const matched = Math.floor(total * ((Math.random() * 15 + 85) / 100));
//       const pending = total - matched;

//       const newWorkspace = {
//         id: crypto.randomUUID(),
//         name: reconData.newWorkspaceName,
//         description: `Reconciliation recon for ${reconData.newWorkspaceName}`,
//         lastUpdated: new Date().toISOString().split('T')[0],
//         pendingExceptions: pending,
//         totalRecords: total,
//         matchedRecords: matched,
//         brand: { name: reconData.newWorkspaceName.split(' ')[0], logo: reconData.brandLogo },
//       };

//       // Store the new workspace for the dashboard
//       const existingWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
//       existingWorkspaces.unshift(newWorkspace);
//       localStorage.setItem('workspaces', JSON.stringify(existingWorkspaces));

//       // Clear session storage
//       sessionStorage.removeItem('reconData');

//       toast({ 
//         title: 'Recon created successfully', 
//         description: `"${reconData.newWorkspaceName}" has been created with ${validationRules.length} validation rules and primary key: ${primaryKey || 'None'}`
//       });

//       navigate('/dashboard');
//     }, 2500);
//   };

//   if (!reconData) {
//     return null;
//   }

//   // Extract all available columns from both files - fix the data access path
//   const allColumnsFile1 = reconData.columnsDetected?.file1 || [];
//   const allColumnsFile2 = reconData.columnsDetected?.file2 || [];
//   const availableFields = reconData.matchedFields?.map((field: any) => field.field1) || [];

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="flex items-center gap-4 mb-6">
//           <Button variant="ghost" onClick={() => navigate('/create-recon')} className="p-2">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Create New Recon</h1>
//             <p className="text-muted-foreground">Step 2: Validation Rules - {reconData.newWorkspaceName}</p>
//           </div>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Primary Key Selection</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <Label htmlFor="primary-key">Primary Key</Label>
//               <Select value={primaryKey} onValueChange={setPrimaryKey}>
//                 <SelectTrigger id="primary-key">
//                   <SelectValue placeholder="Select a primary key field" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableFields.map((field: string) => (
//                     <SelectItem key={field} value={field}>
//                       {field}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <p className="text-sm text-muted-foreground">
//                 The primary key will be used as the unique identifier for matching records between sources.
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Validation Rules</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <InlineValidationRules 
//               matchedFields={reconData.matchedFields}
//               allColumnsFile1={allColumnsFile1}
//               allColumnsFile2={allColumnsFile2}
//               onValidationRulesChange={handleValidationRulesChange}
//             />
//           </CardContent>
//         </Card>

//         <div className="flex justify-between">
//           <Button 
//             variant="outline"
//             onClick={() => navigate('/create-recon')}
//           >
//             Back to Field Mapping
//           </Button>
//           <Button 
//             onClick={handleCreateRecon}
//             className="gradient-btn"
//             disabled={isCreating}
//           >
//             {isCreating ? 'Creating Recon…' : 'Create Recon'}
//           </Button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ValidationRules;

//2nd try working a bit right 

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/Layout';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// // Import the ValidationRule type and the component from InlineValidationRules.tsx
// // Removed InlineValidationRulesProps from named imports
// import InlineValidationRules, { ValidationRule } from '@/components/InlineValidationRules';


// // Define types for stored recon data
// interface StoredReconData {
//   newWorkspaceName: string;
//   file1: string; // Storing filenames might not be useful here, but kept for consistency if needed later
//   file2: string; // Same as above
//   matchedFields: { field1: string; field2: string }[]; // Matched fields from step 1, can include 'IGNORE'
//   columnsDetected: { file1: string[]; file2: string[] }; // All detected columns
//   brandLogo?: string; // Added optional brandLogo based on original CreateRecon component
// }

// const ValidationRules = () => {
//   const [reconData, setReconData] = useState<StoredReconData | null>(null);
//   // Use the imported ValidationRule type for the state
//   const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
//   const [primaryKey, setPrimaryKey] = useState<string>(''); // Primary Key from Entity 1
//   const [isCreating, setIsCreating] = useState(false);

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     const storedData = sessionStorage.getItem('reconData');
//     if (!storedData) {
//       toast({
//         title: "No recon data found",
//         description: "Please start from the beginning",
//         variant: "destructive",
//       });
//       navigate('/create-recon');
//       return;
//     }
//     try {
//          const data: StoredReconData = JSON.parse(storedData);
//          setReconData(data);

//          // Note: The InlineValidationRules component will likely handle setting up its
//          // initial rules based on the props passed to it (like matchedFields or columns).
//          // We initialize the state here to an empty array, and the component will
//          // report changes back via `onValidationRulesChange`.

//     } catch (error) {
//         console.error("Failed to parse recon data from session storage:", error);
//         toast({
//             title: "Error loading data",
//             description: "Could not load previous recon setup. Please start over.",
//             variant: "destructive",
//         });
//         navigate('/create-recon');
//     }

//   }, [navigate, toast]);

//   const handleValidationRulesChange = (rules: ValidationRule[]) => {
//     // The rules received here should conform to the imported ValidationRule type
//     setValidationRules(rules);
//   };

//   const handleCreateRecon = async () => {
//     if (!reconData) return; // Should not happen due to effect, but safe check

//     // Basic validation before proceeding
//      if (!primaryKey) {
//        toast({
//          title: 'Missing Primary Key',
//          description: 'Please select a Primary Key from Entity 1.',
//          variant: 'destructive',
//        });
//        return;
//      }

//     // Validate rules using the properties from the imported ValidationRule type
//     // Assuming ValidationRule has 'field' and 'operator' and potentially a 'value' or similar
//     // You might need to adjust this validation based on the actual ValidationRule structure
//      const incompleteRules = validationRules.some(rule =>
//         !rule.field || !rule.operator // Check if field and operator are selected (not empty string)
//         // Add more checks here based on other properties of your ValidationRule type
//         // For example, if a rule needs a comparison value: || (rule.operator === 'equals' && !rule.value)
//      );


//      if (incompleteRules) {
//          toast({
//              title: 'Incomplete Validation Rules',
//              description: 'Please complete all validation rules or remove incomplete ones. Ensure fields and rule types are selected.',
//              variant: 'destructive'
//          });
//          return;
//      }


//     setIsCreating(true);
//     toast({ title: 'Creating recon', description: 'Processing files and setting up reconciliation…' });

//     // --- Placeholder for actual API call to create/save the recon configuration ---
//     // This part needs to call your backend API with the full configuration:
//     // reconData.newWorkspaceName, primaryKey, and validationRules.

//     // Note: The structure of validationRules (using field, operator etc.) might
//     // need to be transformed into the structure your backend API expects (which
//     // previously seemed to be field1, rule_type, field2). You'll need to map
//     // the 'ValidationRule[]' state into your backend's expected format here.

//     const backendValidationRules = validationRules.map(rule => {
//         // This mapping is a placeholder. Adjust based on backend API needs
//         // Access properties using the imported ValidationRule type structure
//         return {
//             // Example mapping (adjust property names and logic as needed)
//             field1: rule.field, // Assuming 'field' in component maps to field1 in backend
//             rule_type: rule.operator, // Assuming 'operator' maps to rule_type
//             // You might need to access other properties from the rule object here
//             // depending on how InlineValidationRules stores the second field/value.
//             // If it uses a property named 'field2' or 'value', access it like rule.field2 or rule.value
//             // For now, leaving it as a placeholder access:
//             field2: (rule as any).field2 || (rule as any).value || 'IGNORE', // Example: map another prop or a value field
//             // ... map other properties from rule if your backend needs them
//         };
//     });


//     console.log("Attempting to create recon with:", {
//         name: reconData.newWorkspaceName,
//         primaryKeyEntity1: primaryKey,
//         validationRules: backendValidationRules // Send the transformed rules
//         // You might also need to send file identifiers again, depending on your backend API
//         // file1Name: reconData.file1,
//         // file2Name: reconData.file2,
//     });


//      // --- Simulate API call with a timeout ---
//      // Replace this entire setTimeout block with your actual fetch request
//      setTimeout(() => {
//        // In a real scenario, the API would return a success status or recon ID
//        const success = true; // Simulate successful API call

//        setIsCreating(false);

//        if (success) {
//           const total = Math.floor(Math.random() * 1000) + 200;
//           const matched = Math.floor(total * ((Math.random() * 15 + 85) / 100));
//           const pending = total - matched;

//           const newWorkspace = {
//             id: crypto.randomUUID(), // Use a real ID from backend if available
//             name: reconData.newWorkspaceName,
//             description: `Recon for ${reconData.newWorkspaceName}`, // Or a description from API
//             lastUpdated: new Date().toISOString().split('T')[0], // Or from API
//             pendingExceptions: pending, // Or get real counts after processing
//             totalRecords: total, // Or get real counts
//             matchedRecords: matched, // Or get real counts
//              // Assuming brand logo logic was placeholder, removing or adapt if needed
//             // brand: { name: reconData.newWorkspaceName.split(' ')[0], logo: reconData.brandLogo },
//           };

//           // Store the new workspace for the dashboard (Simulated storage)
//           // In a real app, the dashboard would fetch this from the backend
//           const existingWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
//           existingWorkspaces.unshift(newWorkspace); // Add to beginning
//           localStorage.setItem('workspaces', JSON.stringify(existingWorkspaces));

//           // Clear session storage after successful creation/save
//           sessionStorage.removeItem('reconData');

//           toast({
//             title: 'Recon created successfully',
//             description: `"${reconData.newWorkspaceName}" has been set up.`,
//             // Fix: Change 'success' variant to 'default' or 'destructive'
//             variant: 'default', // Or 'destructive' if you only have those two
//           });

//           // Redirect to dashboard or a success page
//           navigate('/dashboard'); // Adjust redirect as needed

//        } else {
//           // Simulate API failure
//            toast({
//               title: 'Failed to create recon',
//               description: 'An error occurred while saving the reconciliation setup.',
//               variant: 'destructive',
//             });
//        }

//      }, 2500); // Simulate network delay


//   };

//   // --- Rendering Logic ---

//   // Get all available fields from Entity 1 from the detected columns
//   // Filter out 'IGNORE' and empty strings explicitly for Primary Key selection
//   const primaryKeyOptions = (reconData?.columnsDetected?.file1 || []).filter(col => col !== 'IGNORE' && col !== '');

//   // Get all available fields from Entity 1 and Entity 2 for validation rules
//   // These lists CAN include 'IGNORE' for the rule configuration component
//   const allColumnsFile1ForRules = reconData?.columnsDetected?.file1 || [];
//   const allColumnsFile2ForRules = reconData?.columnsDetected?.file2 || [];


//   if (!reconData) {
//     // Render a loading or redirecting state while useEffect runs
//     return (
//        <Layout>
//            <div className="flex flex-col items-center justify-center h-full min-h-screen text-gray-400">
//                <Loader2 className="h-8 w-8 animate-spin mb-4" />
//                <p>Loading recon data...</p>
//                {/* Optional: Add a button to go back if stuck */}
//                {/* <Button onClick={() => navigate('/create-recon')} className="mt-4">Go back</Button> */}
//            </div>
//        </Layout>
//     );
//   }


//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="flex items-center gap-4 mb-6">
//           <Button variant="ghost" onClick={() => navigate('/create-recon')} className="p-2">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Create New Recon</h1>
//             {/* Display recon name if loaded */}
//             <p className="text-muted-foreground">Step 2: Validation Rules{reconData.newWorkspaceName ? ` - ${reconData.newWorkspaceName}` : ''}</p>
//           </div>
//         </div>

//         {/* Primary Key Selection Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Primary Key Selection</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <Label htmlFor="primary-key">Primary Key (Entity 1)</Label>
//               {/* Ensure Select is disabled if no options are available */}
//               <Select
//                 value={primaryKey}
//                 onValueChange={setPrimaryKey}
//                 disabled={primaryKeyOptions.length === 0 || isCreating} // Disable if no options or creating
//               >
//                 <SelectTrigger id="primary-key" className="bg-black/30 border-white/20">
//                   <SelectValue placeholder={primaryKeyOptions.length > 0 ? "Select Primary Key" : "No fields available for Primary Key"} />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-800 border-gray-600">
//                   {/* Render only valid column names for primary key */}
//                   {primaryKeyOptions.map((col) => (
//                     <SelectItem key={`pk-${col}`} value={col} className="text-white hover:bg-gray-700">
//                       {col}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//                {primaryKeyOptions.length === 0 && (
//                    <p className="text-sm text-yellow-500">No suitable columns found in Entity 1 for Primary Key selection (columns marked as IGNORE or empty in Step 1 are excluded).</p>
//                )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Validation Rules Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Validation Rules</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Pass the full list of columns (including IGNORE) to the rules component */}
//             {/* Removed initialRules prop as per error */}
//             {/* Ensure matchedFields is passed if InlineValidationRules uses it internally for initial display */}
//             {/* Removed disabled prop as per error */}
//             <InlineValidationRules
//               // Re-added matchedFields based on possibility InlineValidationRules uses it for display/initial state
//               matchedFields={reconData.matchedFields}
//               allColumnsFile1={allColumnsFile1ForRules} // Pass lists including IGNORE
//               allColumnsFile2={allColumnsFile2ForRules} // Pass lists including IGNORE
//               onValidationRulesChange={handleValidationRulesChange}
//               // disabled={isCreating} // Remove this line unless you add 'disabled' to InlineValidationRulesProps
//             />
//           </CardContent>
//         </Card>

//         <div className="flex justify-between">
//           <Button
//             variant="outline"
//             onClick={() => navigate('/create-recon')}
//             disabled={isCreating} // Disable back button while saving
//           >
//             Back to Field Mapping
//           </Button>
//           <Button
//             onClick={handleCreateRecon}
//             className="gradient-btn"
//             // Disable button if:
//             // - reconData is not loaded (shouldn't happen but safe)
//             // - A primary key hasn't been selected
//             // - Currently saving
//             // - No validation rules have been added
//             // - There are incomplete rules (the check is inside handleCreateRecon)
//             disabled={!reconData || !primaryKey || isCreating || validationRules.length === 0}
//           >
//              {isCreating ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Creating…
//               </>
//             ) : (
//               'Create Recon'
//             )}
//           </Button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ValidationRules;

//3rd try 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Import the ValidationRule type and the component
import InlineValidationRules, { ValidationRule } from '@/components/InlineValidationRules';


// Define types for stored recon data
interface StoredReconData {
  newWorkspaceName: string;
  file1: string; // Storing filenames might not be useful here, but kept for consistency if needed later
  file2: string; // Same as above
  // matchedFields now includes fields mapped to 'IGNORE'
  matchedFields: { field1: string; field2: string }[];
  columnsDetected: { file1: string[]; file2: string[] }; // All detected columns
  brandLogo?: string; // Added optional brandLogo based on original CreateRecon component
}

const ValidationRules = () => {
  const [reconData, setReconData] = useState<StoredReconData | null>(null);
  // Use the imported ValidationRule type for the state
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [primaryKey, setPrimaryKey] = useState<string>(''); // Primary Key from Entity 1
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedData = sessionStorage.getItem('reconData');
    if (!storedData) {
      toast({
        title: "No recon data found",
        description: "Please start from the beginning",
        variant: "destructive",
      });
      navigate('/create-recon');
      return;
    }
    try {
         const data: StoredReconData = JSON.parse(storedData);
         setReconData(data);

         // Note: The InlineValidationRules component will likely handle setting up its
         // initial rules based on the props passed to it (like matchedFields or columns).
         // We initialize the state here to an empty array, and the component will
         // report changes back via `onValidationRulesChange`.

    } catch (error) {
        console.error("Failed to parse recon data from session storage:", error);
        toast({
            title: "Error loading data",
            description: "Could not load previous recon setup. Please start over.",
            variant: "destructive",
        });
        navigate('/create-recon');
    }

  }, [navigate, toast]);

  const handleValidationRulesChange = (rules: ValidationRule[]) => {
    // The rules received here should conform to the imported ValidationRule type
    setValidationRules(rules);
  };

  const handleCreateRecon = async () => {
    if (!reconData) return; // Should not happen due to effect, but safe check

    // Basic validation before proceeding
     if (!primaryKey) {
       toast({
         title: 'Missing Primary Key',
         description: 'Please select a Primary Key from Entity 1.',
         variant: 'destructive',
       });
       return;
     }

    // Validate rules using the properties from the imported ValidationRule type
    // Assuming ValidationRule has 'field' and 'operator' and potentially a 'value' or similar
    // You might need to adjust this validation based on the actual ValidationRule structure
     const incompleteRules = validationRules.some(rule =>
        !rule.field || !rule.operator // Check if field and operator are selected (not empty string)
        // Add more checks here based on other properties of your ValidationRule type
        // For example, if a rule needs a comparison value: || (rule.operator === 'equals' && !rule.value)
     );


     if (incompleteRules) {
         toast({
             title: 'Incomplete Validation Rules',
             description: 'Please complete all validation rules or remove incomplete ones. Ensure fields and rule types are selected.',
             variant: 'destructive'
         });
         return;
     }


    setIsCreating(true);
    toast({ title: 'Creating recon', description: 'Processing files and setting up reconciliation…' });

    // --- Placeholder for actual API call to create/save the recon configuration ---
    // This part needs to call your backend API with the full configuration:
    // reconData.newWorkspaceName, primaryKey, and validationRules.

    // Note: The structure of validationRules (using field, operator etc.) might
    // need to be transformed into the structure your backend API expects (which
    // previously seemed to be field1, rule_type, field2). You'll need to map
    // the 'ValidationRule[]' state into your backend's expected format here.

    const backendValidationRules = validationRules.map(rule => {
        // This mapping is a placeholder. Adjust based on backend API needs
        // Access properties using the imported ValidationRule type structure
        return {
            // Example mapping (adjust property names and logic as needed)
            field1: rule.field, // Assuming 'field' in component maps to field1 in backend
            rule_type: rule.operator, // Assuming 'operator' maps to rule_type
            // You might need to access other properties from the rule object here
            // depending on how InlineValidationRules stores the second field/value.
            // If it uses a property named 'field2' or 'value', access it like rule.field2 or rule.value
            // For now, leaving it as a placeholder access:
            field2: (rule as any).field2 || (rule as any).value || 'IGNORE', // Example: map another prop or a value field
            // ... map other properties from rule if your backend needs them
        };
    });


    console.log("Attempting to create recon with:", {
        name: reconData.newWorkspaceName,
        primaryKeyEntity1: primaryKey,
        validationRules: backendValidationRules // Send the transformed rules
        // You might also need to send file identifiers again, depending on your backend API
        // file1Name: reconData.file1,
        // file2Name: reconData.file2,
    });


     // --- Simulate API call with a timeout ---
     // Replace this entire setTimeout block with your actual fetch request
     setTimeout(() => {
       // In a real scenario, the API would return a success status or recon ID
       const success = true; // Simulate successful API call

       setIsCreating(false);

       if (success) {
          const total = Math.floor(Math.random() * 1000) + 200;
          const matched = Math.floor(total * ((Math.random() * 15 + 85) / 100));
          const pending = total - matched;

          const newWorkspace = {
            id: crypto.randomUUID(), // Use a real ID from backend if available
            name: reconData.newWorkspaceName,
            description: `Recon for ${reconData.newWorkspaceName}`, // Or a description from API
            lastUpdated: new Date().toISOString().split('T')[0], // Or from API
            pendingExceptions: pending, // Or get real counts after processing
            totalRecords: total, // Or get real counts
            matchedRecords: matched, // Or get real counts
             // Assuming brand logo logic was placeholder, removing or adapt if needed
            // brand: { name: reconData.newWorkspaceName.split(' ')[0], logo: reconData.brandLogo },
          };

          // Store the new workspace for the dashboard (Simulated storage)
          // In a real app, the dashboard would fetch this from the backend
          const existingWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
          existingWorkspaces.unshift(newWorkspace); // Add to beginning
          localStorage.setItem('workspaces', JSON.stringify(existingWorkspaces));

          // Clear session storage after successful creation/save
          sessionStorage.removeItem('reconData');

          toast({
            title: 'Recon created successfully',
            description: `"${reconData.newWorkspaceName}" has been set up.`,
            // Fix: Change 'success' variant to 'default' or 'destructive'
            variant: 'default', // Or 'destructive' if you only have those two
          });

          // Redirect to dashboard or a success page
          navigate('/dashboard'); // Adjust redirect as needed

       } else {
          // Simulate API failure
           toast({
              title: 'Failed to create recon',
              description: 'An error occurred while saving the reconciliation setup.',
              variant: 'destructive',
            });
       }

     }, 2500); // Simulate network delay


  };

  // --- Rendering Logic ---

  // Calculate available fields from Entity 1 that were actually matched (not IGNORE)
  // and also ensure the resulting field name itself is not 'IGNORE'.
  const primaryKeyOptions = Array.from(new Set( // Use Set to get unique field names
    (reconData?.matchedFields || [])
       .filter(mapping => mapping.field2 !== 'IGNORE') // Keep only mappings where field2 is NOT 'IGNORE'
       .map(mapping => mapping.field1) // Extract field1 from the filtered mappings
       .filter(field1Name => field1Name !== 'IGNORE') // <--- NEW FILTER: Ensure field1 itself is not 'IGNORE'
  ));


  // Get all available fields from Entity 1 and Entity 2 for validation rules
  // These lists CAN include 'IGNORE' for the rule configuration component
  const allColumnsFile1ForRules = reconData?.columnsDetected?.file1 || [];
  const allColumnsFile2ForRules = reconData?.columnsDetected?.file2 || [];


  if (!reconData) {
    // Render a loading or redirecting state while useEffect runs
    return (
       <Layout>
           <div className="flex flex-col items-center justify-center h-full min-h-screen text-gray-400">
               <Loader2 className="h-8 w-8 animate-spin mb-4" />
               <p>Loading recon data...</p>
               {/* Optional: Add a button to go back if stuck */}
               {/* <Button onClick={() => navigate('/create-recon')} className="mt-4">Go back</Button> */}
           </div>
       </Layout>
    );
  }


  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/create-recon')} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Recon</h1>
            {/* Display recon name if loaded */}
            <p className="text-muted-foreground">Step 2: Validation Rules{reconData.newWorkspaceName ? ` - ${reconData.newWorkspaceName}` : ''}</p>
          </div>
        </div>

        {/* Primary Key Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Key Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="primary-key">Primary Key (Entity 1)</Label>
              {/* Ensure Select is disabled if no options are available */}
              <Select
                value={primaryKey}
                onValueChange={setPrimaryKey}
                disabled={primaryKeyOptions.length === 0 || isCreating} // Disable if no options or creating
              >
                <SelectTrigger id="primary-key" className="bg-black/30 border-white/20">
                  <SelectValue placeholder={primaryKeyOptions.length > 0 ? "Select Primary Key" : "No matched fields available from Entity 1"} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {/* Render only valid column names for primary key */}
                  {primaryKeyOptions.map((col) => (
                    // Add a check here too, although the array is already filtered
                    col !== 'IGNORE' && (
                        <SelectItem key={`pk-${col}`} value={col} className="text-white hover:bg-gray-700">
                          {col}
                        </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
               {primaryKeyOptions.length === 0 && (
                   <p className="text-sm text-yellow-500">No fields from Entity 1 were successfully matched to Entity 2 in the previous step. Please go back to mapping.</p>
               )}
            </div>
          </CardContent>
        </Card>

        {/* Validation Rules Card */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pass the full list of columns (including IGNORE) to the rules component */}
            <InlineValidationRules
              // Re-added matchedFields based on possibility InlineValidationRules uses it for display/initial state
              matchedFields={reconData.matchedFields}
              allColumnsFile1={allColumnsFile1ForRules} // Pass lists including IGNORE
              allColumnsFile2={allColumnsFile2ForRules} // Pass lists including IGNORE
              onValidationRulesChange={handleValidationRulesChange}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/create-recon')}
            disabled={isCreating} // Disable back button while saving
          >
            Back to Field Mapping
          </Button>
          <Button
            onClick={handleCreateRecon}
            className="gradient-btn"
            // Disable button if:
            // - reconData is not loaded (shouldn't happen but safe)
            // - A primary key hasn't been selected
            // - Currently saving
            // - No validation rules have been added
            // - There are incomplete rules (the check is inside handleCreateRecon)
            disabled={!reconData || !primaryKey || isCreating || validationRules.length === 0}
          >
             {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating…
              </>
            ) : (
              'Create Recon'
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ValidationRules;