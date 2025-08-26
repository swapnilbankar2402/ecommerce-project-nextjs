// app/admin/settings/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Store,
    CreditCard,
    Bell,
    Shield,
    Palette,
    Save,
    Badge
} from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your marketplace settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>Configure your marketplace preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-1">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="payments">Payments</TabsTrigger>
                                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                                    <TabsTrigger value="security">Security</TabsTrigger>
                                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Store className="mr-2 h-5 w-5" />
                                        General Settings
                                    </CardTitle>
                                    <CardDescription>Manage your marketplace information</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="marketplace-name">Marketplace Name</Label>
                                            <Input id="marketplace-name" defaultValue="VendorHub" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="marketplace-email">Email Address</Label>
                                            <Input id="marketplace-email" defaultValue="admin@vendorhub.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="marketplace-phone">Phone Number</Label>
                                            <Input id="marketplace-phone" defaultValue="+1 (555) 123-4567" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="marketplace-url">Website URL</Label>
                                            <Input id="marketplace-url" defaultValue="https://vendorhub.com" />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Marketplace Features</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Multi-vendor Support</Label>
                                                    <p className="text-sm text-muted-foreground">Allow multiple vendors to sell on your marketplace</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Vendor Reviews</Label>
                                                    <p className="text-sm text-muted-foreground">Allow customers to review vendors</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Product Reviews</Label>
                                                    <p className="text-sm text-muted-foreground">Allow customers to review products</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="payments">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Payment Settings
                                    </CardTitle>
                                    <CardDescription>Configure payment methods and commission rates</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Commission Settings</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                                                <Input id="commission-rate" defaultValue="15" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="payout-frequency">Payout Frequency</Label>
                                                <Input id="payout-frequency" defaultValue="Weekly" />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Payment Methods</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Credit/Debit Cards</Label>
                                                    <p className="text-sm text-muted-foreground">Accept payments via credit and debit cards</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>PayPal</Label>
                                                    <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Bank Transfer</Label>
                                                    <p className="text-sm text-muted-foreground">Accept payments via bank transfer</p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Cryptocurrency</Label>
                                                    <p className="text-sm text-muted-foreground">Accept payments via cryptocurrency</p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Bell className="mr-2 h-5 w-5" />
                                        Notification Settings
                                    </CardTitle>
                                    <CardDescription>Configure how you receive notifications</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Email Notifications</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>New Order</Label>
                                                    <p className="text-sm text-muted-foreground">Notify when a new order is placed</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Vendor Registration</Label>
                                                    <p className="text-sm text-muted-foreground">Notify when a new vendor registers</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Low Stock Alert</Label>
                                                    <p className="text-sm text-muted-foreground">Notify when product stock is low</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Payment Received</Label>
                                                    <p className="text-sm text-muted-foreground">Notify when a payment is received</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Push Notifications</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Browser Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Mobile App</Label>
                                                    <p className="text-sm text-muted-foreground">Receive notifications on your mobile device</p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Shield className="mr-2 h-5 w-5" />
                                        Security Settings
                                    </CardTitle>
                                    <CardDescription>Manage your account security</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Password</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current-password">Current Password</Label>
                                                    <Input id="current-password" type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password">New Password</Label>
                                                    <Input id="new-password" type="password" />
                                                </div>
                                            </div>
                                            <Button>Update Password</Button>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>SMS Authentication</Label>
                                                    <p className="text-sm text-muted-foreground">Use your phone number for authentication</p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Authenticator App</Label>
                                                    <p className="text-sm text-muted-foreground">Use an authenticator app for authentication</p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Login Sessions</h3>
                                        <div className="space-y-4">
                                            <div className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Chrome on Windows</p>
                                                        <p className="text-sm text-muted-foreground">New York, USA • Current session</p>
                                                    </div>
                                                    <Badge>Current</Badge>
                                                </div>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Safari on iPhone</p>
                                                        <p className="text-sm text-muted-foreground">Los Angeles, USA • 2 days ago</p>
                                                    </div>
                                                    <Button variant="outline" size="sm">Revoke</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="appearance">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Palette className="mr-2 h-5 w-5" />
                                        Appearance Settings
                                    </CardTitle>
                                    <CardDescription>Customize the appearance of your marketplace</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Theme</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="border rounded-lg p-4 cursor-pointer border-primary">
                                                <div className="font-medium mb-2">Light</div>
                                                <div className="h-24 rounded bg-white border"></div>
                                            </div>
                                            <div className="border rounded-lg p-4 cursor-pointer">
                                                <div className="font-medium mb-2">Dark</div>
                                                <div className="h-24 rounded bg-gray-800 border"></div>
                                            </div>
                                            <div className="border rounded-lg p-4 cursor-pointer">
                                                <div className="font-medium mb-2">System</div>
                                                <div className="h-24 rounded bg-gradient-to-r from-white to-gray-800 border"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Brand Colors</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="primary-color">Primary Color</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Input id="primary-color" defaultValue="#3b82f6" className="w-24" />
                                                    <div className="w-8 h-8 rounded bg-blue-500"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="secondary-color">Secondary Color</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Input id="secondary-color" defaultValue="#64748b" className="w-24" />
                                                    <div className="w-8 h-8 rounded bg-slate-500"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Logo</h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                                VH
                                            </div>
                                            <div>
                                                <Button variant="outline">Upload Logo</Button>
                                                <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}