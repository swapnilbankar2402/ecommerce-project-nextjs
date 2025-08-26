// app/vendor/settings/page.tsx
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
  Upload,
  Badge
} from 'lucide-react';

export default function VendorSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your store preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="general">Store</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
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
                    Store Information
                  </CardTitle>
                  <CardDescription>Manage your store details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Store Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input id="store-name" defaultValue="TechGadgets" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-email">Email Address</Label>
                        <Input id="store-email" defaultValue="contact@techgadgets.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-phone">Phone Number</Label>
                        <Input id="store-phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-url">Store URL</Label>
                        <Input id="store-url" defaultValue="techgadgets.vendorhub.com" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Store Logo</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        TG
                      </div>
                      <div>
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                        <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Store Description</h3>
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Description</Label>
                      <textarea
                        id="store-description"
                        rows={4}
                        className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        defaultValue="We offer the latest tech gadgets and accessories at competitive prices. Fast shipping and excellent customer service guaranteed."
                      ></textarea>
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
                  <CardDescription>Configure your payment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payout Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input id="bank-name" defaultValue="Chase Bank" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input id="account-name" defaultValue="TechGadgets LLC" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input id="account-number" defaultValue="****1234" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routing-number">Routing Number</Label>
                        <Input id="routing-number" defaultValue="****5678" />
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
                          <Label>Order Status Update</Label>
                          <p className="text-sm text-muted-foreground">Notify when order status changes</p>
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
                          <Label>Customer Review</Label>
                          <p className="text-sm text-muted-foreground">Notify when a customer leaves a review</p>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}