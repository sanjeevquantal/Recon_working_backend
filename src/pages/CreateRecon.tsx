
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

// // Define a type that covers both possible API response formats or unknown
// type AutomatchApiResponse = { [key: string]: string } | Array<[string, string]> | any;


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
//                 // Ignore parsing errors, use default message
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

//   }, [file1, file2, newWorkspaceName, toast]);


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

//       const data: AutomatchApiResponse = await response.json(); // Use the union type

//       console.log('Auto-match API Response:', data);
//       console.log('Data type:', typeof data);
//       console.log('Data keys (if object):', typeof data === 'object' && data !== null && !Array.isArray(data) ? Object.keys(data) : 'N/A'); // Log keys only for objects

//       // --- Check 1: Is it the expected mapping object format? ---
//       const isMappingObjectFormat = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;
//       let processedAsObject = false;

//       if (isMappingObjectFormat) {
//            let allEntriesAreValidStrings = true;
//            // Check if all values are strings and keys/values are non-empty
//            for (const key in data) {
//                // Use 'in' operator to check if key exists on object
//                if (Object.prototype.hasOwnProperty.call(data, key)) {
//                    const value = data[key];
//                    if (typeof value !== 'string' || !key || !value) {
//                        allEntriesAreValidStrings = false;
//                        console.warn(`API object entry invalid: key='${key}', value='${value}', type='${typeof value}'`);
//                        break; // Found an invalid entry, stop checking this format
//                    }
//                }
//            }

//            if (allEntriesAreValidStrings) {
//               console.log('API response looks like a valid mapping object. Processing...');
//               usedApiMatches = true; // Mark that API matches were used
//               processedAsObject = true; // Mark that we processed as object

//               // Process the mapping object { key: value } -> { field1: key, field2: value }
//               Object.entries(data).forEach(([key, value]) => {
//                    // Add the mapping - value is confirmed string by check above
//                    newMatches.push({ field1: key, field2: value as string });
//               });
//               console.log('Processed API matches from Object format:', newMatches.length);
//            }
//       }

//       // --- Check 2: Is it the array of pairs format? (Only if not processed as object) ---
//       let processedAsArray = false;
//       if (!processedAsObject) {
//            const isArrayOfPairsFormat = Array.isArray(data) &&
//                                      data.length > 0 && // Ensure array is not empty
//                                      data.every(item => // Check if every item is a valid pair
//                                          Array.isArray(item) &&
//                                          item.length === 2 &&
//                                          typeof item[0] === 'string' && item[0] !== '' && // Ensure first element is non-empty string
//                                          typeof item[1] === 'string' && item[1] !== ''  // Ensure second element is non-empty string
//                                      );

//            if (isArrayOfPairsFormat) {
//                console.log('API response looks like a valid array of pairs. Processing...');
//                usedApiMatches = true; // Mark that API matches were used
//                processedAsArray = true; // Mark that we processed as array

//                // Process the array of pairs [ [string, string], ... ]
//                (data as Array<[string, string]>).forEach(pair => { // Type assertion for safety
//                    newMatches.push({ field1: pair[0], field2: pair[1] });
//                });
//                 console.log('Processed API matches from Array format:', newMatches.length);
//            }
//       }


//       // --- Fallback Check: If neither API format recognized ---
//       if (!processedAsObject && !processedAsArray) {
//            console.warn('API response format not recognized (neither object mapping nor array of pairs). Falling back to client-side matching.');
//            console.warn('Received data:', data); // Log the unexpected data structure
//            usedApiMatches = false; // Explicitly ensure this is false to trigger fallback
//       }


//     } catch (error: any) { // Use any for error type
//         console.error('Error calling auto-match API:', error);
//         // API call failed, or threw error during processing
//         toast({
//           title: 'Auto-match API failed',
//           description: `Failed to call the auto-match API or received unexpected data: ${error.message || error}. Performing client-side matching instead.`,
//           variant: 'default' // Use 'default' for informational warning/fallback
//         });
//         usedApiMatches = false; // Explicitly ensure this is false to trigger fallback
//         newMatches = []; // Clear any potentially incomplete matches if API failed completely
//     } finally {
//       // --- Perform client-side auto-matching ONLY if API matches were NOT used ---
//       if (!usedApiMatches) {
//           console.log('Executing client-side auto-matching...');
//           // Use the detected columns from the state
//           const file1Cols = columnsDetected.file1;
//           const file2Cols = columnsDetected.file2;

//           // If API processing failed or returned unusable data, newMatches might be empty or have partial data.
//           // Clear it before running client-side matching to avoid duplicates/mixes.
//           // This check should only be needed if the try block *partially* processed something before failing/falling back.
//           // However, clearing it here is safer to ensure the fallback starts fresh.
//           if (newMatches.length > 0) {
//               console.warn('Clearing potentially incomplete matches before client-side fallback.');
//               newMatches = [];
//           }


//           file1Cols.forEach(col1 => {
//             // Try exact match first (case-insensitive, trim whitespace)
//             let matchingCol2 = file2Cols.find(col2 =>
//               col1.toLowerCase().trim() === col2.toLowerCase().trim()
//             );

//             // If no exact match, try partial matches (clean string comparison)
//             if (!matchingCol2) {
//               matchingCol2 = file2Cols.find(col2 => {
//                 const col1Clean = col1.toLowerCase().replace(/[^a-z0-9]/g, '');
//                 const col2Clean = col2.toLowerCase().replace(/[^a-z0-9]/g, '');
//                  if (!col1Clean || !col2Clean) return false; // Avoid matching empty strings

//                 // Check if one clean string includes the other
//                 return col1Clean.includes(col2Clean) || col2Clean.includes(col1Clean);
//               });
//             }

//             // Add the match if found and the file2 column hasn't been used in a match yet
//             if (matchingCol2 && !newMatches.some(match => match.field2 === matchingCol2)) {
//                if (col1 && matchingCol2) {
//                     newMatches.push({ field1: col1, field2: matchingCol2 });
//                }
//             }
//           });
//           console.log('Client-side matches found:', newMatches.length);
//       } else {
//          // If API matches were used, log the count
//          console.log(`API matches used: ${newMatches.length}`);
//       }

//       // --- Update state and show final toast ---
//       setMatchedFields(newMatches);
//       setIsAutoMatching(false);

//       const source = usedApiMatches ? 'API' : 'Client-side fallback';
//       toast({
//         title: `Auto-match complete (${source})`,
//         description: `${source} matching found ${newMatches.length} potential mappings.`,
//         variant: newMatches.length > 0 ? 'default' : 'destructive' // Indicate problem if 0 matches were found by either method
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

//2ND TRY 

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

// // Define a type that covers the possible API response formats or unknown
// type AutomatchApiResponse =
//   | { [key: string]: string } // Object format: { key: value }
//   | Array<[string, string]>    // Array of pairs format: [ [string, string], ... ]
//   | Array<{ file1_column: string; file2_column: string }> // Array of objects format: [ {file1_column: string, file2_column: string}, ... ]
//   | any; // Fallback for unexpected formats


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
//                 // Ignore parsing errors, use default message
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

//   }, [file1, file2, newWorkspaceName, toast]);


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
//     let usedApiMatches = false; // Flag to track if any API format was successfully processed

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

//       const data: AutomatchApiResponse = await response.json(); // Use the union type

//       console.log('Auto-match API Response:', data);
//       console.log('Data type:', typeof data);
//       console.log('Data keys (if object):', typeof data === 'object' && data !== null && !Array.isArray(data) ? Object.keys(data) : 'N/A'); // Log keys only for objects

//       // --- Check 1: Is it the expected mapping object format? { key: value } ---
//       // Check if it's an object, not null, not an array, and has keys
//       const isMappingObjectFormat = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;

//       if (isMappingObjectFormat) {
//            let allEntriesAreValidStrings = true;
//            // Check if all values are strings
//            for (const key in data) {
//                // Use 'in' operator and hasOwnProperty for safety
//                if (Object.prototype.hasOwnProperty.call(data, key)) {
//                    const value = (data as { [key: string]: any })[key]; // Cast for type check
//                    if (typeof value !== 'string') {
//                        allEntriesAreValidStrings = false;
//                        console.warn(`API object entry invalid type: key='${key}', value='${value}', type='${typeof value}'`);
//                        break; // Found an invalid entry, stop checking this format
//                    }
//                }
//            }

//            if (allEntriesAreValidStrings) {
//               console.log('API response looks like a valid mapping object. Processing...');
//               usedApiMatches = true; // Mark that API matches were used

//               // Process the mapping object { key: value } -> { field1: key, field2: value }
//               Object.entries(data as { [key: string]: string }).forEach(([key, value]) => { // Cast for iteration
//                    // Add the mapping - value is confirmed string by check above
//                    newMatches.push({ field1: key, field2: value });
//               });
//               console.log('Processed API matches from Object format:', newMatches.length);
//            }
//       }

//       // --- Check 2: Is it the array of pairs format? [ [string, string], ... ] ---
//       // Only check if not already processed by format 1
//       if (!usedApiMatches) {
//            const isArrayOfPairsFormat = Array.isArray(data) &&
//                                      data.length > 0 && // Ensure array is not empty
//                                      data.every(item => // Check if every item is a valid pair
//                                          Array.isArray(item) &&
//                                          item.length === 2 &&
//                                          typeof item[0] === 'string' && item[0] !== null && // Ensure first element is string (empty allowed)
//                                          typeof item[1] === 'string' && item[1] !== null  // Ensure second element is string (empty allowed)
//                                      ); // Note: Adjusted checks to allow empty strings for flexibility, though API usually returns non-empty pairs in this format.

//            if (isArrayOfPairsFormat) {
//                console.log('API response looks like a valid array of pairs. Processing...');
//                usedApiMatches = true; // Mark that API matches were used

//                // Process the array of pairs [ [string, string], ... ]
//                (data as Array<[string, string]>).forEach(pair => { // Type assertion for safety
//                    newMatches.push({ field1: pair[0], field2: pair[1] });
//                });
//                 console.log('Processed API matches from Array format:', newMatches.length);
//            }
//       }


//       // --- Check 3: Is it the array of objects format? [ {file1_column: string, file2_column: string}, ... ] ---
//       // Only check if not already processed by format 1 or 2
//       if (!usedApiMatches) {
//           const isArrayOfObjectsFormat = Array.isArray(data) &&
//                                         data.every(item =>
//                                             item && typeof item === 'object' && !Array.isArray(item) && // Item is a non-null object
//                                             Object.prototype.hasOwnProperty.call(item, 'file1_column') && typeof item.file1_column === 'string' && // Has file1_column (string, potentially empty)
//                                             Object.prototype.hasOwnProperty.call(item, 'file2_column') && typeof item.file2_column === 'string' // Has file2_column (string, potentially empty)
//                                         );

//           if (isArrayOfObjectsFormat) {
//                console.log('API response looks like array of objects. Processing...');
//                usedApiMatches = true; // Mark that API matches were used

//                // Process the array of objects
//                (data as Array<{file1_column: string; file2_column: string}>).forEach(item => { // Type assertion
//                     // Add the mapping. Empty strings are handled correctly by the component's state structure.
//                     newMatches.push({ field1: item.file1_column, field2: item.file2_column });
//                });
//                console.log('Processed API matches from Array of Objects format:', newMatches.length);
//           }
//       }


//       // --- Fallback Check: If none of the API formats recognized ---
//       // usedApiMatches will be true if any of the above 'if' blocks successfully processed data
//       if (!usedApiMatches) {
//            console.warn('API response format not recognized (neither object mapping, array of pairs, nor array of objects). Falling back to client-side matching.');
//            console.warn('Received data:', data); // Log the unexpected data structure
//            // usedApiMatches remains false, which triggers the fallback in the finally block
//            newMatches = []; // Ensure newMatches is empty before client-side logic runs
//       }


//     } catch (error: any) { // Use any for error type
//         console.error('Error calling auto-match API:', error);
//         // API call failed completely, or threw error during processing
//         toast({
//           title: 'Auto-match API failed',
//           description: `Failed to call the auto-match API or received unexpected data: ${error.message || error}. Performing client-side matching instead.`,
//           variant: 'default' // Use 'default' for informational warning/fallback
//         });
//         usedApiMatches = false; // Explicitly ensure this is false to trigger fallback
//         newMatches = []; // Clear any potentially incomplete matches if API failed completely
//     } finally {
//       // --- Perform client-side auto-matching ONLY if API matches were NOT used ---
//       if (!usedApiMatches) {
//           console.log('Executing client-side auto-matching...');
//           // Use the detected columns from the state
//           const file1Cols = columnsDetected.file1;
//           const file2Cols = columnsDetected.file2;

//           // Client-side matching logic (existing)
//           file1Cols.forEach(col1 => {
//             // Avoid matching if col1 is empty (unlikely for File1 in this logic, but safe)
//             if (!col1) return;

//             // Try exact match first (case-insensitive, trim whitespace)
//             let matchingCol2 = file2Cols.find(col2 =>
//                 col2 && col1.toLowerCase().trim() === col2.toLowerCase().trim() // Check col2 exists and is non-empty before trim/lower
//             );

//             // If no exact match, try partial matches (clean string comparison)
//             if (!matchingCol2) {
//               matchingCol2 = file2Cols.find(col2 => {
//                 if (!col2) return false; // Ensure col2 exists
//                 const col1Clean = col1.toLowerCase().replace(/[^a-z0-9]/g, '');
//                 const col2Clean = col2.toLowerCase().replace(/[^a-z0-9]/g, '');
//                  if (!col1Clean || !col2Clean) return false; // Avoid matching empty strings after cleaning

//                 // Check if one clean string includes the other
//                 return col1Clean.includes(col2Clean) || col2Clean.includes(col1Clean);
//               });
//             }

//             // Add the match if found and the file2 column hasn't been used in a match yet
//             // Note: Client-side only creates non-empty matches. API can provide empty ones.
//             if (matchingCol2 && !newMatches.some(match => match.field2 === matchingCol2)) {
//                // Add the match if found
//                newMatches.push({ field1: col1, field2: matchingCol2 });
//             }
//           });
//           console.log('Client-side matches found:', newMatches.length);
//       } else {
//          // If API matches were used, the newMatches array is already populated from the try block
//          console.log(`API matches used: ${newMatches.length}`);
//       }

//       // --- Update state and show final toast ---
//       setMatchedFields(newMatches);
//       setIsAutoMatching(false);

//       const source = usedApiMatches ? 'API' : 'Client-side fallback';
//       // Check if *any* matches were found by either method for the toast variant
//       const toastVariant = newMatches.length > 0 ? 'default' : 'destructive'; // Use 'default' or 'success', 'destructive' for zero matches

//       toast({
//         title: `Auto-match complete (${source})`,
//         description: `${source} matching found ${newMatches.length} potential mappings.`,
//         variant: toastVariant
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
//             disabled={!file1 || !file2 || !newWorkspaceName.trim() || isProcessingFiles || isAutoMatching || matchedFields.length === 0 || columnsDetected.file1.length === 0 || columnsDetected.file2.length === 0} // Added column count check to disable button if files processed but no columns found (error state)
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

//3RD TRY 
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

// Define a type that covers the possible API response formats or unknown
type AutomatchApiResponse =
  | { [key: string]: string } // Object format: { key: value }
  | Array<[string, string]>    // Array of pairs format: [ [string, string], ... ]
  | Array<{ file1_column: string; file2_column: string }> // Array of objects format: [ {file1_column: string, file2_column: string}, ... ]
  | any; // Fallback for unexpected formats


const CreateRecon = () => {
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [columnsDetected, setColumnsDetected] = useState<{ file1: string[]; file2: string[] }>({ file1: [], file2: [] });
  // Initialize matchedFields state with default empty strings
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
        // Set processing state *before* the API call starts
        setIsProcessingFiles(true);
        // Clear previous columns and matches immediately when processing starts
        setColumnsDetected({ file1: [], file2: [] });
        setMatchedFields([]);

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

          // Clear matches after new columns are detected, as old matches are likely invalid
          setMatchedFields([]);

          toast({
            title: 'Files processed successfully',
            description: `Extracted ${newColumnsDetected.file1.length} columns from Entity 1 and ${newColumnsDetected.file2.length} columns from Entity 2.`
          });

        } catch (error: any) {
          console.error('Error calling create-recon API:', error);
          toast({
            title: 'Error processing files',
            description: `Failed to process the uploaded files: ${error.message || error}. Please check file format and try again.`,
            variant: 'destructive'
          });
          // Ensure state is reset on error
          setColumnsDetected({ file1: [], file2: [] });
          setMatchedFields([]);
        } finally {
          setIsProcessingFiles(false); // Set false *after* processing finishes
        }
      } else if (!file1 || !file2) {
         // If files are cleared while debounce timer is pending, clear columns/matches
         console.log('Files missing, resetting state.');
         if (timer) clearTimeout(timer); // Ensure timer is cleared if files are removed
         setColumnsDetected({ file1: [], file2: [] });
         setMatchedFields([]);
         setIsProcessingFiles(false); // Ensure processing is off if files are removed
      }
    };

    // If files are selected, schedule the API call with debounce
    // Debounce logic: wait 500ms after file state stabilizes before calling API
    if (file1 && file2) {
        // Clear any existing timer before setting a new one
        if (timer) clearTimeout(timer);
        timer = setTimeout(callCreateReconAPI, 500);
    } else {
        // If files are not both selected, clear any pending timer
        // and reset column state immediately
        if (timer) clearTimeout(timer);
        // Only reset if files *were* previously selected and now aren't both present
        // This prevents resetting on initial load
        if (columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0 || matchedFields.length > 0 || isProcessingFiles) {
             console.log('Files removed, resetting column/match state.');
             setColumnsDetected({ file1: [], file2: [] });
             setMatchedFields([]);
             setIsProcessingFiles(false);
        }
    }


    // Cleanup function: This runs when the effect re-runs or the component unmounts.
    // It ensures any pending API call scheduled by the previous effect run is cancelled.
    return () => {
      console.log('Cleaning up effect, clearing timer if exists.');
      if (timer) {
        clearTimeout(timer);
      }
    };

  }, [file1, file2, newWorkspaceName, toast]); // Depend on files and name


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
    // Clear existing manual matches before attempting auto-match
    setMatchedFields([]);
    toast({ title: 'Auto-matching columns', description: 'Attempting API auto-match…' }); // Default variant assumed

    let newMatches: { field1: string; field2: string }[] = [];
    let usedApiMatches = false; // Flag to track if any API format was successfully processed

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

      // Check 1: Is it the expected mapping object format? { key: value }
      // Ensure data is an object, not null, not an array, and has keys
      const isMappingObjectFormat = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;

      if (isMappingObjectFormat) {
           let allEntriesAreValidStrings = true;
           // Check if all values are strings
           for (const key in data) {
               // Use 'in' operator and hasOwnProperty for safety
               if (Object.prototype.hasOwnProperty.call(data, key)) {
                   const value = (data as { [key: string]: any })[key]; // Cast for type check
                   if (typeof value !== 'string') {
                       allEntriesAreValidStrings = false;
                       console.warn(`API object entry invalid type: key='${key}', value='${value}', type='${typeof value}'`);
                       break; // Found an invalid entry, stop checking this format
                   }
               }
           }

           if (allEntriesAreValidStrings) {
              console.log('API response looks like a valid mapping object. Processing...');
              usedApiMatches = true; // Mark that API matches were used

              // Process the mapping object { key: value } -> { field1: key, field2: value }
              Object.entries(data as { [key: string]: string }).forEach(([key, value]) => { // Cast for iteration
                   // Add the mapping. Treat empty strings from API as needing user attention or ignore
                   newMatches.push({ field1: key, field2: value || '' }); // Use empty string if API returns null/empty for a value
              });
              console.log('Processed API matches from Object format:', newMatches.length);
           }
      }

      // Check 2: Is it the array of pairs format? [ [string, string], ... ]
      // Only check if not already processed by format 1
      if (!usedApiMatches) {
           const isArrayOfPairsFormat = Array.isArray(data) &&
                                     data.length > 0 && // Ensure array is not empty
                                     data.every(item => // Check if every item is a valid pair
                                         Array.isArray(item) &&
                                         item.length === 2 &&
                                         typeof item[0] === 'string' && // Ensure first element is string
                                         typeof item[1] === 'string'  // Ensure second element is string
                                     );

           if (isArrayOfPairsFormat) {
               console.log('API response looks like a valid array of pairs. Processing...');
               usedApiMatches = true; // Mark that API matches were used

               // Process the array of pairs [ [string, string], ... ]
               (data as Array<[string, string]>).forEach(pair => { // Type assertion for safety
                   // Add the mapping. Treat empty strings from API as needing user attention or ignore
                   newMatches.push({ field1: pair[0] || '', field2: pair[1] || '' });
               });
                console.log('Processed API matches from Array format:', newMatches.length);
           }
      }


      // Check 3: Is it the array of objects format? [ {file1_column: string, file2_column: string}, ... ]
      // Only check if not already processed by format 1 or 2
      if (!usedApiMatches) {
          const isArrayOfObjectsFormat = Array.isArray(data) &&
                                        data.every(item =>
                                            item && typeof item === 'object' && !Array.isArray(item) && // Item is a non-null object
                                            Object.prototype.hasOwnProperty.call(item, 'file1_column') && typeof item.file1_column === 'string' && // Has file1_column (string)
                                            Object.prototype.hasOwnProperty.call(item, 'file2_column') && typeof item.file2_column === 'string' // Has file2_column (string)
                                        );

          if (isArrayOfObjectsFormat) {
               console.log('API response looks like array of objects. Processing...');
               usedApiMatches = true; // Mark that API matches were used

               // Process the array of objects
               (data as Array<{file1_column: string; file2_column: string}>).forEach(item => { // Type assertion
                    // Add the mapping. Treat empty strings from API as needing user attention or ignore
                    newMatches.push({ field1: item.file1_column || '', field2: item.file2_column || '' });
               });
               console.log('Processed API matches from Array of Objects format:', newMatches.length);
          }
      }


      // --- Fallback Check: If none of the API formats recognized ---
      if (!usedApiMatches) {
           console.warn('API response format not recognized (neither object mapping, array of pairs, nor array of objects). Falling back to client-side matching.');
           console.warn('Received data:', data); // Log the unexpected data structure
           // usedApiMatches remains false, which triggers the fallback in the finally block
           newMatches = []; // Ensure newMatches is empty before client-side logic runs
      }


    } catch (error: any) { // Use any for error type
        console.error('Error calling auto-match API:', error);
        // API call failed completely, or threw error during processing
        toast({
          title: 'Auto-match failed',
          description: `Failed to call the auto-match API or received unexpected data: ${error.message || error}. Performing client-side matching instead.`,
          variant: 'default' // Use 'default' for informational warning/fallback
        });
        usedApiMatches = false; // Explicitly ensure this is false to trigger fallback
        newMatches = []; // Clear any potentially incomplete matches if API failed completely
    } finally {
      // --- Perform client-side auto-matching ONLY if API matches were NOT used ---
      // This logic will run if usedApiMatches is false (either due to API error or unrecognized format)
      if (!usedApiMatches) {
          console.log('Executing client-side auto-matching...');
          // Use the detected columns from the state
          const file1Cols = columnsDetected.file1;
          const file2Cols = columnsDetected.file2;

          // Client-side matching logic (existing)
          file1Cols.forEach(col1 => {
            // Avoid matching if col1 is empty (unlikely for File1 in this logic, but safe)
            if (!col1) return;

            // Try exact match first (case-insensitive, trim whitespace)
            let matchingCol2 = file2Cols.find(col2 =>
                col2 && col1.toLowerCase().trim() === col2.toLowerCase().trim() // Check col2 exists and is non-empty before trim/lower
            );

            // If no exact match, try partial matches (clean string comparison)
            if (!matchingCol2) {
              matchingCol2 = file2Cols.find(col2 => {
                if (!col2) return false; // Ensure col2 exists
                const col1Clean = col1.toLowerCase().replace(/[^a-z0-9]/g, '');
                const col2Clean = col2.toLowerCase().replace(/[^a-z0-9]/g, '');
                 if (!col1Clean || !col2Clean) return false; // Avoid matching empty strings after cleaning

                // Check if one clean string includes the other
                return col1Clean.includes(col2Clean) || col2Clean.includes(col1Clean);
              });
            }

            // Add the match if found and the file2 column hasn't been used in a match yet
            // Note: Client-side only creates non-empty matches. API can provide empty ones.
            // We also prevent duplicate matches based on field1
            if (matchingCol2 && !newMatches.some(match => match.field1 === col1)) {
               // Add the match if found
               newMatches.push({ field1: col1, field2: matchingCol2 });
            }
          });
          console.log('Client-side matches found:', newMatches.length);
      } else {
         // If API matches were used, the newMatches array is already populated from the try block
         console.log(`API matches used: ${newMatches.length}`);
      }

      // --- Update state and show final toast ---
      setMatchedFields(newMatches);
      setIsAutoMatching(false);

      const source = usedApiMatches ? 'API' : 'Client-side fallback';
      // Check if *any* matches were found by either method for the toast variant
      const toastVariant = newMatches.length > 0 ? 'default' : 'destructive'; // Use 'default' or 'success', 'destructive' for zero matches

      toast({
        title: `Auto-match complete (${source})`,
        description: `${source} matching found ${newMatches.length} potential mappings.`,
        variant: toastVariant
      });
    }
  };


  const handleFieldChange = (index: number, field: 'field1' | 'field2', value: string) => {
    const updatedMappings = [...matchedFields];
    updatedMappings[index][field] = value;
    setMatchedFields(updatedMappings);
  };

  const handleAddMapping = () => {
    if (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) {
        toast({
            title: 'Cannot add mapping',
            description: 'Upload and process files first to detect columns.',
            variant: 'destructive'
        });
        return;
    }
    // Add a new mapping with empty strings, allowing user to select or IGNORE
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

     if (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) {
          // This case happens if files were uploaded but no columns were detected, likely an error
          toast({
             title: 'Files not processed',
             description: 'No columns detected. Please re-upload files.',
             variant: 'destructive'
         });
         return;
     }


    if (matchedFields.length === 0) {
      toast({
        title: 'No matched fields',
        description: 'Please match at least one field between the sources or add a mapping.',
        variant: 'destructive'
      });
      return;
    }

    // --- Validation Logic Update ---
    // A mapping is considered complete if *both* field1 and field2 are NOT empty strings.
    // Selecting 'IGNORE' or a column name is considered 'not empty'.
    const incompleteMappings = matchedFields.some(mapping => mapping.field1 === '' || mapping.field2 === '');

    if (incompleteMappings) {
      toast({
        title: 'Incomplete mappings',
        description: 'Please complete all field mappings by selecting a column or "Ignore", or remove incomplete ones.',
        variant: 'destructive'
      });
      return;
    }

    // Filter out mappings where both sides are 'IGNORE', as they might not be useful
    // or could clutter subsequent steps, but allow mappings where one side is a column and the other is IGNORE
    const validMappings = matchedFields.filter(mapping => mapping.field1 !== 'IGNORE' || mapping.field2 !== 'IGNORE');

    // If after filtering, there are no mappings left that involve at least one column, show a warning
    // This is a soft check to ensure some real mapping is attempted, but doesn't strictly block
    // based on your request to allow 'IGNORE' to proceed. The main block above ensures no *empty* strings exist.
    // We proceed as long as the 'incompleteMappings' check passes.

    sessionStorage.setItem('reconData', JSON.stringify({
      newWorkspaceName,
      file1: file1.name,
      file2: file2.name,
      // Store the mappings as they are (including IGNORE), the next page might filter them
      matchedFields: matchedFields,
      columnsDetected
    }));

    navigate('/create-recon/validation');
  };

  // Determine if the field mapping section should be shown (only if files are selected OR columns have been detected)
  const shouldShowFieldMappingSection = file1 || file2 || columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0 || isProcessingFiles;
   // Determine if the actual mapping interface should be shown (only if columns are detected)
  const shouldShowFieldMappingInterface = columnsDetected.file1.length > 0 || columnsDetected.file2.length > 0;


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
             {/* Show message if files selected but not processed yet AND not currently processing */}
             {file1 && file2 && !isProcessingFiles && (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) && (
                  <div className="flex items-center justify-center p-4 bg-yellow-900/20 rounded-lg text-yellow-300">
                    <span className="text-sm">Files selected. Waiting for processing...</span>
                  </div>
             )}
             {/* Show message if files were processed but no columns were found */}
              {file1 && file2 && !isProcessingFiles && (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) && (
                  <div className="flex items-center justify-center p-4 bg-red-900/20 rounded-lg text-red-300">
                      <span className="text-sm">Error: No columns detected in the files. Please check file contents and try again.</span>
                  </div>
              )}
          </CardContent>
        </Card>

        {/* Show the field mapping section only if files have been selected or columns detected */}
        {shouldShowFieldMappingSection && (
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              {/* Buttons are only enabled if columns have been detected */}
              {shouldShowFieldMappingInterface && (
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
               )}
            </CardHeader>
            <CardContent>
              {/* Show columns if detected */}
              {shouldShowFieldMappingInterface ? (
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
                                  {/* Display "Select Entity 1 Field" or the selected value */}
                                  <SelectValue placeholder="Select Entity 1 Field" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                   {/* Option to ignore */}
                                   <SelectItem value="IGNORE" className="text-yellow-400 hover:bg-gray-700">
                                      IGNORE
                                   </SelectItem>
                                  {/* Map detected columns */}
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
                                  {/* Display "Select Entity 2 Field" or the selected value */}
                                  <SelectValue placeholder="Select Entity 2 Field" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                   {/* Option to ignore */}
                                   <SelectItem value="IGNORE" className="text-yellow-400 hover:bg-gray-700">
                                      IGNORE
                                   </SelectItem>
                                  {/* Map detected columns */}
                                  {columnsDetected.file2.map((field) => (
                                    <SelectItem key={`file2-${field}`} value={field} className="text-white hover:bg-gray-700">
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Remove button */}
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
                       // Message shown if columns are detected but no mappings exist yet
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm text-center">
                          No fields have been matched yet. Click "Auto-Match" to automatically match similar columns or "Add Mapping" to manually create mappings.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                 // Message shown when files are selected but columns haven't been detected yet or error occurred
                 !isProcessingFiles && (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) && (
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
            // Button is disabled if:
            // - Files are missing
            // - Recon name is missing
            // - Files are still processing
            // - Auto-matching is in progress
            // - Columns haven't been detected yet (prevents proceeding if file processing failed)
            // - No mappings have been added
            // - There are incomplete mappings (where field1 or field2 is still an empty string, 'IGNORE' is allowed)
            disabled={
                !file1 ||
                !file2 ||
                !newWorkspaceName.trim() ||
                isProcessingFiles ||
                isAutoMatching ||
                (columnsDetected.file1.length === 0 && columnsDetected.file2.length === 0) || // Ensure columns were detected successfully
                matchedFields.length === 0 ||
                matchedFields.some(mapping => mapping.field1 === '' || mapping.field2 === '') // Check for actual empty strings (not 'IGNORE')
            }
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