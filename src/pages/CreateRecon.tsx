// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/Layout';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
// import FileUpload from '@/components/FileUpload';
// import { useToast } from '@/hooks/use-toast';

// interface ApiResponse {
//   message?: string;
//   recon_id?: string;
//   file1: string[];
//   file2: string[];
// }

// const CreateRecon = () => {
//   const [newWorkspaceName, setNewWorkspaceName] = useState('');
//   const [file1, setFile1] = useState<File | null>(null);
//   const [file2, setFile2] = useState<File | null>(null);
//   const [columnsDetected, setColumnsDetected] = useState<{ file1: string[]; file2: string[] }>({ file1: [], file2: [] });
//   const [matchedFields, setMatchedFields] = useState<{ field1: string; field2: string }[]>([]);
//   const [isAutoMatching, setIsAutoMatching] = useState(false);
//   const [isProcessingFiles, setIsProcessingFiles] = useState(false);
//   const [brandLogo, setBrandLogo] = useState('/placeholder.svg');

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // Auto-trigger API call when all required fields are present
//   useEffect(() => {
//     const callCreateReconAPI = async () => {
//       if (newWorkspaceName && file1 && file2 && !isProcessingFiles) {
//         console.log('Triggering create-recon API call...');
//         setIsProcessingFiles(true);
        
//         try {
//           const formData = new FormData();
//           formData.append('file1', file1);
//           formData.append('file2', file2);

//           const response = await fetch(`http://127.0.0.1:8000/create-recon?recon_name=${encodeURIComponent(newWorkspaceName)}`, {
//             method: 'POST',
//             body: formData,
//           });

//           if (!response.ok) {
//             throw new Error(`API call failed with status: ${response.status}`);
//           }

//           const data: ApiResponse = await response.json();
//           console.log('API Response:', data);

//           // Update columns with real data from API - handle the correct response structure
//           const newColumnsDetected = {
//             file1: data.file1 || [],
//             file2: data.file2 || []
//           };
//           setColumnsDetected(newColumnsDetected);

//           // Auto-match common columns with improved logic
//           const file1Columns = data.file1 || [];
//           const file2Columns = data.file2 || [];
          
//           const autoMatched = file1Columns
//             .filter(col1 => file2Columns.includes(col1))
//             .map(col => ({
//               field1: col,
//               field2: col
//             }));
          
//           console.log('Auto-matched fields:', autoMatched);
//           setMatchedFields(autoMatched);

//           toast({
//             title: 'Files processed successfully',
//             description: `Extracted ${file1Columns.length} columns from Entity 1 and ${file2Columns.length} columns from Entity 2. Auto-matched ${autoMatched.length} common fields.`
//           });

//         } catch (error) {
//           console.error('Error calling create-recon API:', error);
//           toast({
//             title: 'Error processing files',
//             description: 'Failed to process the uploaded files. Please try again.',
//             variant: 'destructive'
//           });
//         } finally {
//           setIsProcessingFiles(false);
//         }
//       }
//     };

//     // Add a small delay to debounce rapid changes
//     const timer = setTimeout(callCreateReconAPI, 500);
//     return () => clearTimeout(timer);
//   }, [newWorkspaceName, file1, file2, toast]);

//   useEffect(() => {
//     if (newWorkspaceName) {
//       const brandName = newWorkspaceName.split(' ')[0];
//       setBrandLogo(`https://logo.clearbit.com/${encodeURIComponent(`${brandName}.com`)}`);
//     }
//   }, [newWorkspaceName]);

//   const handleAutoMatch = async () => {
//     if (columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0) {
//       toast({
//         title: 'No columns available',
//         description: 'Please ensure both files are uploaded and processed first.',
//         variant: 'destructive'
//       });
//       return;
//     }
    
//     setIsAutoMatching(true);
//     toast({ title: 'Auto-matching columns', description: 'Intelligence Engine is analyzing and matching columns…' });

//     try {
//       // Prepare the request body with file1_columns and file2_columns
//       const requestBody = {
//         file1_columns: columnsDetected.file1,
//         file2_columns: columnsDetected.file2
//       };

//       console.log('Calling /automatch API with:', requestBody);

//       const response = await fetch('http://127.0.0.1:8000/automatch', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error(`API call failed with status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Auto-match API Response:', data);
//       console.log('Data type:', typeof data);
//       console.log('Data keys:', Object.keys(data));

//       // Directly transform ALL key-value pairs from API response to matched fields
//       const newMatches: { field1: string; field2: string }[] = [];
      
//       if (data && typeof data === 'object' && !Array.isArray(data)) {
//         // Process ALL key-value pairs in the response directly
//         Object.entries(data).forEach(([key, value]) => {
//           console.log(`Processing: ${key} -> ${value} (type: ${typeof value})`);
          
//           // Include ALL mappings where value is a string, regardless of column validation
//           if (typeof value === 'string' && key && value) {
//             console.log(`Adding match: ${key} -> ${value}`);
//             newMatches.push({ field1: key, field2: value });
//           }
//         });
//       }

//       console.log('All processed matches from API:', newMatches);
//       console.log('Number of matches from API:', newMatches.length);
      
//       setMatchedFields(newMatches);
//       setIsAutoMatching(false);
      
//       toast({ 
//         title: 'Auto-match complete', 
//         description: `Successfully processed ${newMatches.length} field mappings from API response.`
//       });

//     } catch (error) {
//       console.error('Error calling auto-match API:', error);
//       setIsAutoMatching(false);
      
//       toast({
//         title: 'Auto-match failed',
//         description: 'Failed to auto-match columns. Please try manual mapping or check your connection.',
//         variant: 'destructive'
//       });
      
//       // Fallback to the original client-side logic if API fails
//       console.log('Falling back to client-side auto-matching...');
//       const fallbackMatches: { field1: string; field2: string }[] = [];
      
//       columnsDetected.file1.forEach(col1 => {
//         // First, try exact match
//         let matchingCol2 = columnsDetected.file2.find(col2 => 
//           col1.toLowerCase().trim() === col2.toLowerCase().trim()
//         );
        
//         // If no exact match, try partial matches
//         if (!matchingCol2) {
//           matchingCol2 = columnsDetected.file2.find(col2 => {
//             const col1Clean = col1.toLowerCase().replace(/[^a-z0-9]/g, '');
//             const col2Clean = col2.toLowerCase().replace(/[^a-z0-9]/g, '');
//             return col1Clean.includes(col2Clean) || col2Clean.includes(col1Clean);
//           });
//         }
        
//         if (matchingCol2 && !fallbackMatches.some(match => match.field2 === matchingCol2)) {
//           fallbackMatches.push({ field1: col1, field2: matchingCol2 });
//         }
//       });

//       setMatchedFields(fallbackMatches);
//       console.log('Fallback processed matches:', fallbackMatches.length);
      
//       toast({ 
//         title: 'Fallback auto-match complete', 
//         description: `Used local matching logic. Matched ${fallbackMatches.length} columns.`
//       });
//     }
//   };

//   const handleFieldChange = (index: number, field: 'field1' | 'field2', value: string) => {
//     const updatedMappings = [...matchedFields];
//     updatedMappings[index][field] = value;
//     setMatchedFields(updatedMappings);
//   };

//   const handleAddMapping = () => {
//     setMatchedFields([...matchedFields, { field1: '', field2: '' }]);
//   };

//   const handleRemoveMapping = (index: number) => {
//     const updatedMappings = [...matchedFields];
//     updatedMappings.splice(index, 1);
//     setMatchedFields(updatedMappings);
//   };

//   const handleContinue = () => {
//     if (!newWorkspaceName || !file1 || !file2) {
//       toast({ 
//         title: 'Missing information', 
//         description: 'Please provide a recon name and upload both files', 
//         variant: 'destructive' 
//       });
//       return;
//     }

//     if (matchedFields.length === 0) {
//       toast({ 
//         title: 'No matched fields', 
//         description: 'Please match at least one field between the sources', 
//         variant: 'destructive' 
//       });
//       return;
//     }

//     // Check for incomplete mappings
//     const incompleteMappings = matchedFields.some(mapping => !mapping.field1 || !mapping.field2);
//     if (incompleteMappings) {
//       toast({ 
//         title: 'Incomplete mappings', 
//         description: 'Please complete all field mappings or remove incomplete ones', 
//         variant: 'destructive' 
//       });
//       return;
//     }

//     // Store data in sessionStorage to pass to next step
//     sessionStorage.setItem('reconData', JSON.stringify({
//       newWorkspaceName,
//       file1: file1.name,
//       file2: file2.name,
//       matchedFields,
//       brandLogo,
//       columnsDetected
//     }));

//     navigate('/create-recon/validation');
//   };

//   // Show field mapping section when files are uploaded OR when columns are detected
//   const shouldShowFieldMapping = (file1 && file2) || (columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0);

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="flex items-center gap-4 mb-6">
//           <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Create New Recon</h1>
//             <p className="text-muted-foreground">Step 1: Field Mapping</p>
//           </div>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Basic Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="workspace-name">Recon Name</Label>
//               <Input 
//                 id="workspace-name" 
//                 value={newWorkspaceName} 
//                 onChange={(e) => setNewWorkspaceName(e.target.value)} 
//                 placeholder="e.g., Samsung Brand EMI Reconciliation" 
//                 className="bg-black/30 border-white/20" 
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Entity 1 File</Label>
//                 <FileUpload label="Entity 1" onFileChange={setFile1} />
//               </div>
//               <div className="space-y-2">
//                 <Label>Entity 2 File</Label>
//                 <FileUpload label="Entity 2" onFileChange={setFile2} />
//               </div>
//             </div>

//             {isProcessingFiles && (
//               <div className="flex items-center justify-center p-4 bg-blue-900/20 rounded-lg">
//                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                 <span className="text-sm">Processing files and extracting columns...</span>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {shouldShowFieldMapping && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Field Mapping</CardTitle>
//               <div className="flex space-x-2">
//                 <Button 
//                   size="sm" 
//                   onClick={handleAutoMatch} 
//                   disabled={isAutoMatching || isProcessingFiles || columnsDetected.file1.length === 0}
//                   className="text-xs h-8"
//                 >
//                   {isAutoMatching ? (
//                     <>
//                       <Loader2 className="h-3 w-3 animate-spin mr-1" />
//                       Processing…
//                     </>
//                   ) : (
//                     'Auto-Match'
//                   )}
//                 </Button>
//                 <Button 
//                   size="sm" 
//                   onClick={handleAddMapping} 
//                   variant="outline"
//                   className="text-xs h-8"
//                   disabled={isProcessingFiles || columnsDetected.file1.length === 0}
//                 >
//                   Add Mapping
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {isProcessingFiles ? (
//                 <div className="flex items-center justify-center p-8">
//                   <Loader2 className="h-8 w-8 animate-spin mr-3" />
//                   <span>Processing files and detecting columns...</span>
//                 </div>
//               ) : columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0 ? (
//                 <div className="bg-gray-800/40 rounded-lg p-4">
//                   <div className="grid grid-cols-2 gap-4 mb-3">
//                     <div>
//                       <h4 className="text-xs text-gray-400 uppercase mb-2">
//                         Entity 1 
//                         <span className="ml-2 text-cyan-400">
//                           ({columnsDetected.file1.length} columns)
//                         </span>
//                       </h4>
//                       <div className="space-y-1 max-h-32 overflow-y-auto">
//                         {columnsDetected.file1.length > 0 ? (
//                           columnsDetected.file1.map((col, i) => (
//                             <div key={i} className="text-sm bg-gray-700/30 px-2 py-1 rounded">
//                               {col}
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-sm text-gray-500 px-2 py-1">
//                             No columns detected yet
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="text-xs text-gray-400 uppercase mb-2">
//                         Entity 2 
//                         <span className="ml-2 text-cyan-400">
//                           ({columnsDetected.file2.length} columns)
//                         </span>
//                       </h4>
//                       <div className="space-y-1 max-h-32 overflow-y-auto">
//                         {columnsDetected.file2.length > 0 ? (
//                           columnsDetected.file2.map((col, i) => (
//                             <div key={i} className="text-sm bg-gray-700/30 px-2 py-1 rounded">
//                               {col}
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-sm text-gray-500 px-2 py-1">
//                             No columns detected yet
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-4 border-t border-gray-700 pt-4">
//                     <h4 className="text-xs text-gray-400 uppercase mb-3">
//                       Mapped Fields ({matchedFields.length})
//                     </h4>
//                     {matchedFields.length > 0 ? (
//                       <div className="space-y-3">
//                         {matchedFields.map((mapping, index) => (
//                           <div key={index} className="flex items-center gap-3 bg-indigo-900/30 px-3 py-3 rounded-lg">
//                             <div className="flex-1">
//                               <Select 
//                                 value={mapping.field1} 
//                                 onValueChange={(value) => handleFieldChange(index, 'field1', value)}
//                               >
//                                 <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
//                                   <SelectValue placeholder="Select Entity 1 Field" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-gray-800 border-gray-600">
//                                   {columnsDetected.file1.map((field) => (
//                                     <SelectItem key={field} value={field} className="text-white hover:bg-gray-700">
//                                       {field}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </div>
                            
//                             <div className="text-gray-400 font-bold">↔</div>
                            
//                             <div className="flex-1">
//                               <Select 
//                                 value={mapping.field2} 
//                                 onValueChange={(value) => handleFieldChange(index, 'field2', value)}
//                               >
//                                 <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
//                                   <SelectValue placeholder="Select Entity 2 Field" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-gray-800 border-gray-600">
//                                   {columnsDetected.file2.map((field) => (
//                                     <SelectItem key={field} value={field} className="text-white hover:bg-gray-700">
//                                       {field}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </div>
                            
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
//                               onClick={() => handleRemoveMapping(index)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="mt-4">
//                         <p className="text-gray-400 text-sm text-center">
//                           {columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0 
//                             ? 'No fields have been matched yet. Click "Auto-Match" to automatically match similar columns or "Add Mapping" to manually create mappings.'
//                             : 'Upload both files to see the extracted columns and start field mapping.'
//                           }
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-gray-800/40 rounded-lg p-8">
//                   <p className="text-gray-400 text-sm text-center">
//                     Upload both files to see the extracted columns and start field mapping.
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         <div className="flex justify-end">
//           <Button 
//             onClick={handleContinue}
//             className="gradient-btn"
//             disabled={!file1 || !file2 || !newWorkspaceName || matchedFields.length === 0 || isProcessingFiles}
//           >
//             {isProcessingFiles ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Processing...
//               </>
//             ) : (
//               'Continue to Validation Rules'
//             )}
//           </Button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CreateRecon;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/Layout';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
// import FileUpload from '@/components/FileUpload';
// import { useToast } from '@/hooks/use-toast';

// interface ApiResponse {
//   message?: string;
//   recon_id?: string;
//   file1: string[];
//   file2: string[];
// }

// // Define the expected type for the /automatch API response
// interface AutomatchApiResponse {
//   [file1Column: string]: string; // Expecting an object mapping File 1 column names (keys) to File 2 column names (values)
// }


// const CreateRecon = () => {
//   const [newWorkspaceName, setNewWorkspaceName] = useState('');
//   const [file1, setFile1] = useState<File | null>(null);
//   const [file2, setFile2] = useState<File | null>(null);
//   const [columnsDetected, setColumnsDetected] = useState<{ file1: string[]; file2: string[] }>({ file1: [], file2: [] });
//   const [matchedFields, setMatchedFields] = useState<{ field1: string; field2: string }[]>([]);
//   const [isAutoMatching, setIsAutoMatching] = useState(false);
//   const [isProcessingFiles, setIsProcessingFiles] = useState(false);
//   // const [brandLogo, setBrandLogo] = useState('/placeholder.svg'); // This state is not used in the UI but kept from original code

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // Auto-trigger API call when files are selected or name changes
//   useEffect(() => {
//     let timer: NodeJS.Timeout | null = null;

//     const callCreateReconAPI = async () => {
//       // Only trigger if both files are present and we aren't already processing
//       // isProcessingFiles is read here, but changing it doesn't trigger *this* effect run again
//       if (file1 && file2 && !isProcessingFiles) {
//         console.log('Triggering create-recon API call...');
//         setIsProcessingFiles(true); // Set true *before* the API call starts

//         try {
//           const formData = new FormData();
//           formData.append('file1', file1);
//           formData.append('file2', file2);

//           const url = `http://127.0.0.1:8000/create-recon?recon_name=${encodeURIComponent(newWorkspaceName || 'Unnamed Recon')}`;

//           const response = await fetch(url, {
//             method: 'POST',
//             body: formData,
//           });

//           if (!response.ok) {
//             let errorMsg = `API call failed with status: ${response.status}`;
//             try {
//                 const errorData = await response.json();
//                 if (errorData && errorData.detail) {
//                     errorMsg = `API Error: ${errorData.detail}`;
//                 } else {
//                      const errorText = await response.text();
//                      if (errorText) errorMsg = `API Error: ${errorText}`;
//                 }
//             } catch (e) {
//                 // Ignore parsing errors
//             }
//             throw new Error(errorMsg);
//           }

//           const data: ApiResponse = await response.json();
//           console.log('create-recon API Response:', data);

//           const newColumnsDetected = {
//             file1: Array.isArray(data.file1) ? data.file1 : [],
//             file2: Array.isArray(data.file2) ? data.file2 : []
//           };
//           setColumnsDetected(newColumnsDetected);

//           toast({
//             title: 'Files processed successfully',
//             description: `Extracted ${newColumnsDetected.file1.length} columns from Entity 1 and ${newColumnsDetected.file2.length} columns from Entity 2.`
//           });

//         } catch (error: any) {
//           console.error('Error calling create-recon API:', error);
//           toast({
//             title: 'Error processing files',
//             description: `Failed to process the uploaded files: ${error.message || error}. Please try again.`,
//             variant: 'destructive'
//           });
//           setColumnsDetected({ file1: [], file2: [] });
//           setMatchedFields([]);
//         } finally {
//           setIsProcessingFiles(false); // Set false *after* processing finishes
//         }
//       } else if (!file1 || !file2) {
//          // If files are cleared while debounce timer is pending, clear columns/matches
//          console.log('Files missing, resetting state.');
//          setColumnsDetected({ file1: [], file2: [] });
//          setMatchedFields([]);
//          setIsProcessingFiles(false); // Ensure processing is off if files are removed
//       }
//     };

//     // If files are selected, schedule the API call with debounce
//     if (file1 && file2) {
//         timer = setTimeout(callCreateReconAPI, 500);
//     } else {
//         // If files are not both selected, clear any pending timer
//         // and reset column state immediately
//         if (timer) clearTimeout(timer);
//         setColumnsDetected({ file1: [], file2: [] });
//         setMatchedFields([]);
//         setIsProcessingFiles(false);
//     }


//     // Cleanup function: This runs when the effect re-runs or the component unmounts.
//     // It ensures any pending API call scheduled by the previous effect run is cancelled.
//     return () => {
//       console.log('Cleaning up effect, clearing timer if exists.');
//       if (timer) {
//         clearTimeout(timer);
//       }
//     };

//   }, [file1, file2, newWorkspaceName, toast]); // <-- Removed isProcessingFiles from dependencies


//   const handleAutoMatch = async () => {
//     if (columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0) {
//       toast({
//         title: 'No columns available',
//         description: 'Please ensure both files are uploaded and processed first to detect columns.',
//         variant: 'destructive'
//       });
//       return;
//     }

//     setIsAutoMatching(true);
//     toast({ title: 'Auto-matching columns', description: 'Attempting API auto-match…' }); // Default variant assumed

//     let newMatches: { field1: string; field2: string }[] = [];
//     let usedApiMatches = false;

//     try {
//       const requestBody = {
//         file1_columns: columnsDetected.file1,
//         file2_columns: columnsDetected.file2
//       };

//       console.log('Calling /automatch API with:', requestBody);

//       const response = await fetch('http://127.0.0.1:8000/automatch', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//        if (!response.ok) {
//          let errorMsg = `API call failed with status: ${response.status}`;
//           try {
//               const errorData = await response.json();
//               if (errorData && errorData.detail) {
//                   errorMsg = `API Error: ${errorData.detail}`;
//               } else {
//                    const errorText = await response.text();
//                    if (errorText) errorMsg = `API Error: ${errorText}`;
//               }
//           } catch (e) {
//               // Ignore parsing errors
//           }
//          throw new Error(errorMsg);
//       }

//       const data: AutomatchApiResponse = await response.json();
//       console.log('Auto-match API Response:', data);

//       const isLikelyMappingObject = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;

//       if (isLikelyMappingObject) {
//            let allValuesAreStrings = true;
//            for (const key in data) {
//                if (typeof data[key] !== 'string' || !key || !data[key]) {
//                    allValuesAreStrings = false;
//                    console.warn(`API mapping entry invalid: key='${key}', value='${data[key]}', type='${typeof data[key]}'`);
//                    break;
//                }
//            }

//            if (allValuesAreStrings) {
//               console.log('API response looks like a valid mapping object. Processing...');
//               usedApiMatches = true;
//               Object.entries(data).forEach(([key, value]) => {
//                    newMatches.push({ field1: key, field2: value as string });
//               });
//               console.log('Processed API matches:', newMatches.length);

//            } else {
//                console.warn('API response is an object but values are not all valid strings or contain empty strings. Falling back to client-side matching.');
//            }
//       } else {
//           console.warn('API response is not a non-array object or is empty. Falling back to client-side matching.');
//           if (Array.isArray(data)) {
//               console.warn('API returned an array. Expected an object mapping File 1 columns to File 2 columns.');
//           } else if (typeof data !== 'object') {
//               console.warn('API returned non-object type:', typeof data);
//           } else if (data === null) {
//                console.warn('API returned null.');
//           } else { // Object, but keys.length === 0
//                console.warn('API returned an empty object.');
//           }
//       }

//     } catch (error: any) {
//         console.error('Error calling auto-match API:', error);
//         toast({
//           title: 'Auto-match API failed',
//           description: `Failed to call the auto-match API or received unexpected data: ${error.message || error}. Performing client-side matching instead.`,
//           variant: 'default' // Use 'default' for informational warning/fallback
//         });
//     } finally {
//       if (!usedApiMatches) {
//           console.log('Executing client-side auto-matching...');
//           if (newMatches.length > 0) newMatches = [];

//           const file1Cols = columnsDetected.file1;
//           const file2Cols = columnsDetected.file2;

//           file1Cols.forEach(col1 => {
//             let matchingCol2 = file2Cols.find(col2 =>
//               col1.toLowerCase().trim() === col2.toLowerCase().trim()
//             );

//             if (!matchingCol2) {
//               matchingCol2 = file2Cols.find(col2 => {
//                 const col1Clean = col1.toLowerCase().replace(/[^a-z0-9]/g, '');
//                 const col2Clean = col2.toLowerCase().replace(/[^a-z0-9]/g, '');
//                  if (!col1Clean || !col2Clean) return false;

//                 return col1Clean.includes(col2Clean) || col2Clean.includes(col1Clean);
//               });
//             }

//             if (matchingCol2 && !newMatches.some(match => match.field2 === matchingCol2)) {
//                if (col1 && matchingCol2) {
//                     newMatches.push({ field1: col1, field2: matchingCol2 });
//                }
//             }
//           });
//           console.log('Client-side matches:', newMatches.length);
//       }

//       setMatchedFields(newMatches);
//       setIsAutoMatching(false);

//       const source = usedApiMatches ? 'API' : 'Client-side fallback';
//       toast({
//         title: `Auto-match complete (${source})`,
//         description: `${source} matching found ${newMatches.length} potential mappings.`,
//         variant: newMatches.length > 0 ? 'default' : 'destructive'
//       });
//     }
//   };


//   const handleFieldChange = (index: number, field: 'field1' | 'field2', value: string) => {
//     const updatedMappings = [...matchedFields];
//     updatedMappings[index][field] = value;
//     setMatchedFields(updatedMappings);
//   };

//   const handleAddMapping = () => {
//     if (columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0) {
//         toast({
//             title: 'Cannot add mapping',
//             description: 'Upload and process files first to detect columns.',
//             variant: 'destructive'
//         });
//         return;
//     }
//     setMatchedFields([...matchedFields, { field1: '', field2: '' }]);
//   };

//   const handleRemoveMapping = (index: number) => {
//     const updatedMappings = [...matchedFields];
//     updatedMappings.splice(index, 1);
//     setMatchedFields(updatedMappings);
//   };

//   const handleContinue = () => {
//     if (!newWorkspaceName.trim()) {
//       toast({
//         title: 'Missing information',
//         description: 'Please provide a name for the recon.',
//         variant: 'destructive'
//       });
//       return;
//     }

//     if (!file1 || !file2) {
//       toast({
//         title: 'Missing files',
//         description: 'Please upload both Entity 1 and Entity 2 files.',
//         variant: 'destructive'
//       });
//       return;
//     }

//      if (isProcessingFiles) {
//          toast({
//              title: 'Processing in progress',
//              description: 'Please wait for files to finish processing.',
//              variant: 'default'
//          });
//          return;
//      }

//      if (columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0) {
//           toast({
//              title: 'Files not processed',
//              description: 'Files are not yet processed. Please wait or re-upload if stuck.',
//              variant: 'destructive'
//          });
//          return;
//      }


//     if (matchedFields.length === 0) {
//       toast({
//         title: 'No matched fields',
//         description: 'Please match at least one field between the sources.',
//         variant: 'destructive'
//       });
//       return;
//     }

//     const incompleteMappings = matchedFields.some(mapping => !mapping.field1 || !mapping.field2);
//     if (incompleteMappings) {
//       toast({
//         title: 'Incomplete mappings',
//         description: 'Please complete all field mappings or remove incomplete ones.',
//         variant: 'destructive'
//       });
//       return;
//     }

//     sessionStorage.setItem('reconData', JSON.stringify({
//       newWorkspaceName,
//       file1: file1.name,
//       file2: file2.name,
//       matchedFields,
//       columnsDetected
//     }));

//     navigate('/create-recon/validation');
//   };

//   const shouldShowFieldMapping = columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0;

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="flex items-center gap-4 mb-6">
//           <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Create New Recon</h1>
//             <p className="text-muted-foreground">Step 1: Field Mapping</p>
//           </div>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Basic Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="workspace-name">Recon Name</Label>
//               <Input
//                 id="workspace-name"
//                 value={newWorkspaceName}
//                 onChange={(e) => setNewWorkspaceName(e.target.value)}
//                 placeholder="e.g., Samsung Brand EMI Reconciliation"
//                 className="bg-black/30 border-white/20"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Entity 1 File</Label>
//                 <FileUpload label="Entity 1" onFileChange={setFile1} />
//               </div>
//               <div className="space-y-2">
//                 <Label>Entity 2 File</Label>
//                 <FileUpload label="Entity 2" onFileChange={setFile2} />
//               </div>
//             </div>

//             {isProcessingFiles && (
//               <div className="flex items-center justify-center p-4 bg-blue-900/20 rounded-lg text-blue-300">
//                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                 <span className="text-sm">Processing files and extracting columns...</span>
//               </div>
//             )}
//              {/* Show message if files selected but not processed yet */}
//              {file1 && file2 && !isProcessingFiles && (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) && (
//                   <div className="flex items-center justify-center p-4 bg-yellow-900/20 rounded-lg text-yellow-300">
//                     <span className="text-sm">Files selected. Waiting for processing...</span>
//                   </div>
//              )}
//           </CardContent>
//         </Card>

//         {shouldShowFieldMapping && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Field Mapping</CardTitle>
//               <div className="flex space-x-2 mt-2">
//                 <Button
//                   size="sm"
//                   onClick={handleAutoMatch}
//                   disabled={isAutoMatching || isProcessingFiles || (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0)}
//                   className="text-xs h-8"
//                 >
//                   {isAutoMatching ? (
//                     <>
//                       <Loader2 className="h-3 w-3 animate-spin mr-1" />
//                       Processing…
//                     </>
//                   ) : (
//                     'Auto-Match'
//                   )}
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={handleAddMapping}
//                   variant="outline"
//                   className="text-xs h-8"
//                   disabled={isProcessingFiles || (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0)}
//                 >
//                   Add Mapping
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0 ? (
//                 <div className="bg-gray-800/40 rounded-lg p-4">
//                   <div className="grid grid-cols-2 gap-4 mb-3">
//                     <div>
//                       <h4 className="text-xs text-gray-400 uppercase mb-2">
//                         Entity 1
//                         <span className="ml-2 text-cyan-400">
//                           ({columnsDetected.file1.length} columns)
//                         </span>
//                       </h4>
//                       <div className="space-y-1 max-h-32 overflow-y-auto">
//                         {columnsDetected.file1.length > 0 ? (
//                           columnsDetected.file1.map((col, i) => (
//                             <div key={`file1-col-${i}`} className="text-sm bg-gray-700/30 px-2 py-1 rounded">
//                               {col}
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-sm text-gray-500 px-2 py-1">
//                             No columns detected yet for Entity 1.
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="text-xs text-gray-400 uppercase mb-2">
//                         Entity 2
//                         <span className="ml-2 text-cyan-400">
//                           ({columnsDetected.file2.length} columns)
//                         </span>
//                       </h4>
//                       <div className="space-y-1 max-h-32 overflow-y-auto">
//                         {columnsDetected.file2.length > 0 ? (
//                           columnsDetected.file2.map((col, i) => (
//                             <div key={`file2-col-${i}`} className="text-sm bg-gray-700/30 px-2 py-1 rounded">
//                               {col}
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-sm text-gray-500 px-2 py-1">
//                             No columns detected yet for Entity 2.
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-4 border-t border-gray-700 pt-4">
//                     <h4 className="text-xs text-gray-400 uppercase mb-3">
//                       Mapped Fields ({matchedFields.length})
//                     </h4>
//                     {matchedFields.length > 0 ? (
//                       <div className="space-y-3">
//                         {matchedFields.map((mapping, index) => (
//                           <div key={`mapping-${index}`} className="flex items-center gap-3 bg-indigo-900/30 px-3 py-3 rounded-lg">
//                             <div className="flex-1">
//                               <Select
//                                 value={mapping.field1}
//                                 onValueChange={(value) => handleFieldChange(index, 'field1', value)}
//                               >
//                                 <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
//                                   <SelectValue placeholder="Select Entity 1 Field" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-gray-800 border-gray-600">
//                                   {columnsDetected.file1.map((field) => (
//                                     <SelectItem key={`file1-${field}`} value={field} className="text-white hover:bg-gray-700">
//                                       {field}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </div>

//                             <div className="text-gray-400 font-bold">↔</div>

//                             <div className="flex-1">
//                               <Select
//                                 value={mapping.field2}
//                                 onValueChange={(value) => handleFieldChange(index, 'field2', value)}
//                               >
//                                 <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
//                                   <SelectValue placeholder="Select Entity 2 Field" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-gray-800 border-gray-600">
//                                   {columnsDetected.file2.map((field) => (
//                                     <SelectItem key={`file2-${field}`} value={field} className="text-white hover:bg-gray-700">
//                                       {field}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </div>

//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
//                               onClick={() => handleRemoveMapping(index)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="mt-4">
//                         <p className="text-gray-400 text-sm text-center">
//                           No fields have been matched yet. Click "Auto-Match" to automatically match similar columns or "Add Mapping" to manually create mappings.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                  !isProcessingFiles && (
//                   <div className="bg-gray-800/40 rounded-lg p-8">
//                     <p className="text-gray-400 text-sm text-center">
//                        Upload both files to see the extracted columns and start field mapping.
//                     </p>
//                   </div>
//                  )
//               )}
//             </CardContent>
//           </Card>
//         )}

//         <div className="flex justify-end">
//           <Button
//             onClick={handleContinue}
//             className="gradient-btn"
//             disabled={!file1 || !file2 || !newWorkspaceName.trim() || isProcessingFiles || isAutoMatching || matchedFields.length === 0 || columnsDetected.file1.length === 0}
//           >
//             {isProcessingFiles ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Processing...
//               </>
//             ) : isAutoMatching ? (
//                <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Auto-matching...
//               </>
//             ) : (
//               'Continue to Validation Rules'
//             )}
//           </Button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CreateRecon;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';

interface ApiResponse {
  message?: string;
  recon_id?: string;
  file1: string[];
  file2: string[];
}

// Define a type that covers both possible API response formats or unknown
type AutomatchApiResponse = { [key: string]: string } | Array<[string, string]> | any;


const CreateRecon = () => {
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [columnsDetected, setColumnsDetected] = useState<{ file1: string[]; file2: string[] }>({ file1: [], file2: [] });
  const [matchedFields, setMatchedFields] = useState<{ field1: string; field2: string }[]>([]);
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  // const [brandLogo, setBrandLogo] = useState('/placeholder.svg'); // This state is not used in the UI but kept from original code

  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-trigger API call when files are selected or name changes
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const callCreateReconAPI = async () => {
      // Only trigger if both files are present and we aren't already processing
      if (file1 && file2 && !isProcessingFiles) {
        console.log('Triggering create-recon API call...');
        setIsProcessingFiles(true); // Set true *before* the API call starts

        try {
          const formData = new FormData();
          formData.append('file1', file1);
          formData.append('file2', file2);

          const url = `http://127.0.0.1:8000/create-recon?recon_name=${encodeURIComponent(newWorkspaceName || 'Unnamed Recon')}`;

          const response = await fetch(url, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            let errorMsg = `API call failed with status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.detail) {
                    errorMsg = `API Error: ${errorData.detail}`;
                } else {
                     const errorText = await response.text();
                     if (errorText) errorMsg = `API Error: ${errorText}`;
                }
            } catch (e) {
                // Ignore parsing errors, use default message
            }
            throw new Error(errorMsg);
          }

          const data: ApiResponse = await response.json();
          console.log('create-recon API Response:', data);

          const newColumnsDetected = {
            file1: Array.isArray(data.file1) ? data.file1 : [],
            file2: Array.isArray(data.file2) ? data.file2 : []
          };
          setColumnsDetected(newColumnsDetected);

          toast({
            title: 'Files processed successfully',
            description: `Extracted ${newColumnsDetected.file1.length} columns from Entity 1 and ${newColumnsDetected.file2.length} columns from Entity 2.`
          });

        } catch (error: any) {
          console.error('Error calling create-recon API:', error);
          toast({
            title: 'Error processing files',
            description: `Failed to process the uploaded files: ${error.message || error}. Please try again.`,
            variant: 'destructive'
          });
          setColumnsDetected({ file1: [], file2: [] });
          setMatchedFields([]);
        } finally {
          setIsProcessingFiles(false); // Set false *after* processing finishes
        }
      } else if (!file1 || !file2) {
         // If files are cleared while debounce timer is pending, clear columns/matches
         console.log('Files missing, resetting state.');
         setColumnsDetected({ file1: [], file2: [] });
         setMatchedFields([]);
         setIsProcessingFiles(false); // Ensure processing is off if files are removed
      }
    };

    // If files are selected, schedule the API call with debounce
    if (file1 && file2) {
        timer = setTimeout(callCreateReconAPI, 500);
    } else {
        // If files are not both selected, clear any pending timer
        // and reset column state immediately
        if (timer) clearTimeout(timer);
        setColumnsDetected({ file1: [], file2: [] });
        setMatchedFields([]);
        setIsProcessingFiles(false);
    }


    // Cleanup function: This runs when the effect re-runs or the component unmounts.
    // It ensures any pending API call scheduled by the previous effect run is cancelled.
    return () => {
      console.log('Cleaning up effect, clearing timer if exists.');
      if (timer) {
        clearTimeout(timer);
      }
    };

  }, [file1, file2, newWorkspaceName, toast]);


  const handleAutoMatch = async () => {
    if (columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0) {
      toast({
        title: 'No columns available',
        description: 'Please ensure both files are uploaded and processed first to detect columns.',
        variant: 'destructive'
      });
      return;
    }

    setIsAutoMatching(true);
    toast({ title: 'Auto-matching columns', description: 'Attempting API auto-match…' }); // Default variant assumed

    let newMatches: { field1: string; field2: string }[] = [];
    let usedApiMatches = false;

    try {
      const requestBody = {
        file1_columns: columnsDetected.file1,
        file2_columns: columnsDetected.file2
      };

      console.log('Calling /automatch API with:', requestBody);

      const response = await fetch('http://127.0.0.1:8000/automatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

       if (!response.ok) {
         let errorMsg = `API call failed with status: ${response.status}`;
          try {
              const errorData = await response.json();
              if (errorData && errorData.detail) {
                  errorMsg = `API Error: ${errorData.detail}`;
              } else {
                   const errorText = await response.text();
                   if (errorText) errorMsg = `API Error: ${errorText}`;
              }
          } catch (e) {
              // Ignore parsing errors
          }
         throw new Error(errorMsg);
      }

      const data: AutomatchApiResponse = await response.json(); // Use the union type

      console.log('Auto-match API Response:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys (if object):', typeof data === 'object' && data !== null && !Array.isArray(data) ? Object.keys(data) : 'N/A'); // Log keys only for objects

      // --- Check 1: Is it the expected mapping object format? ---
      const isMappingObjectFormat = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;
      let processedAsObject = false;

      if (isMappingObjectFormat) {
           let allEntriesAreValidStrings = true;
           // Check if all values are strings and keys/values are non-empty
           for (const key in data) {
               // Use 'in' operator to check if key exists on object
               if (Object.prototype.hasOwnProperty.call(data, key)) {
                   const value = data[key];
                   if (typeof value !== 'string' || !key || !value) {
                       allEntriesAreValidStrings = false;
                       console.warn(`API object entry invalid: key='${key}', value='${value}', type='${typeof value}'`);
                       break; // Found an invalid entry, stop checking this format
                   }
               }
           }

           if (allEntriesAreValidStrings) {
              console.log('API response looks like a valid mapping object. Processing...');
              usedApiMatches = true; // Mark that API matches were used
              processedAsObject = true; // Mark that we processed as object

              // Process the mapping object { key: value } -> { field1: key, field2: value }
              Object.entries(data).forEach(([key, value]) => {
                   // Add the mapping - value is confirmed string by check above
                   newMatches.push({ field1: key, field2: value as string });
              });
              console.log('Processed API matches from Object format:', newMatches.length);
           }
      }

      // --- Check 2: Is it the array of pairs format? (Only if not processed as object) ---
      let processedAsArray = false;
      if (!processedAsObject) {
           const isArrayOfPairsFormat = Array.isArray(data) &&
                                     data.length > 0 && // Ensure array is not empty
                                     data.every(item => // Check if every item is a valid pair
                                         Array.isArray(item) &&
                                         item.length === 2 &&
                                         typeof item[0] === 'string' && item[0] !== '' && // Ensure first element is non-empty string
                                         typeof item[1] === 'string' && item[1] !== ''  // Ensure second element is non-empty string
                                     );

           if (isArrayOfPairsFormat) {
               console.log('API response looks like a valid array of pairs. Processing...');
               usedApiMatches = true; // Mark that API matches were used
               processedAsArray = true; // Mark that we processed as array

               // Process the array of pairs [ [string, string], ... ]
               (data as Array<[string, string]>).forEach(pair => { // Type assertion for safety
                   newMatches.push({ field1: pair[0], field2: pair[1] });
               });
                console.log('Processed API matches from Array format:', newMatches.length);
           }
      }


      // --- Fallback Check: If neither API format recognized ---
      if (!processedAsObject && !processedAsArray) {
           console.warn('API response format not recognized (neither object mapping nor array of pairs). Falling back to client-side matching.');
           console.warn('Received data:', data); // Log the unexpected data structure
           usedApiMatches = false; // Explicitly ensure this is false to trigger fallback
      }


    } catch (error: any) { // Use any for error type
        console.error('Error calling auto-match API:', error);
        // API call failed, or threw error during processing
        toast({
          title: 'Auto-match API failed',
          description: `Failed to call the auto-match API or received unexpected data: ${error.message || error}. Performing client-side matching instead.`,
          variant: 'default' // Use 'default' for informational warning/fallback
        });
        usedApiMatches = false; // Explicitly ensure this is false to trigger fallback
        newMatches = []; // Clear any potentially incomplete matches if API failed completely
    } finally {
      // --- Perform client-side auto-matching ONLY if API matches were NOT used ---
      if (!usedApiMatches) {
          console.log('Executing client-side auto-matching...');
          // Use the detected columns from the state
          const file1Cols = columnsDetected.file1;
          const file2Cols = columnsDetected.file2;

          // If API processing failed or returned unusable data, newMatches might be empty or have partial data.
          // Clear it before running client-side matching to avoid duplicates/mixes.
          // This check should only be needed if the try block *partially* processed something before failing/falling back.
          // However, clearing it here is safer to ensure the fallback starts fresh.
          if (newMatches.length > 0) {
              console.warn('Clearing potentially incomplete matches before client-side fallback.');
              newMatches = [];
          }


          file1Cols.forEach(col1 => {
            // Try exact match first (case-insensitive, trim whitespace)
            let matchingCol2 = file2Cols.find(col2 =>
              col1.toLowerCase().trim() === col2.toLowerCase().trim()
            );

            // If no exact match, try partial matches (clean string comparison)
            if (!matchingCol2) {
              matchingCol2 = file2Cols.find(col2 => {
                const col1Clean = col1.toLowerCase().replace(/[^a-z0-9]/g, '');
                const col2Clean = col2.toLowerCase().replace(/[^a-z0-9]/g, '');
                 if (!col1Clean || !col2Clean) return false; // Avoid matching empty strings

                // Check if one clean string includes the other
                return col1Clean.includes(col2Clean) || col2Clean.includes(col1Clean);
              });
            }

            // Add the match if found and the file2 column hasn't been used in a match yet
            if (matchingCol2 && !newMatches.some(match => match.field2 === matchingCol2)) {
               if (col1 && matchingCol2) {
                    newMatches.push({ field1: col1, field2: matchingCol2 });
               }
            }
          });
          console.log('Client-side matches found:', newMatches.length);
      } else {
         // If API matches were used, log the count
         console.log(`API matches used: ${newMatches.length}`);
      }

      // --- Update state and show final toast ---
      setMatchedFields(newMatches);
      setIsAutoMatching(false);

      const source = usedApiMatches ? 'API' : 'Client-side fallback';
      toast({
        title: `Auto-match complete (${source})`,
        description: `${source} matching found ${newMatches.length} potential mappings.`,
        variant: newMatches.length > 0 ? 'default' : 'destructive' // Indicate problem if 0 matches were found by either method
      });
    }
  };


  const handleFieldChange = (index: number, field: 'field1' | 'field2', value: string) => {
    const updatedMappings = [...matchedFields];
    updatedMappings[index][field] = value;
    setMatchedFields(updatedMappings);
  };

  const handleAddMapping = () => {
    if (columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0) {
        toast({
            title: 'Cannot add mapping',
            description: 'Upload and process files first to detect columns.',
            variant: 'destructive'
        });
        return;
    }
    setMatchedFields([...matchedFields, { field1: '', field2: '' }]);
  };

  const handleRemoveMapping = (index: number) => {
    const updatedMappings = [...matchedFields];
    updatedMappings.splice(index, 1);
    setMatchedFields(updatedMappings);
  };

  const handleContinue = () => {
    if (!newWorkspaceName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide a name for the recon.',
        variant: 'destructive'
      });
      return;
    }

    if (!file1 || !file2) {
      toast({
        title: 'Missing files',
        description: 'Please upload both Entity 1 and Entity 2 files.',
        variant: 'destructive'
      });
      return;
    }

     if (isProcessingFiles) {
         toast({
             title: 'Processing in progress',
             description: 'Please wait for files to finish processing.',
             variant: 'default'
         });
         return;
     }

     if (columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0) {
          toast({
             title: 'Files not processed',
             description: 'Files are not yet processed. Please wait or re-upload if stuck.',
             variant: 'destructive'
         });
         return;
     }


    if (matchedFields.length === 0) {
      toast({
        title: 'No matched fields',
        description: 'Please match at least one field between the sources.',
        variant: 'destructive'
      });
      return;
    }

    const incompleteMappings = matchedFields.some(mapping => !mapping.field1 || !mapping.field2);
    if (incompleteMappings) {
      toast({
        title: 'Incomplete mappings',
        description: 'Please complete all field mappings or remove incomplete ones.',
        variant: 'destructive'
      });
      return;
    }

    sessionStorage.setItem('reconData', JSON.stringify({
      newWorkspaceName,
      file1: file1.name,
      file2: file2.name,
      matchedFields,
      columnsDetected
    }));

    navigate('/create-recon/validation');
  };

  const shouldShowFieldMapping = columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Recon</h1>
            <p className="text-muted-foreground">Step 1: Field Mapping</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Recon Name</Label>
              <Input
                id="workspace-name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g., Samsung Brand EMI Reconciliation"
                className="bg-black/30 border-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entity 1 File</Label>
                <FileUpload label="Entity 1" onFileChange={setFile1} />
              </div>
              <div className="space-y-2">
                <Label>Entity 2 File</Label>
                <FileUpload label="Entity 2" onFileChange={setFile2} />
              </div>
            </div>

            {isProcessingFiles && (
              <div className="flex items-center justify-center p-4 bg-blue-900/20 rounded-lg text-blue-300">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Processing files and extracting columns...</span>
              </div>
            )}
             {/* Show message if files selected but not processed yet */}
             {file1 && file2 && !isProcessingFiles && (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) && (
                  <div className="flex items-center justify-center p-4 bg-yellow-900/20 rounded-lg text-yellow-300">
                    <span className="text-sm">Files selected. Waiting for processing...</span>
                  </div>
             )}
          </CardContent>
        </Card>

        {shouldShowFieldMapping && (
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <div className="flex space-x-2 mt-2">
                <Button
                  size="sm"
                  onClick={handleAutoMatch}
                  disabled={isAutoMatching || isProcessingFiles || (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0)}
                  className="text-xs h-8"
                >
                  {isAutoMatching ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Processing…
                    </>
                  ) : (
                    'Auto-Match'
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddMapping}
                  variant="outline"
                  className="text-xs h-8"
                  disabled={isProcessingFiles || (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0)}
                >
                  Add Mapping
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0 ? (
                <div className="bg-gray-800/40 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <h4 className="text-xs text-gray-400 uppercase mb-2">
                        Entity 1
                        <span className="ml-2 text-cyan-400">
                          ({columnsDetected.file1.length} columns)
                        </span>
                      </h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {columnsDetected.file1.length > 0 ? (
                          columnsDetected.file1.map((col, i) => (
                            <div key={`file1-col-${i}`} className="text-sm bg-gray-700/30 px-2 py-1 rounded">
                              {col}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 px-2 py-1">
                            No columns detected yet for Entity 1.
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-400 uppercase mb-2">
                        Entity 2
                        <span className="ml-2 text-cyan-400">
                          ({columnsDetected.file2.length} columns)
                        </span>
                      </h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {columnsDetected.file2.length > 0 ? (
                          columnsDetected.file2.map((col, i) => (
                            <div key={`file2-col-${i}`} className="text-sm bg-gray-700/30 px-2 py-1 rounded">
                              {col}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 px-2 py-1">
                            No columns detected yet for Entity 2.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <h4 className="text-xs text-gray-400 uppercase mb-3">
                      Mapped Fields ({matchedFields.length})
                    </h4>
                    {matchedFields.length > 0 ? (
                      <div className="space-y-3">
                        {matchedFields.map((mapping, index) => (
                          <div key={`mapping-${index}`} className="flex items-center gap-3 bg-indigo-900/30 px-3 py-3 rounded-lg">
                            <div className="flex-1">
                              <Select
                                value={mapping.field1}
                                onValueChange={(value) => handleFieldChange(index, 'field1', value)}
                              >
                                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                  <SelectValue placeholder="Select Entity 1 Field" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  {columnsDetected.file1.map((field) => (
                                    <SelectItem key={`file1-${field}`} value={field} className="text-white hover:bg-gray-700">
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="text-gray-400 font-bold">↔</div>

                            <div className="flex-1">
                              <Select
                                value={mapping.field2}
                                onValueChange={(value) => handleFieldChange(index, 'field2', value)}
                              >
                                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                  <SelectValue placeholder="Select Entity 2 Field" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  {columnsDetected.file2.map((field) => (
                                    <SelectItem key={`file2-${field}`} value={field} className="text-white hover:bg-gray-700">
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => handleRemoveMapping(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm text-center">
                          No fields have been matched yet. Click "Auto-Match" to automatically match similar columns or "Add Mapping" to manually create mappings.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                 !isProcessingFiles && (
                  <div className="bg-gray-800/40 rounded-lg p-8">
                    <p className="text-gray-400 text-sm text-center">
                       Upload both files to see the extracted columns and start field mapping.
                    </p>
                  </div>
                 )
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            className="gradient-btn"
            disabled={!file1 || !file2 || !newWorkspaceName.trim() || isProcessingFiles || isAutoMatching || matchedFields.length === 0 || columnsDetected.file1.length === 0}
          >
            {isProcessingFiles ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : isAutoMatching ? (
               <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Auto-matching...
              </>
            ) : (
              'Continue to Validation Rules'
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRecon;