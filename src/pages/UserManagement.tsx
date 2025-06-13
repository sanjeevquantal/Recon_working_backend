import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { UserPlus, UserMinus, UserCheck, Edit2, Trash2, MoreHorizontal, Mail, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import UserForm from '@/components/user/UserForm';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  workspaces?: string[];
  permissions?: {
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
  };
}

interface Workspace {
  id: string;
  name: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock users data - updated with new role system
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Super Admin', 
      status: 'active', 
      lastLogin: '2025-04-01 14:30:00',
      workspaces: ['Samsung', 'HP'],
      permissions: {
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
      }
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'Checker', 
      status: 'active',
      lastLogin: '2025-04-02 09:15:00',
      workspaces: ['Godrej'],
      permissions: {
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
      }
    },
    { 
      id: '3', 
      name: 'Alice Johnson', 
      email: 'alice@example.com', 
      role: 'Maker', 
      status: 'active',
      lastLogin: '2025-03-30 16:45:00',
      workspaces: ['Samsung'],
      permissions: {
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
      }
    },
    { 
      id: '4', 
      name: 'Bob Williams', 
      email: 'bob@example.com', 
      role: 'Admin View', 
      status: 'inactive',
      lastLogin: '2025-03-25 11:20:00',
      workspaces: ['HP'],
      permissions: {
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
      }
    },
    { 
      id: '5', 
      name: 'Carol Martinez', 
      email: 'carol@example.com', 
      role: 'Report View', 
      status: 'active',
      lastLogin: '2025-04-01 08:50:00',
      workspaces: ['Godrej', 'HP'],
      permissions: {
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
      }
    }
  ]);

  // Mock workspaces
  const mockWorkspaces: Workspace[] = [
    { id: '1', name: 'Samsung' },
    { id: '2', name: 'Godrej' },
    { id: '3', name: 'HP' },
    { id: '4', name: 'Dell' },
    { id: '5', name: 'Apple' },
  ];

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'destructive';
      case 'Admin View':
        return 'default';
      case 'Report View':
        return 'secondary';
      case 'Maker':
        return 'outline';
      case 'Checker':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Get role description
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

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a random ID for new users
  const generateUserId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Handle invitation form submission
  const onInviteSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Get default permissions for the role
        const getDefaultPermissionsByRole = (role: string) => {
          switch (role) {
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
        
        // Create a new user from the form data
        const newUser: User = {
          id: generateUserId(),
          name: data.email.split('@')[0], // Use part of email as temporary name
          email: data.email,
          role: data.role,
          status: 'inactive', // New invited users start as inactive until they accept
          lastLogin: 'Never',
          workspaces: data.workspaces,
          permissions: getDefaultPermissionsByRole(data.role)
        };
        
        // Add the new user to the users array
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        // In a real application, you would send an email here
        console.log("Sending invitation email to:", data.email);
        
        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${data.email} with ${data.role} role.`
        });
        
        setInviteDialogOpen(false);
      } catch (error) {
        console.error("Error sending invitation:", error);
        toast({
          title: "Error",
          description: "Failed to send invitation. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000); // Simulate network delay
  };

  // Handle edit form submission
  const onEditSubmit = (data: any) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Update the user in the users array
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === currentUser.id 
              ? { ...user, ...data } 
              : user
          )
        );
        
        toast({
          title: "User updated",
          description: `${data.name}'s information has been updated with ${data.role} permissions.`
        });
        
        setEditSheetOpen(false);
        setCurrentUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Error",
          description: "Failed to update user. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000); // Simulate network delay
  };

  // Handle user selection with checkboxes
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  // Handle bulk selection
  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Open edit sheet with user data
  const openEditSheet = (user: User) => {
    setCurrentUser(user);
    setEditSheetOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle user deactivation
  const handleDeactivateUser = (userId: string, userName: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'inactive' } 
          : user
      )
    );
    
    toast({
      title: "User deactivated",
      description: `${userName} has been deactivated.`
    });
  };

  // Handle user activation
  const handleActivateUser = (userId: string, userName: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'active' } 
          : user
      )
    );
    
    toast({
      title: "User activated",
      description: `${userName} has been activated.`
    });
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (currentUser) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          // Remove the user from the users array
          setUsers(prevUsers => 
            prevUsers.filter(user => user.id !== currentUser.id)
          );
          
          toast({
            title: "User deleted",
            description: `${currentUser.name} has been permanently removed.`
          });
          
          setDeleteDialogOpen(false);
          setCurrentUser(null);
        } catch (error) {
          console.error("Error deleting user:", error);
          toast({
            title: "Error",
            description: "Failed to delete user. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsSubmitting(false);
        }
      }, 1000); // Simulate network delay
    }
  };

  // Handle resending invitation
  const handleResendInvitation = (email: string) => {
    // Simulate sending invitation email
    console.log("Resending invitation email to:", email);
    
    toast({
      title: "Invitation resent",
      description: `A new invitation has been sent to ${email}.`
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage users and their role-based permissions</p>
          </div>
          <Button 
            onClick={() => setInviteDialogOpen(true)} 
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite User</span>
          </Button>
        </div>

        {/* Role Information Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              User Roles & Permissions
            </CardTitle>
            <CardDescription>
              Overview of available user roles and their permissions across different modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <Badge variant="outline">Maker</Badge>
                <p className="text-sm text-muted-foreground">Can setup and run reconciliations, view and download reports</p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <Badge variant="outline">Checker</Badge>
                <p className="text-sm text-muted-foreground">Has Maker permissions plus approval permissions for recon setup and execution</p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <Badge variant="destructive">Super Admin</Badge>
                <p className="text-sm text-muted-foreground">All access and permissions - edit and view across all modules</p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <Badge variant="default">Admin View</Badge>
                <p className="text-sm text-muted-foreground">Only view access for all modules</p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <Badge variant="secondary">Report View</Badge>
                <p className="text-sm text-muted-foreground">Only reports/dashboard/analytics view and download access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage users and their permissions in your organization.
            </CardDescription>
            <div className="mt-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of users in your organization</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                      onCheckedChange={toggleAllUsers}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedUsers.includes(user.id)} 
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditSheet(user)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          
                          {user.status === 'inactive' && user.lastLogin === 'Never' && (
                            <DropdownMenuItem onClick={() => handleResendInvitation(user.email)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          
                          {user.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleDeactivateUser(user.id, user.name)}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleActivateUser(user.id, user.name)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to a new user to join your organization with role-based permissions.
            </DialogDescription>
          </DialogHeader>
          
          <UserForm 
            mode="invite"
            onSubmit={onInviteSubmit}
            onCancel={() => setInviteDialogOpen(false)}
            workspaces={mockWorkspaces}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user details, role, and workspace access. Permissions are automatically set based on role.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4">
            {currentUser && (
              <UserForm 
                mode="edit"
                onSubmit={onEditSubmit}
                onCancel={() => setEditSheetOpen(false)}
                defaultValues={{
                  name: currentUser.name,
                  email: currentUser.email,
                  role: currentUser.role,
                  workspaces: currentUser.workspaces || [],
                  permissions: currentUser.permissions || {
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
                  }
                }}
                workspaces={mockWorkspaces}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user's account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete {currentUser?.name}'s account?
            </p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UserManagement;
