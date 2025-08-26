'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        avatarUrl: user?.avatarUrl || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // In a real app, you would save to your API
        toast.success('Profile updated successfully');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            address: '',
            avatarUrl: user?.avatarUrl || '',
        });
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="container mx-auto py-10 px-4">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Not Logged In</CardTitle>
                        <CardDescription>Please sign in to view your profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/auth/sign-in">Sign In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Sidebar */}
                <div className="md:w-1/3">
                    <Card>
                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                            <div className="flex justify-center mt-2">
                                {user.roles.map(role => (
                                    <Badge key={role} variant="secondary" className="mr-1">
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Joined {new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {/* <span>{user?.address || 'No address provided'}</span> */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Content */}
                <div className="md:w-2/3">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Profile Information</CardTitle>
                                {!isEditing ? (
                                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="space-x-2">
                                        <Button variant="outline" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="profile" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="profile">Profile</TabsTrigger>
                                    <TabsTrigger value="security">Security</TabsTrigger>
                                </TabsList>

                                <TabsContent value="profile" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Add your phone number"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Add your address"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="security" className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <Button>Change Password</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}