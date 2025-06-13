
import React, { useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the interfaces and types
interface Workspace {
  id: string;
  name: string;
}

// Define the permissions interface for better typing
interface Permissions {
  reconSetup: {
    setupNewRecon: boolean;
    setupValidations: boolean;
    setupExceptions: boolean;
    setupRules: boolean;
    viewReports: boolean;
    downloadReports: boolean;
    approvalPermission: boolean;
  };
  runRecon: {
    runRecon: boolean;
    approveRecon: boolean;
    viewReports: boolean;
    downloadReports: boolean;
  };
  adminUser: {
    createRecon: boolean;
    closeExceptions: boolean;
    viewReports: boolean;
    editUsers: boolean;
    viewUsers: boolean;
    downloadReports: boolean;
    viewDashboard: boolean;
    viewAnalytics: boolean;
  };
  reportUser: {
    viewReports: boolean;
    viewDashboard: boolean;
    viewAnalytics: boolean;
    downloadReports: boolean;
  };
}

// Define separate schemas for invite and edit forms
const inviteUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  workspaces: z.array(z.string()).min(1, { message: "Please select at least one workspace." }),
});

const editUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  workspaces: z.array(z.string()).min(1, { message: "Please select at least one workspace." }),
  permissions: z.object({
    reconSetup: z.object({
      setupNewRecon: z.boolean().default(false),
      setupValidations: z.boolean().default(false),
      setupExceptions: z.boolean().default(false),
      setupRules: z.boolean().default(false),
      viewReports: z.boolean().default(false),
      downloadReports: z.boolean().default(false),
      approvalPermission: z.boolean().default(false),
    }),
    runRecon: z.object({
      runRecon: z.boolean().default(false),
      approveRecon: z.boolean().default(false),
      viewReports: z.boolean().default(false),
      downloadReports: z.boolean().default(false),
    }),
    adminUser: z.object({
      createRecon: z.boolean().default(false),
      closeExceptions: z.boolean().default(false),
      viewReports: z.boolean().default(false),
      editUsers: z.boolean().default(false),
      viewUsers: z.boolean().default(false),
      downloadReports: z.boolean().default(false),
      viewDashboard: z.boolean().default(false),
      viewAnalytics: z.boolean().default(false),
    }),
    reportUser: z.object({
      viewReports: z.boolean().default(false),
      viewDashboard: z.boolean().default(false),
      viewAnalytics: z.boolean().default(false),
      downloadReports: z.boolean().default(false),
    }),
  }),
});

// Define separate types for invite and edit form data
type InviteFormValues = z.infer<typeof inviteUserSchema>;
type EditFormValues = z.infer<typeof editUserSchema>;

// Combined type that depends on mode
type FormValues = InviteFormValues | EditFormValues;

interface UserFormProps {
  mode: 'invite' | 'edit';
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<EditFormValues>;
  workspaces: Workspace[];
}

// Function to get default permissions based on role
const getDefaultPermissionsByRole = (role: string): Permissions => {
  switch (role) {
    case 'Maker':
      return {
        reconSetup: {
          setupNewRecon: true,
          setupValidations: true,
          setupExceptions: true,
          setupRules: true,
          viewReports: true,
          downloadReports: true,
          approvalPermission: false,
        },
        runRecon: {
          runRecon: true,
          approveRecon: false,
          viewReports: true,
          downloadReports: true,
        },
        adminUser: {
          createRecon: false,
          closeExceptions: false,
          viewReports: false,
          editUsers: false,
          viewUsers: false,
          downloadReports: false,
          viewDashboard: false,
          viewAnalytics: false,
        },
        reportUser: {
          viewReports: false,
          viewDashboard: false,
          viewAnalytics: false,
          downloadReports: false,
        },
      };
    case 'Checker':
      return {
        reconSetup: {
          setupNewRecon: true,
          setupValidations: true,
          setupExceptions: true,
          setupRules: true,
          viewReports: true,
          downloadReports: true,
          approvalPermission: true,
        },
        runRecon: {
          runRecon: false,
          approveRecon: true,
          viewReports: true,
          downloadReports: true,
        },
        adminUser: {
          createRecon: false,
          closeExceptions: false,
          viewReports: false,
          editUsers: false,
          viewUsers: false,
          downloadReports: false,
          viewDashboard: false,
          viewAnalytics: false,
        },
        reportUser: {
          viewReports: false,
          viewDashboard: false,
          viewAnalytics: false,
          downloadReports: false,
        },
      };
    case 'Super Admin':
      return {
        reconSetup: {
          setupNewRecon: true,
          setupValidations: true,
          setupExceptions: true,
          setupRules: true,
          viewReports: true,
          downloadReports: true,
          approvalPermission: true,
        },
        runRecon: {
          runRecon: true,
          approveRecon: true,
          viewReports: true,
          downloadReports: true,
        },
        adminUser: {
          createRecon: true,
          closeExceptions: true,
          viewReports: true,
          editUsers: true,
          viewUsers: true,
          downloadReports: true,
          viewDashboard: true,
          viewAnalytics: true,
        },
        reportUser: {
          viewReports: true,
          viewDashboard: true,
          viewAnalytics: true,
          downloadReports: true,
        },
      };
    case 'Admin View':
      return {
        reconSetup: {
          setupNewRecon: false,
          setupValidations: false,
          setupExceptions: false,
          setupRules: false,
          viewReports: true,
          downloadReports: true,
          approvalPermission: false,
        },
        runRecon: {
          runRecon: false,
          approveRecon: false,
          viewReports: true,
          downloadReports: true,
        },
        adminUser: {
          createRecon: false,
          closeExceptions: false,
          viewReports: true,
          editUsers: false,
          viewUsers: true,
          downloadReports: true,
          viewDashboard: true,
          viewAnalytics: true,
        },
        reportUser: {
          viewReports: true,
          viewDashboard: true,
          viewAnalytics: true,
          downloadReports: true,
        },
      };
    case 'Report View':
      return {
        reconSetup: {
          setupNewRecon: false,
          setupValidations: false,
          setupExceptions: false,
          setupRules: false,
          viewReports: false,
          downloadReports: false,
          approvalPermission: false,
        },
        runRecon: {
          runRecon: false,
          approveRecon: false,
          viewReports: false,
          downloadReports: false,
        },
        adminUser: {
          createRecon: false,
          closeExceptions: false,
          viewReports: false,
          editUsers: false,
          viewUsers: false,
          downloadReports: false,
          viewDashboard: false,
          viewAnalytics: false,
        },
        reportUser: {
          viewReports: true,
          viewDashboard: true,
          viewAnalytics: true,
          downloadReports: true,
        },
      };
    default:
      return {
        reconSetup: {
          setupNewRecon: false,
          setupValidations: false,
          setupExceptions: false,
          setupRules: false,
          viewReports: false,
          downloadReports: false,
          approvalPermission: false,
        },
        runRecon: {
          runRecon: false,
          approveRecon: false,
          viewReports: false,
          downloadReports: false,
        },
        adminUser: {
          createRecon: false,
          closeExceptions: false,
          viewReports: false,
          editUsers: false,
          viewUsers: false,
          downloadReports: false,
          viewDashboard: false,
          viewAnalytics: false,
        },
        reportUser: {
          viewReports: false,
          viewDashboard: false,
          viewAnalytics: false,
          downloadReports: false,
        },
      };
  }
};

// Function to get role description
const getRoleDescription = (role: string) => {
  switch (role) {
    case 'Maker':
      return 'Can setup and run reconciliations, view and download reports';
    case 'Checker':
      return 'Has Maker permissions plus approval permissions for recon setup and execution';
    case 'Super Admin':
      return 'All access and permissions - edit and view across all modules';
    case 'Admin View':
      return 'Only view access for all modules';
    case 'Report View':
      return 'Only reports/dashboard/analytics view and download access';
    default:
      return '';
  }
};

const UserForm: React.FC<UserFormProps> = ({
  mode,
  onSubmit,
  onCancel,
  defaultValues,
  workspaces
}) => {
  // Set up default values based on form mode
  const formDefaultValues = mode === 'invite' 
    ? {
        email: defaultValues?.email || "",
        role: defaultValues?.role || "",
        workspaces: defaultValues?.workspaces || [],
      } as InviteFormValues
    : {
        name: defaultValues?.name || "",
        email: defaultValues?.email || "",
        role: defaultValues?.role || "",
        workspaces: defaultValues?.workspaces || [],
        permissions: defaultValues?.permissions || getDefaultPermissionsByRole(defaultValues?.role || ""),
      } as EditFormValues;

  // Initialize form with correct types and schema
  const form = useForm<FormValues>({
    resolver: mode === 'invite' 
      ? zodResolver(inviteUserSchema)
      : zodResolver(editUserSchema),
    defaultValues: formDefaultValues,
  });

  // Watch for role changes to update permissions automatically
  const watchedRole = form.watch('role');

  useEffect(() => {
    if (mode === 'edit' && watchedRole) {
      const newPermissions = getDefaultPermissionsByRole(watchedRole);
      form.setValue('permissions', newPermissions);
    }
  }, [watchedRole, mode, form]);

  // Handle the submit based on form mode
  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {mode === 'edit' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover border border-input shadow-md">
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin View">Admin View</SelectItem>
                  <SelectItem value="Report View">Report View</SelectItem>
                  <SelectItem value="Maker">Maker</SelectItem>
                  <SelectItem value="Checker">Checker</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {getRoleDescription(watchedRole)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="workspaces"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Workspace Access</FormLabel>
                <FormDescription>
                  Select which workspaces this user can access
                </FormDescription>
              </div>
              <div className={mode === 'edit' ? "grid grid-cols-2 gap-2" : ""}>
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="flex flex-row items-start space-x-3 space-y-0 mb-3">
                    <FormControl>
                      <Checkbox
                        checked={form.getValues("workspaces").includes(workspace.name)}
                        onCheckedChange={(checked) => {
                          const currentValues = form.getValues("workspaces");
                          if (checked) {
                            form.setValue("workspaces", [...currentValues, workspace.name]);
                          } else {
                            form.setValue(
                              "workspaces",
                              currentValues.filter((value) => value !== workspace.name)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {workspace.name}
                    </FormLabel>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {mode === 'edit' && (
          <FormField
            control={form.control}
            name="permissions"
            render={() => {
              const currentPermissions = (form.getValues() as EditFormValues).permissions;
              const currentRole = form.getValues('role');
              const isReadOnly = currentRole !== 'Super Admin';
              
              return (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Module Permissions</FormLabel>
                    <FormDescription>
                      {isReadOnly 
                        ? `Permissions are automatically set based on the ${currentRole} role`
                        : "Control what actions the user can perform in each module"
                      }
                    </FormDescription>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Recon Setup Module */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recon Setup</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reconSetup.setupNewRecon}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reconSetup.setupNewRecon", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Setup New Recon</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reconSetup.setupValidations}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reconSetup.setupValidations", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Setup Validations</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reconSetup.setupExceptions}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reconSetup.setupExceptions", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Setup Exceptions</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reconSetup.setupRules}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reconSetup.setupRules", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Setup Rules</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reconSetup.approvalPermission}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reconSetup.approvalPermission", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Approval Permission</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reconSetup.viewReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reconSetup.viewReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Reports</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reconSetup.downloadReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reconSetup.downloadReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Download Reports</FormLabel>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Run Recon Module */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Run Recon</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.runRecon.runRecon}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.runRecon.runRecon", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Run Recon</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.runRecon.approveRecon}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.runRecon.approveRecon", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Approve Recon</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.runRecon.viewReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.runRecon.viewReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Reports</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.runRecon.downloadReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.runRecon.downloadReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Download Reports</FormLabel>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Admin User Module */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Admin User</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.editUsers}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.editUsers", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Edit Users</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.viewUsers}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.viewUsers", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Users</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.createRecon}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.createRecon", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Create Recon</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.closeExceptions}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.closeExceptions", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Close Exceptions</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.viewReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.viewReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Reports</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.downloadReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.downloadReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Download Reports</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.viewDashboard}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.viewDashboard", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Dashboard</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.adminUser.viewAnalytics}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.adminUser.viewAnalytics", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Analytics</FormLabel>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Report User Module */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Report User</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reportUser.viewReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reportUser.viewReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Reports</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reportUser.viewDashboard}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reportUser.viewDashboard", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Dashboard</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reportUser.viewAnalytics}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reportUser.viewAnalytics", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">View Analytics</FormLabel>
                        </div>
                        
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentPermissions.reportUser.downloadReports}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) => {
                                if (!isReadOnly) {
                                  form.setValue("permissions.reportUser.downloadReports", checked === true, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Download Reports</FormLabel>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </FormItem>
              );
            }}
          />
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === 'invite' ? 'Send Invitation' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
